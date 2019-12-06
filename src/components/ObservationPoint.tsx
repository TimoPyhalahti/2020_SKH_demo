import React from 'react';
import styled from 'styled-components';
import { Marker, Popup } from 'react-leaflet';

import { Theme } from '../styles';
import { ObsPointData } from '../utils/types';

type Props = {
  obs: ObsPointData;
};

const ObservationPoint: React.FC<Props> = (props: Props) => {
  const position = [props.obs.lat, props.obs.long];
  console.log(position)

  return (
    <Point position={position}>
      <Tooltip>{props.obs.serviceName}</Tooltip>
    </Point>
  );
};

const Point: any = styled(Marker)`
  display: flex;
  flex: 1;
  background-color: ${Theme.color.primary};
  margin: 5px;
`;

const Tooltip: any = styled(Popup)``;

export default ObservationPoint;
