import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';

import { Theme } from '../styles';
import { getObservationPoints } from '../utils/api';
import { ObsPointData } from '../utils/types';
import ObservationPoint from './ObservationPoint';

const position = [60.192059, 24.945831];

const SeurantaMap: React.FC<{}> = ({}) => {
  const [obsPoints, setObsPoints] = useState<ObsPointData[]>([]);

  useEffect(() => {
    getObservationPoints().then(setObsPoints);
  }, []);

  useEffect(() => {
    if (obsPoints.length > 0) {
      console.log(obsPoints[0].lat);
    }
  }, [obsPoints]);

  return (
    <MapContainer center={position} zoom={14}>
      <TileLayer
        url="http://tiles.kartat.kapsi.fi/taustakartta/{z}/{x}/{y}.png"
        attribution='&copy; Karttamateriaali <a href="http://www.maanmittauslaitos.fi/avoindata">Maanmittauslaitos</a>'
      />
      {obsPoints.map((item, key) => (
        <ObservationPoint key={key} obs={item} />
      ))}
    </MapContainer>
  );
};

const MapContainer: any = styled(Map)`
  display: flex;
  flex: 1;
`;

export default SeurantaMap;
