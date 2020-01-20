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
      let p = props.ob.s;
      !props.ob.Spmin && (props.ob.Spmin = 0);
      !props.ob.Spmax && (props.ob.Spmax = 100);

      const diff = Math.abs(props.ob.Spmin - props.ob.Spmax);
      if (props.ob.Spmin <= props.ob.Spmax) {
        p = p - props.ob.Spmin;
        p = Math.max(Math.min(p / diff, 1), 0);
      } else {
        p = p - props.ob.Spmax;
        p = Math.max(Math.min(1 - p / diff, 1), 0);
      }

      p *= 100;

      settings.p = p;
      settings.s = props.ob.s;
      settings.phase = props.ob.phase;
      const index = Math.max(Math.min(Math.floor(p / (100 / 5)), 4), 0);
      if (p > 0) {
        color = COLORS[index];
        settings.levelOfNeed = LEVEL_OF_NEED[index];
        size = 50 + index * 4;
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
        color = 'grey';
        size = 28;
        settings.levelOfNeed = 'ei tarvetta';
        settings.icon = L.divIcon({
          className: 'pin',
          iconAnchor: [size / 2, size / 2],
          labelAnchor: [0, 0],
          popupAnchor: [0, -10],
          html: `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24" width="24" height="24"><defs><path d="M24 12C24 5.38 18.62 0 12 0C5.38 0 0 5.38 0 12C0 18.62 5.38 24 12 24C18.62 24 24 18.62 24 12Z" id="aRBYmkoLF"></path><clipPath id="clipc3FZk9oi4y"><use xlink:href="#aRBYmkoLF" opacity="1"></use></clipPath></defs><g><g><g><use xlink:href="#aRBYmkoLF" 
            opacity="1" 
            fill="${color}" 
            fill-opacity="1">
            </use><g clip-path="url(#clipc3FZk9oi4y)"><use xlink:href="#aRBYmkoLF" 
            opacity="1" 
            fill-opacity="0" 
            stroke="black" 
            stroke-width="2.5" 
            stroke-opacity="1">
            </use></g></g></g></g></svg>`,
        });
      }
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

  const handleClick = () => {
    props.openModal(props.ob.serviceId);
  };

  return (
    <>
      {renderSettings && (
        <>
          {props.ob.radius && renderSettings.p >= 10 && (
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
              {renderSettings.levelOfNeed != null && (
                <>
                  <Header>
                    Havainnon tarve alueella:{' '}
                    <span style={{ color: renderSettings.color }}>
                      <b>{renderSettings.levelOfNeed}</b>
                    </span>{' '}
                    <br />
                  </Header>
                </>
              )}
              {props.ob.serviceId && (
                <Button onClick={handleClick}>Lisää havainto</Button>
              )}
              <hr style={{ margin: '15px 0 15px 0' }} />
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
              {renderSettings.p != null && (
                <Field>
                  <b>Skaalattu seurantakiinnostus (P):</b>
                  {'  ' + renderSettings.p.toFixed(2) + '%'}
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
  font-size: 1.2rem;
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
  margin: 15px auto 0 auto !important;
  border-radius: 5px;
  padding: 10px;
  text-align: center;
  background: ${Theme.color.primary};
  &:hover {
    cursor: pointer;
  }
`;

export default ObservationPoint;
