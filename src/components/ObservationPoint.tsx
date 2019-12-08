import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import L from 'leaflet';
import { Marker, Popup, Circle } from 'react-leaflet';

import { Theme } from '../styles';
import { ObsPointData } from '../utils/types';

interface Props {
  obs: ObsPointData;
}

const ObservationPoint: React.FC<Props> = (props: Props) => {
  const position: number[] = [props.obs.lat, props.obs.long];

  return (
    <>
      <Point position={position} icon={icon}>
        <Tooltip>{props.obs.serviceName}</Tooltip>
      </Point>
      <Circle center={position} radius={10} color={'#3388ff'} />
    </>
  );
};

const Point: any = styled(Marker)`
  background-color: red;
  color: red;
`;

const myCustomColour = '#583470';

const MarkerHtml = `
  background-color: ${myCustomColour};
  width: 30px;
  height: 30px;
  display: inline-block;
  position: relative;
  border-radius: 3rem 3rem 0;
  transform: rotate(45deg);
  border: 1px solid #FFFFFF`;

const icon = L.divIcon({
  className: 'my-custom-pin',
  iconAnchor: [20, 40],
  labelAnchor: [-6, 0],
  popupAnchor: [0, -36],
  html: `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="red" fill-opacity="0.7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-map-pin"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>`,
});

const Tooltip: any = styled(Popup)``;

export default ObservationPoint;
