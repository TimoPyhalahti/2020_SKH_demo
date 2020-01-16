import React, { lazy, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Map, Marker, Popup, TileLayer, GeoJSON } from 'react-leaflet';

import { Theme } from '../styles';
import {
  getObservationPoints,
  getMonitoringInterestDefs,
  getMonitoringInterestTriggers,
  getMonitoringInterests,
  getObservationData,
} from '../utils/api';
import {
  ObsPointData,
  MonInterestData,
  MonInterestDefData,
  MonInterestTriggerData,
  ObsData,
} from '../utils/types';
import {
  haverSine,
  arrayToObject,
  hoursBetweenTimestamps,
  isInside
} from '../utils/helpers';
import ObservationPoint from './ObservationPoint';
import Loading from './Loading';
import lakes from '../assets/jarvet.json';

const position = [60.2295, 25.0205];

const SeurantaMap: React.FC<any> = (props: {
  openModal: any;
  hidden: boolean;
}) => {
  const [obsPointItems, setObsPointItems] = useState<ObsPointItemData[]>([]);
  const [obsPoints, setObsPoints] = useState<any>(null);
  const [monInterestDefs, setMonInterestDefs] = useState<any>(null);
  const [monInterests, setMonInterests] = useState<any>(null);
  const [monInterestTriggers, setMonInterestTriggers] = useState<any>(null);
  const [obs, setObs] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    getObservationPoints().then(setObsPoints);
    getMonitoringInterestDefs().then(setMonInterestDefs);
    getMonitoringInterests().then(setMonInterests);
    getMonitoringInterestTriggers().then(arr => {
      setMonInterestTriggers(
        arr.sort((a: any, b: any) => {
          return b.date - a.date;
        }),
      );
    });
  }, []);

  useEffect(() => {
    if (
      obsPoints &&
      obs &&
      monInterestDefs &&
      monInterests &&
      monInterestTriggers
    ) {
      const items: any = [];

      const points = arrayToObject(obsPoints.concat(obs), 'id');

      const defs = arrayToObject(monInterestDefs, 'id');

      monInterests.forEach(interest => {
        const itemData: any = {};
        itemData.id = interest.id;
        itemData.radius = interest.radius;

        const def = defs[interest.monInterestDefId];

        if (def) {
          itemData.Tv = def.Tv;
          itemData.Ts = def.Ts;
          itemData.Tr = def.Tr;
          itemData.Sv = def.Sv;
          itemData.Ss = def.Ss;
          itemData.Sr = def.Sr;
          itemData.kSv = def.kSv;
          itemData.kSs = def.kSs;
          itemData.kSr = def.kSr;
          itemData.Sinf = def.Sinf;
          itemData.dSv = def.dSv;
          itemData.Spmin = def.Spmin;
          itemData.Spmax = def.Spmax;
          itemData.Somin = def.Somin;

          itemData.trigger = null;

          monInterestTriggers.forEach(trig => {
            if (trig.monInterestId === interest.id) {
              if (itemData.trigger && trig.date < itemData.trigger) {
                return;
              }
              if (trig.obsId && points[trig.obsId]) {
                trig.date == points[trig.obsId].date;
              }
              itemData.trigger = trig;
            }
          });

          const firstObs = points[interest.obsId];

          let firstObsId = null;

          if (firstObs) {
            itemData.t0 = firstObs.date;
            itemData.lat = firstObs.lat;
            itemData.long = firstObs.long;
          } else {
            itemData.t0 = interest.date;
            itemData.lat = interest.lat;
            itemData.long = interest.long;
          }

          itemData.created = itemData.t0;
          if (
            itemData.trigger &&
            itemData.trigger.obsId &&
            points[itemData.trigger.obsId]
          ) {
            itemData.t0 = points[itemData.trigger.obsId].date;
          }

          const now = Date.now();
          const obDates: any[] = [now];

          itemData.serviceId =
            itemData.trigger && itemData.trigger.serviceId
              ? itemData.trigger.serviceId
              : interest.serviceId;

          if (itemData.serviceId !== undefined && itemData.serviceId) {
            for (let i = 0; i < obs.length; i++) {
              const ob = obs[i];
              if (itemData.t0 < ob.date) {
                if (
                  ob.serviceId === itemData.serviceId &&
                  ob.id !== firstObsId &&
                  haverSine(ob.lat, ob.long, itemData.lat, itemData.long) <=
                    itemData.radius
                ) {
                  obDates.unshift(ob.date);
                }
              } else {
                break;
              }
            }
          }

          itemData.count = obDates.length - 1;

          let lastDate = itemData.t0;
          let phase = '';
          let hoursElapsed = 0;

          if (itemData.trigger && itemData.trigger.startPhase) {
            switch (itemData.trigger.startPhase) {
              case 'similarity':
                hoursElapsed = itemData.Tv * 24;
                break;
              case 'reobservation':
                hoursElapsed = (itemData.Tv + itemData.Ts) * 24;
                break;
              case 'indefinite':
                hoursElapsed = (itemData.Tv + itemData.Ts + itemData.Tr) * 24;
                break;
              default:
                hoursElapsed = 0;
            }
          }

          obDates.forEach(date => {
            if (date >= itemData.t0) {
              const hours = hoursBetweenTimestamps(date, lastDate);
              let totalHours = hours + hoursElapsed;

              if (totalHours < itemData.Tv * 24) {
                if (
                  (itemData.trigger &&
                    itemData.trigger.phaseSkips.includes('validation')) ||
                  date === now
                ) {
                  hoursElapsed = totalHours;
                  phase = 'validation';
                } else {
                  hoursElapsed = 0;
                  phase = 'validation';
                }
              } else if (totalHours < (itemData.Tv + itemData.Ts) * 24) {
                if (
                  (itemData.trigger &&
                    itemData.trigger.phaseSkips.includes('similarity')) ||
                  date === now
                ) {
                  hoursElapsed = totalHours;
                  phase = 'similarity';
                } else {
                  hoursElapsed = 0;
                  phase = 'validation';
                }
              } else if (
                totalHours <
                (itemData.Tv + itemData.Ts + itemData.Tr) * 24
              ) {
                if (
                  (itemData.trigger &&
                    itemData.trigger.phaseSkips.includes('reobservation')) ||
                  date === now
                ) {
                  hoursElapsed = totalHours;
                  phase = 'reobservation';
                } else {
                  hoursElapsed = 0;
                  phase = 'validation';
                }
              } else {
                if (
                  (itemData.trigger &&
                    itemData.trigger.phaseSkips.includes('indefinite')) ||
                  date === now
                ) {
                  hoursElapsed = totalHours;
                  phase = 'indefinite';
                } else {
                  hoursElapsed = 0;
                  phase = 'validation';
                }
              }
              lastDate = date;
            }
          });

          let s = 0;

          if (phase === 'validation') {
            const hours = hoursElapsed;
            const inc = itemData.kSv ? (itemData.kSv * hours) / 24 : 0;
            s = itemData.Sv + inc;
          } else if (phase === 'similarity') {
            const hours = hoursElapsed - itemData.Tv;
            const inc = itemData.kSs ? (itemData.kSs * hours) / 24 : 0;
            s = itemData.Ss + inc;
          } else if (phase === 'reobservation') {
            const hours =
              hoursElapsed - (itemData.Tv + itemData.Ts + itemData.Tr);
            const inc = itemData.kSr ? (itemData.kSr * hours) / 24 : 0;
            s = itemData.Sr + inc;
          } else if (itemData.Sinf) {
            s = itemData.Sinf;
          }

          if (itemData.trigger && itemData.trigger.Sd) {
            const hours = hoursBetweenTimestamps(lastDate, itemData.t0);
            if (!itemData.trigger.Td || hours < itemData.trigger.Td * 24) {
              const inc = itemData.trigger.kSd
                ? (itemData.trigger.kSd * hours) / 24
                : 0;
              s += itemData.trigger.Sd + inc;
            }
          }

          itemData.s = s;
          itemData.phase = phase;

          for (let i = 0; i < lakes.features.length; i++) {
            const lake = lakes.features[i];
            if (isInside([itemData.lat, itemData.long], lake.geometry.coordinates[0])) {
              itemData.lake = lake.geometry.coordinates[0];
              itemData.lakeName = lake.properties.Nimi;
              break;
            }
          }

          items.push(itemData);
        }
      });

      setLoading(false);
      setObsPointItems(items);
    }
  }, [obsPoints, obs, monInterestDefs, monInterests, monInterestTriggers]);

  useEffect(() => {
    console.log('fetching obs')
    if (monInterestTriggers && monInterests) {
      let items: ObsData[] = [];
      const services: string[] = [];
      monInterestTriggers.forEach(trig => {
        const serv = trig.serviceId;
        if (!services.includes(serv) && serv !== undefined) {
          services.push(serv);
        }
      });
      monInterests.forEach(interest => {
        const serv = interest.serviceId;
        if (!services.includes(serv) && serv !== undefined) {
          services.push(serv);
        }
      });
      Promise.all(
        services.map(item => {
          return getObservationData(item);
        }),
      ).then(data => {
        data.forEach(el => {
          items = items.concat(el);
        });
        items.sort((a: any, b: any) => {
          return b.date - a.date;
        });
        setObs(items);
      });
    }
  }, [monInterestTriggers, monInterests]);

  return (
    <div style={{ display: props.hidden ? 'none' : 'flex', flex: 1 }}>
      {loading ? (
        <Loading />
      ) : (
        <MapContainer center={position} zoom={14}>
          <TileLayer
            url="http://tiles.kartat.kapsi.fi/taustakartta/{z}/{x}/{y}.png"
            attribution='&copy; Karttamateriaali <a href="http://www.maanmittauslaitos.fi/avoindata">Maanmittauslaitos</a>'
          />
          {obsPointItems.map(item => (
            <ObservationPoint
              key={item.id}
              ob={item}
              openModal={props.openModal}
            />
          ))}
          <GeoJSON
              data={lakes}
              style={{
                color: '#006400',
                weight: 5,
                opacity: 0.65
              }}
          />
          {/* {lakes.features.map(item => (
            <GeoJSON
              key={item.properties.JarviTunnu}
              data={item.geometry}
              style={
                color: '#006400',
                weight: 5,
                opacity: 0.65
              }
            /> */}
          ))}
          <LegendContainer>
            <LegendImg />
          </LegendContainer>
        </MapContainer>
      )}
    </div>
  );
};

const MapContainer: any = styled(Map)`
  display: flex;
  flex: 1;
  background: ${Theme.color.primary};
  font-family ${Theme.font.secondary};
`;

const LegendContainer: any = styled.div`
  position: fixed;
  bottom: 10px;
  left: 10px;
  display: flex;
  flex: 1;
  z-index: 999;
`;

const LegendImg: any = styled.img.attrs({
  src: require('../assets/legend.svg'),
})`
  background-color: #ffffff;
  padding: 10px;
  height: 120px;
  border-radius: 4px;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.65);
`;

interface ObsPointItemData {
  id: string;
  date: Date;
  lat: number;
  long: number;
  serviceName: string;
  radius: number;
  pVal: number;
}

export default SeurantaMap;
