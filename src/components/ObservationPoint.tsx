import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import L from 'leaflet';
import { Marker, Popup, Circle } from 'react-leaflet';

import { Theme } from '../styles';
import { tsToString } from '../utils/helpers';

interface Props {
  ob: any;
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

const ObservationPoint: React.FC<Props> = (props: Props) => {
  const [renderSettings, setRenderSettings] = useState<any>(null);
  const position: number[] = [props.ob.lat, props.ob.long];

  useEffect(() => {
    let color: string;
    let size: number;
    const settings: any = {};
    if (props.ob.radius !== undefined) {
      let realS = props.ob.s;

      realS = props.ob.Spmin != null ? Math.max(props.ob.Spmin, realS) : realS;
      realS = props.ob.Spmax != null ? Math.min(props.ob.Spmax, realS) : realS;

      settings.s = realS;
      settings.phase = props.ob.phase;
      const index = Math.max(Math.min(Math.floor(realS / (100 / 5)), 4), 0);
      color = COLORS[index];
      size = 50 + index * 4;
      settings.levelOfNeed = LEVEL_OF_NEED[index];
      settings.icon = L.divIcon({
        className: 'pin',
        iconAnchor: [size / 2, size - 9],
        labelAnchor: [-6, 0],
        popupAnchor: [0, (size - 20) * -1],
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
          {props.ob.radius && renderSettings.s >= 10 && (
            <Circle
              center={position}
              radius={props.ob.radius}
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
                Havaintopaikka <br />
              </Header>
              <hr />
              {renderSettings.levelOfNeed != null && (
                <Field>
                  <b>Havainnon tarve:</b>
                  {'  ' + renderSettings.levelOfNeed}
                </Field>
              )}
              {props.ob.serviceId != null && (
                <Field>
                  <b>Ilmoituspalvelu:</b>
                  {'  ' + props.ob.serviceId}
                </Field>
              )}
              {props.ob.created != null && (
                <Field>
                  <b>Seurantakiinnostuksen alku:</b>
                  {(() => {
                    return '  ' + tsToString(props.ob.created);
                  })()}
                </Field>
              )}
              {props.ob.t0 != null && props.ob.created != null && (
                <Field>
                  <b>Viimeisin kiinnostuksen herätys:</b>
                  {(() => {
                    if (props.ob.trigger) {
                      return '  ' + tsToString(props.ob.t0);
                    } else {
                      return '  ---';
                    }
                  })()}
                </Field>
              )}
              {props.ob.s != null && (
                <Field>
                  <b>Viimeisin havainto:</b>
                  {(() => {
                    if (props.ob.lastObDate != null) {
                      return '  ' + tsToString(props.ob.lastObDate);
                    } else {
                      return '  ---';
                    }
                  })()}
                </Field>
              )}
              {props.ob.count != null && (
                <Field>
                  <b>Havaintoja alueella seurantakiinnostuksen alun jälkeen:</b>
                  {'  ' + props.ob.count}
                </Field>
              )}
              {renderSettings.s != null && (
                <Field>
                  <b>Seurantakiinnostus (S):</b>
                  {'  ' + renderSettings.s.toFixed(2)}
                </Field>
              )}
              {props.ob.phase != null && (
                <Field>
                  <b>Nykyinen seurantakiinnostuksen vaihe:</b>
                  {'  ' +
                    (() => {
                      switch (renderSettings.phase) {
                        case 'validation':
                          return 'validointi';
                        case 'similarity':
                          return 'samankaltaisuusvaihe';
                        case 'reobservation':
                          return 'uudelleenhavaitseminen';
                        default:
                          return 'perusvaihe';
                      }
                    })()}
                </Field>
              )}
              {props.ob.serviceId && (
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
