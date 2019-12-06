import axios from 'axios';

const ENTRYPOINT =
  'https://rajapinnat.ymparisto.fi/api/kansalaishavainnot/1.0/requests.json';

export const getObservationPoints = (): Promise<any> => {
  return axios
    .get(ENTRYPOINT, {
      params: {
        start_date: '2019-07-02T00:00:00Z',
        end_date: '2019-12-01T00:00:00Z',
        status: 'open,closed',
        extension: 'true',
      },
    })
    .then(({ data }) => data)
    .catch(error => console.log(error));
};
