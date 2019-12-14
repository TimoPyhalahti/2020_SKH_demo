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
    getMonitoringInterestTriggers().then(setMonInterestTriggers);
    // getObservationData('snow_combined_service_code_201806122300251');
  }, []);

  useEffect(() => {
    if (obsPoints && obs && monInterestDefs && monInterests) {
      const items = obsPoints.map(item => {
        for (let i = 0; i < monInterests.length; i++) {
          const x = monInterests[i];
          if (x.obsPointId === item.id) {
            item.radius = x.radius;
            for (let j = 0; j < monInterestDefs.length; j++) {
              const y = monInterestDefs[j];
              if (y.id === x.monInterestDefId) {
                item.Tv = y.Tv;
                break;
              }
            }

            for (let k = 0; k < monInterestTriggers.length; k++) {
              console.log(obs)
              const z = monInterestTriggers[k];
              if (x.id === z.monInterestId) {
                item.triggerDate = z.date;
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
  }, [obsPoints, obs, monInterestDefs, monInterests]);

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
      ).then(data => setObs(data));
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
  range: number;
  pVal: number;
}

export default SeurantaMap;
