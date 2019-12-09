import React from 'react';
import styled from 'styled-components';

function LoadingAnimation(): React.ReactElement {
  return (
    <Container>
      <Subcontainer>
        <Animation />
      </Subcontainer>
    </Container>
  );
}

const Container: any = styled.div`
  flex-grow: 1;
  display: flex;
  justify-content: center;
`;

const Subcontainer: any = styled.div`
  align-self: center;
`;

const Animation: any = styled.img.attrs({
  src: require('../assets/loading.svg'),
})`
  width: 100px;
`;

export default LoadingAnimation;
