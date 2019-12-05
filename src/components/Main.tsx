import React from 'react';
import styled from 'styled-components';

import { Theme } from '../styles';
import SeurantaMap from './SeurantaMap';

const position = [51.505, -0.09];

type Props = {};

const Main: React.FC<Props> = ({}) => {
  return (
    <Container>
      <SeurantaMap />
    </Container>
  );
};

const Container: any = styled.div`
  display: flex;
  flex: 1;
  background-color: ${Theme.color.primary};
  margin: 5px;
`;

const Loading: any = styled.img.attrs(() => ({
  src: require('../assets/loading.svg'),
}))`
  color: ${Theme.color.secondary};
  width: 10rem;
  margin: auto;
`;

export default Main;
