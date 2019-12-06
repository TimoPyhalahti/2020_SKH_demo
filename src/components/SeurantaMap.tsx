import React from 'react';
import styled from 'styled-components';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import { Theme } from '../styles';

const position = [60.192059, 24.945831];

const SeurantaMap: React.FC<{}> = ({}) => {
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
