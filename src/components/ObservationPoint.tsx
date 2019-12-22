import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import L from 'leaflet';
import { Marker, Popup, Circle } from 'react-leaflet';

import { Theme } from '../styles';
import { ObsPointData } from '../utils/types';
import { COPYFILE_FICLONE_FORCE } from 'constants';
import { render } from 'react-dom';

interface Props {
  obs: any;
  openModal: any;
}

const NO_COLOR = 'gray';
const COLORS = ['#0eb51f', '#afde16', '#dce312', '#de8716', '#b5110e'];
const LEVEL_OF_NEED = [
  'hyvin vähäinen',
  'pieni',
  'keskisuuri',
  'suurehko',
  'suuri',
];

const getDays = (d1: any, d2: any): number => {
  const diff = d1 - d2;
  const days = Math.floor(diff / 1000 / 60 / 60 / 24);
  return days;
};

const getHours = (d1: any, d2: any): number => {
  const diff = d1 - d2;
  const hours = Math.floor(diff / 1000 / 60 / 60);
  return hours;
};

const calculateS = (obs: any): any => {
  const now = Date.now();
  const t0 = obs.t0;
  let t1 = obs.t1;
  let phase: number = 0;
  let S: number = 0;
  const diffDays = getDays(now, t0);
  const diffHours = getHours(now, t0);
  
  if (!t1) {
    phase = 1;
    S = obs.Sv;
  } else {
    const diffHoursT1 = t1 ? getHours(now, t1) : 0;
    const diffDaysT1 = t1 ? getDays(now, t1) : 0;

    const l = obs.itemObs.length;
    if (diffHoursT1) {
      if (l < 1) {
        phase = 1;
        S = obs.Sv + obs.kSv * diffHoursT1;
      } else if (l < 2) {
        phase = 2;
        S = obs.Ss + obs.kSs * diffHoursT1;
      } else if (l < 3 && diffDaysT1 < obs.Tr) {
        phase = 3;
        S = obs.Sr + obs.kSr * diffHoursT1;
      } else {
        phase = 4;
        S = 1;
      }
    }
  }

  // if (diffDaysT1) {
  //   if (diffDaysT1 < obs.Tv) {
  //     phase = 1;
  //     S = obs.Sv + obs.kSv * diffHoursT1;
  //   } else if (diffDaysT1 < obs.Ts) {
  //     phase = 2;
  //     S = obs.Ss + obs.kSs * diffHoursT1;
  //   } else if (diffDaysT1 < obs.Tr) {
  //     phase = 3;
  //     S = obs.Sr + obs.kSr * diffHoursT1;
  //   } else {
  //     phase = 4;
  //     S = 1;
  //   }
  // }
  console.log(S);
  if (obs.Td && obs.Sd && obs.kSd) {
    if (diffDays <= obs.Td) {
      const bonus = obs.sd + obs.kSd * diffDays;
      S += bonus;
    }
  }

  return { phase, S };
};

const ObservationPoint: React.FC<Props> = (props: Props) => {
  const [renderSettings, setRenderSettings] = useState<any>(null);
  const position: number[] = [props.obs.lat, props.obs.long];

  useEffect(() => {
    let color: string;
    let size: number;
    const settings: any = {};
    if (props.obs.radius !== undefined) {
      const calcs = calculateS(props.obs);
      const realS = Math.max(Math.min(props.obs.Smax, calcs.S), props.obs.Smin);
      settings.S = calcs.S;
      console.log(calcs);
      settings.phase = calcs.phase;
      const index = Math.max(Math.min(Math.floor(realS / (100 / 5)), 4), 0);
      color = COLORS[index];
      size = 50 + index * 4;
      settings.levelOfNeed = LEVEL_OF_NEED[index];
      settings.icon = L.divIcon({
        className: 'pin',
        iconAnchor: [size / 2, size - 2],
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
    } else {
      size = 44;
      color = NO_COLOR;
      settings.levelOfNeed = 'ei määritetty';
      settings.icon = L.divIcon({
        className: 'pin',
        iconAnchor: [size / 2, size / 2],
        labelAnchor: [0, 0],
        popupAnchor: [0, -10],
        html: `<svg xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 512 512"
          width="${size}" 
          height="${size}"
          stroke="black"
          fill="black"
          stroke-width="1" 
          stroke-linecap="round"
          ><path d="M405 136.798L375.202 107 256 226.202 136.798 107 107 136.798 226.202 256 107 375.202 136.798 405 256 285.798 375.202 405 405 375.202 285.798 256z"/></svg>`,
      });
    }

    settings.color = color;
    setRenderSettings(settings);
  }, []);

  return (
    <>
      {renderSettings && (
        <>
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
          (
          <Point position={position} icon={renderSettings.icon}>
            <Tooltip>
              <Header>
                {props.obs.serviceName} <br />
              </Header>
              <hr />
              {renderSettings.levelOfNeed && (
                <Field>
                  <b>Havainnon tarve:</b>
                  {' ' + renderSettings.levelOfNeed}
                </Field>
              )}
              {props.obs.serviceId && (
                <Field>
                  <b>Ilmoituspalvelu:</b>
                  {' ' + props.obs.serviceId}
                </Field>
              )}
              {props.obs.t0 && (
                <Field>
                  <b>Seurantakiinnostuksen alku:</b>
                  {(() => {
                    const d = new Date(props.obs.t0);
                    return (
                      ' ' +
                      d.getDate() +
                      '/' +
                      d.getMonth() +
                      '/' +
                      d.getFullYear() +
                      ' ' +
                      d.getHours() +
                      ':' +
                      d.getMinutes()
                    );
                  })()}
                </Field>
              )}
              {props.obs.itemObs && (
                <Field>
                  <b>
                    Havaintoja alueella seurantakiinnostuksen alun jälkeen:{' '}
                  </b>
                  {' ' + props.obs.itemObs.length}
                </Field>
              )}
              {renderSettings.S && (
                <Field>
                  <b>Seurantakiinnostus (S):</b>
                  {' ' + renderSettings.S}
                </Field>
              )}
              {props.obs.itemObs && (
                <Field>
                  <b>
                    Havaintoja alueella seurantakiinnostuksen alun jälkeen:{' '}
                  </b>
                  {' ' + props.obs.itemObs.length}
                </Field>
              )}
              {renderSettings.phase > 0 && (
                <Field>
                  <b>Nykyinen seurantakiinnostuksen vaihe:</b>
                  {' ' + renderSettings.phase}
                </Field>
              )}
              {props.obs.serviceId && (
                <Button onClick={props.openModal}>Lisää havainto</Button>
              )}
            </Tooltip>
          </Point>
          )
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

const Button: any = styled.p`
  font-size: 1rem;
  line-height: 1rem;
  margin: 15px auto 5px auto !important;
  border-radius: 5px;
  padding: 10px;
  text-align: center;
  background: ${Theme.color.primary};
  &:hover {
    cursor: pointer;
  }
`;

export default ObservationPoint;
