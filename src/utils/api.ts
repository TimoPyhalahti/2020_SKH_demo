import axios from 'axios';

import { ObsPointData } from './types';

const ENTRYPOINT =
  'https://rajapinnat.ymparisto.fi/api/kansalaishavainnot/1.0/requests.json';

export const getObservationPoints = (): Promise<ObsPointData[]> => {
  return axios
    .get(ENTRYPOINT, {
      params: {
        start_date: '2019-07-02T00:00:00Z',
        end_date: '2019-12-01T00:00:00Z',
        status: 'open,closed',
        extension: 'true',
      },
    })
    .then(({ data }) => {
      const obs: ObsPointData[] = data.map((item: any) => ({
        lat: Number(item.lat.replace(/,/, '.')),
        long: Number(item.long.replace(/,/, '.')),
        serviceName: item.service_name,
      }));
      return obs;
    })
    .catch(error => {
      console.log(error);
      return [];
    });
};
