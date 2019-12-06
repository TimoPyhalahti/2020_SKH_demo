import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import { Theme } from '../styles';
import { getObservationPoints } from '../utils/api';

const position = [60.192059, 24.945831];

const SeurantaMap: React.FC<{}> = ({}) => {
  const [observationPoints, setObservationPoints] = useState([]);

  useEffect(() => {
    getObservationPoints().then(setObservationPoints);
  }, [])

  useEffect(() => {
    console.log(observationPoints);
  }, [observationPoints])

  return (
    <MapContainer center={position} zoom={14}>
      <TileLayer
        url="http://tiles.kartat.kapsi.fi/taustakartta/{z}/{x}/{y}.png"
        attribution='&copy; Karttamateriaali <a href="http://www.maanmittauslaitos.fi/avoindata">Maanmittauslaitos</a>'
      />
      <Marker position={position}>
        <Popup>
          A pretty CSS3 popup.
          <br />
          Easily customizable.
        </Popup>
      </Marker>
    </MapContainer>
  );
};

const MapContainer: any = styled(Map)`
  display: flex;
  flex: 1;
`;

export default SeurantaMap;
