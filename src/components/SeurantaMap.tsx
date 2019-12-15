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

const position = [60.2295, 25.0205];

const SeurantaMap: React.FC<{}> = ({}) => {
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
                const itemObs: any[] = [];
                if (z.monServiceId) {
                  for (let l = 0; l < obs.length; l++) {
                    const zx = obs[l];
                    if (zx.id === z.monServiceId) {
                      for (let a = 0; a < zx.items.length; a++) {
                        const zy = zx.items[a];
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

                if (itemObs.length > 0 && !t0) {
                  t0 = itemObs[itemObs.length - 1].date;
                } else if (!t0) {
                  t0 = z.date;
                }

                item.obs = itemObs;
                item.t0 = t0;
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
    <>
      {loading ? (
        <Loading />
      ) : (
        <MapContainer center={position} zoom={14}>
          <TileLayer
            url="http://tiles.kartat.kapsi.fi/taustakartta/{z}/{x}/{y}.png"
            attribution='&copy; Karttamateriaali <a href="http://www.maanmittauslaitos.fi/avoindata">Maanmittauslaitos</a>'
          />
          {obsPointItems.map(item => (
            <ObservationPoint key={item.id} obs={item} />
          ))}
          <LegendContainer>Havainnon tarve alueella</LegendContainer>
        </MapContainer>
      )}
    </>
  );
};

const MapContainer: any = styled(Map)`
  display: flex;
  flex: 1;
  background: ${Theme.color.primary};
`;

const LegendContainer: any = styled.div`
  display: flex;
  flex: 1;
  background: ${Theme.color.primary};
`;

const LegendHeader: any = styled.p`
  font-sixe: 2rem;
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
