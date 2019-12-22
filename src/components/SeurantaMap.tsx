import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';

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
import { haverSine } from '../utils/helpers';
import ObservationPoint from './ObservationPoint';
import Loading from './Loading';
import { prependOnceListener } from 'cluster';

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
      const items = obsPoints.map(item => {
        for (let i = 0; i < monInterests.length; i++) {
          const x = monInterests[i];
          if (x.obsPointId === item.id) {
            item.radius = x.radius;

            for (let j = 0; j < monInterestDefs.length; j++) {
              const y = monInterestDefs[j];
              if (y.id === x.monInterestDefId) {
                item.Tv = y.Tv;
                item.Ts = y.Ts;
                item.Tr = y.Tr;
                item.Sv = y.Sv;
                item.Ss = y.Ss;
                item.Sr = y.Sr;
                item.kSv = y.kSv;
                item.kSs = y.kSs;
                item.kSr = y.kSr;
                item.Sinf = y.Sinf;
                item.dSv = y.dSv;
                item.Spmin = y.Spmin;
                item.Spmax = y.Spmax;
                item.Somin = y.Somin;
                break;
              }
            }

            for (let k = 0; k < monInterestTriggers.length; k++) {
              const z = monInterestTriggers[k];
              if (x.id === z.monInterestId) {
                let t0: any = null;
                let t1: any = null;
                if (z.obsId) {
                  const serviceId = item.serviceId
                    ? item.serviceId
                    : z.monServiceId;
                  if (serviceId) {
                    for (let l = 0; l < obs.length; l++) {
                      const zx = obs[l];
                      if (zx.id === serviceId) {
                        for (let a = 0; a < zx.items.length; a++) {
                          const zy = zx.items[a];
                          if (zy.id === z.obsId) {
                            t0 = zy.date;
                            break;
                          }
                        }
                        break;
                      }
                    }
                  }
                }
                if (!t0) {
                  t0 = z.date;
                }

                const itemObs: any[] = [];

                if (z.monServiceId) {
                  for (let l = 0; l < obs.length; l++) {
                    const zx = obs[l];
                    if (zx.id === z.monServiceId) {
                      for (let a = 0; a < zx.items.length; a++) {
                        const zy = zx.items[a];
                        if (zy.date < t0) {
                          break;
                        }
                        if (
                          haverSine(zy.lat, zy.long, item.lat, item.long) <=
                          item.radius
                        ) {
                          itemObs.push(zy);
                        }
                      }
                      break;
                    }
                  }
                }

                if (itemObs.length > 0 && !t1) {
                  console.log(itemObs)
                  t1 = itemObs.pop().date;
                }

                item.itemObs = itemObs;
                item.t0 = t0;
                item.t1 = t1;
                item.serviceId = z.monServiceId;
                item.Smin = z.Smin;
                item.Smax = z.Smax;
                item.Td = z.Td;
                item.Sd = z.Sd;
                item.kSd = z.kSd;
                break;
              }
            }
            break;
          }
        }
        return item;
      });
      setLoading(false);
      setObsPointItems(items);
    }
  }, [obsPoints, obs, monInterestDefs, monInterests, monInterestTriggers]);

  useEffect(() => {
    if (monInterestTriggers) {
      const items = [];
      const services: string[] = [];
      monInterestTriggers.forEach(trigger => {
        const serv = trigger.monServiceId;
        if (!services.includes(serv)) {
          services.push(serv);
        }
      });
      Promise.all(
        services.map(item => {
          return getObservationData(item);
        }),
      ).then(data => {
        console.log(data);
        data.forEach(el => {
          el.items.sort((a: any, b: any) => {
            return b.date - a.date;
          });
        });
        setObs(data);
      });
    }
  }, [monInterestTriggers]);

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
              obs={item}
              openModal={props.openModal}
            />
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
