import React from 'react';
import styled from 'styled-components';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import "leaflet/dist/leaflet.css";

import { Theme } from '../styles';

const position = [51.505, -0.09];

const SeurantaMap: React.FC<{}> = ({}) => {
  return (
      <MapContainer center={position} zoom={13}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
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
