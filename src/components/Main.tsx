import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import { Theme } from '../styles';
import SeurantaMap from './SeurantaMap';

type Props = {};

const Main: React.FC<Props> = ({}) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalService, setModalService] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {}, []);

  const handleClick = (serviceId: string) => {
    if (serviceId === modalService) {
    } else {
      setModalService(serviceId);
    }
    setModalOpen(true);

    // fetch and run the citobsdb widget script
    const script = document.createElement('script');
    script.type = 'text/javascript';
    document.getElementsByTagName('head')[0].appendChild(script);
    //script.src = 'https://www.jarviwiki.fi/common/citobsembed.js';
    script.src = require('../assets/citobs.js');
    const divs: HTMLCollectionOf<Element> = document.getElementsByClassName(
      'citobso311_content',
    );
    console.log(divs);

    const timer = setTimeout(() => {
      const divs: HTMLCollectionOf<Element> = document.getElementsByClassName(
        'citobso311_content',
      );
      console.log(divs);
    }, 6000);
    return () => clearTimeout(timer);
  };

  return (
    <Container>
      <div style={{ display: modalOpen ? 'flex' : 'none', flex: 1 }}>
        {modalOpen && (
          <ModalContainer>
            <ModalButton onClick={() => setModalOpen(false)}>X</ModalButton>
            <WidgetContainer
              style={{ display: loading ? 'none' : 'flex' }}
              dangerouslySetInnerHTML={{
                __html: createWidgetBody(modalService),
              }}
            />
            {loading && <Loading />}
          </ModalContainer>
        )}
      </div>
      <SeurantaMap
        hidden={modalOpen}
        openModal={(serviceId: string) => handleClick(serviceId)}
      />
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
  right: 30px;
  font-size: 1.5rem;
  color: black;
  &:hover {
    cursor: pointer;
  }
`;

const WidgetContainer: any = styled.div``;

const createWidgetBody = (serviceId: string) => `
  <div class="CitObsO311Widget"
    data-type="SingleServiceQuestionnaire"
    data-service_code="${serviceId}"
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
