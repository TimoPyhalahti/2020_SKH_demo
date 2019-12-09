import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import L from 'leaflet';
import { Marker, Popup, Circle } from 'react-leaflet';

import { Theme } from '../styles';
import { ObsPointData } from '../utils/types';
import { unstable_renderSubtreeIntoContainer, render } from 'react-dom';

interface Props {
  obs: ObsPointData;
}

const NO_COLOR = 'gray';
const COLORS = ['#0eb51f', '#afde16', '#dce312', '#de8716', '#b5110e'];
const LEVEL_OF_NEED = [
  'ei tarvetta',
  'pieni',
  'keskisuuri',
  'suurehko',
  'suuri',
];

const ObservationPoint: React.FC<Props> = (props: Props) => {
  const [renderSettings, setRenderSettings] = useState<any>(null);
  const position: number[] = [props.obs.lat, props.obs.long];

  useEffect(() => {
    let color: string;
    let size: number;
    const settings: any = {};

    if (
      props.obs.Sd !== undefined &&
      props.obs.Smax !== undefined &&
      props.obs.Smin !== undefined
    ) {
      const index = Math.max(Math.min(Math.floor(props.obs.Sd / 20 + 1), 4), 0);
      color = COLORS[index];
      size = 40 + index * 4;
      settings.levelOfNeed = LEVEL_OF_NEED[index];
    } else {
      size = 40;
      color = NO_COLOR;
    }

    const icon = L.divIcon({
      className: 'pin',
      iconAnchor: [size / 2, size],
      labelAnchor: [-6, 0],
      popupAnchor: [0, (size - 4) * -1],
      html: `<svg xmlns="http://www.w3.org/2000/svg" 
        width="${size}" 
        height="${size}" 
        viewBox="0 0 24 24" 
        fill="${color}"
        fill-opacity="0.8" 
        stroke="black" 
        stroke-width="1.5" stroke-linecap="round" 
        stroke-linejoin="round" 
        class="feather feather-map-pin">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
        <circle cx="12" cy="10" r="3"></circle></svg>`,
    });

    settings.color = color;
    settings.icon = icon;
    setRenderSettings(settings);
  }, []);

  return (
    <>
      {renderSettings && (
        <>
          (
          <Point position={position} icon={renderSettings.icon}>
            <Tooltip>
              <Header>
                {props.obs.serviceName} <br />
              </Header>
              <hr/>
              {renderSettings.levelOfNeed && (
                <Field><b>Havainnon tarve:</b>{' ' + renderSettings.levelOfNeed}</Field>
              )}
              {props.obs.serviceId && (
                <Field><b>Ilmoituspalvelu:</b>{' ' + props.obs.serviceId}</Field>
              )}
            </Tooltip>
          </Point>
          )
          {props.obs.radius && (
            <Circle
              center={position}
              radius={props.obs.radius}
              color={'black'}
              fillColor={renderSettings.color}
              weight={1}
              opacity={0.6}
              fillOpacity={0.65}
            />
          )}
        </>
      )}
    </>
  );
};

const Point: any = styled(Marker)``;

const Tooltip: any = styled(Popup)`
  flex: 1;
  flex-direction: column;

`;

const Header: any = styled.p`
  font-size: 1rem;
  margin: 0 !important;
`;

const Field: any = styled.p`
  font-size: 0.8rem;
  line-height: 1rem;
  margin: 8px 0 0 0 !important;
`;

export default ObservationPoint;
