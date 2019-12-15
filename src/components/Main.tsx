import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import { Theme } from '../styles';
import SeurantaMap from './SeurantaMap';

type Props = {};

const Main: React.FC<Props> = ({}) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalCreated, setModalCreated] = useState<boolean>(false);

  useEffect(() => {
    if (modalOpen && !modalCreated) {
      setModalCreated(true);
    }
  }, [modalOpen]);

  return (
    <Container>
      <div style={{ display: modalOpen ? 'flex' : 'none', flex: 1 }}>
        {modalCreated && (
          <ModalContainer>
            <ModalButton onClick={() => setModalOpen(false)}>X</ModalButton>
            {modalOpen}
            <WidgetContainer dangerouslySetInnerHTML={{ __html: widgetBody }} />
          </ModalContainer>
        )}
      </div>
      <SeurantaMap hidden={modalOpen} openModal={() => setModalOpen(true)} />
    </Container>
  );
};

const Container: any = styled.div`
  display: flex;
  flex: 1;
  background-color: ${Theme.color.primary};
`;

const ModalContainer: any = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: white;
  overflow: scroll;
  overflow-x: scroll;
  padding: 5px 10px 10px 10px;
  color: black;
`;

const ModalButton: any = styled.p`
  position: fixed;
  top: 5px;
  right: 5px;
  margin: 3px 10px 0 0;
  font-size: 1.5rem;
  color: black;
  &:hover {
    cursor: pointer;
  }
`;

const WidgetContainer: any = styled.div``;

const widgetBody: string = `
  <div class="CitObsO311Widget"
  data-type="SingleServiceQuestionnaire"
  data-service_code="snow_combined_service_code_201806122300251"
  data-show-service_name="true"
  data-show-service_description="true"
  data-show-map="true"
  data-map-height="300"
  data-show-obses="true"
  data-obses-max_age="10"
  data-obses-radius="9"
  data-obses-label=""
  data-obses-color=""
  data-obses-cluster="true"
  data-show-questionnaire="true"
  data-images-count="2"
  data-api-key="3862e067-0326-4678-ad03-56811bbb8638"
></div>`;

const Loading: any = styled.img.attrs(() => ({
  src: require('../assets/loading.svg'),
}))`
  color: ${Theme.color.secondary};
  width: 10rem;
  margin: auto;
`;

export default Main;
