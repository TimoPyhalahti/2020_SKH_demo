import React from 'react';
import styled from 'styled-components';

import { Theme } from '../styles';

type Props = {}

const Main: React.FC<Props> = ({ }) => {

  return (
    <Col>
      <Row>
        <Container>
          <Heading>There</Heading>
        </Container>
        <Container>
          <Heading>is</Heading>
        </Container>
      </Row>
      <Row>
        <Container>
          <Heading>text.</Heading>
        </Container>
        <Container>
          <Loading />
        </Container>
      </Row>
    </Col>
  )
}

const Col: any = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 5px;
`;

const Row: any = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
`;

const Container: any = styled.div`
  display: flex;
  flex: 1;
  background-color: ${Theme.color.primary};
  margin: 5px;
`;

const Heading: any = styled.p`
  color: ${Theme.color.secondary};
  font-family: ${Theme.font.secondary};
  font-size: 7rem;
  margin: auto;
`;

const Loading: any = styled.img.attrs(() => ({
  src: require('../assets/loading.svg'),
}))`
  color: ${Theme.color.secondary};
  width: 10rem;
  margin: auto;
`;

export default Main;
