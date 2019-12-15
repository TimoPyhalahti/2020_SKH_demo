import axios from 'axios';

import {
  ObsPointData,
  MonInterestData,
  MonInterestDefData,
  MonInterestTriggerData,
  ObsData,
  ObsRes,
} from './types';

const ENTRYPOINT =
  'https://rajapinnat.ymparisto.fi/api/kansalaishavainnot/1.0/requests.json';

export const getObservationPoints = (): Promise<ObsPointData[]> => {
  return axios
    .get(ENTRYPOINT, {
      params: {
        status: 'valid, open',
        service_code: 'staticobservationsite_service_code_201907020935326',
        extension: 'true',
      },
    })
    .then(({ data }) => {
      const items: ObsPointData[] = data.map((item: any) => ({
        id: item.service_request_id,
        date: Date.parse(item.requested_datetime),
        serviceName: item.service_name,
        lat: Number(item.lat.replace(/,/, '.')),
        long: Number(item.long.replace(/,/, '.')),
      }));
      return items;
    })
    .catch(error => {
      console.log(error);
      return [];
    });
};

export const getMonitoringInterests = (): Promise<MonInterestData[]> => {
  return axios
    .get(ENTRYPOINT, {
      params: {
        service_code: 'monint_basicsite_service_code_201911180952014',
        extension: 'true',
      },
    })
    .then(({ data }) => {
      const items: MonInterestData[] = data.map((item: any) => ({
        id: item.service_request_id,
        date: Date.parse(item.requested_datetime),
        obsPointId: item.attributes.string_201911180958422,
        monInterestDefId: item.attributes.string_201911180959219,
        lat: Number(item.lat.replace(/,/, '.')),
        long: Number(item.long.replace(/,/, '.')),
        radius: Number(item.attributes.number_201911180956460),
      }));
      return items;
    })
    .catch(error => {
      console.log(error);
      return [];
    });
};

export const getMonitoringInterestDefs = (): Promise<MonInterestDefData[]> => {
  return axios
    .get(ENTRYPOINT, {
      params: {
        service_code: 'monint_smodel_service_code_201912121702022',
        extension: 'true',
      },
    })
    .then(({ data }) => {
      console.log(data)
      const items: MonInterestDefData[] = data.map((item: any) => ({
        id: item.service_request_id,
        date: Date.parse(item.requested_datetime),
        lat: Number(item.lat.replace(/,/, '.')),
        long: Number(item.long.replace(/,/, '.')),
        Tv: Number(
          item.attributes.monint_Tv_number_201912121702023.replace(/,/, '.'),
        ),
        Ts: Number(
          item.attributes.monint_Ts_number_201912121702030.replace(/,/, '.'),
        ),
        Tr: Number(
          item.attributes.monint_Tr_number_201912121702034.replace(/,/, '.'),
        ),
        Sv: Number(
          item.attributes.monint_Sv_number_201912121702028.replace(/,/, '.'),
        ),
        Ss: Number(
          item.attributes.monint_Ss_number_201912121702032.replace(/,/, '.'),
        ),
        Sr: Number(
          item.attributes.monint_Sr_number_201912121702035.replace(/,/, '.'),
        ),
        kSv: Number(
          item.attributes.monint_kSv_number_201912121702029.replace(/,/, '.'),
        ),
        kSs: Number(
          item.attributes.monint_kSs_number_201912121702033.replace(/,/, '.'),
        ),
        kSr: Number(
          item.attributes.monint_kSr_number_201912121702037.replace(/,/, '.'),
        ),
        Sinf: Number(
          item.attributes.monint_Sinf_number_201912121702038.replace(/,/, '.'),
        ),
        dSv: Number(
          item.attributes.monint_dSv_number_201912121702027.replace(/,/, '.'),
        ),
        Spmin: Number(
          item.attributes.monint_Spmin_number_201912121753281.replace(/,/, '.'),
        ),
        Spmax: Number(
          item.attributes.monint_Spmax_number_201912121756330.replace(/,/, '.'),
        ),
        Somin: Number(
          item.attributes.monint_Somin_number_201912121743338.replace(/,/, '.'),
        ),
      }));
      return items;
    })
    .catch(error => {
      console.log(error);
      return [];
    });
};

export const getMonitoringInterestTriggers = (): Promise<MonInterestTriggerData[]> => {
  return axios
    .get(ENTRYPOINT, {
      params: {
        service_code: 'monint_startevent_service_code_201912031300509',
        extension: 'true',
      },
    })
    .then(({ data }) => {
      const items: MonInterestTriggerData[] = data.map((item: any) => ({
        id: item.service_request_id,
        date: Date.parse(item.requested_datetime),
        monInterestId:
          item.attributes
            .monint_startevent_siteofinterest_string_201912031300511,
        obsId:
          item.attributes.monint_startevent_initeventid_string_201912031300512,
        monServiceId:
          item.attributes.monint_startevent_initiatingsc_string_201912031300514,
        lat: Number(item.lat.replace(/,/, '.')),
        long: Number(item.long.replace(/,/, '.')),
        startPhase: Number(
          item.attributes.monint_startevent_startphase_singlevaluelist_201912031300515.replace(
            /,/,
            '.',
          ),
        ),
        passPhase: Number(
          item.attributes.monint_startevent_passphases_multivaluelist_201912031300516.replace(
            /,/,
            '.',
          ),
        ),
        Smin: Number(
          item.attributes.monint_Smin_number_201912031319308.replace(/,/, '.'),
        ),
        Smax: Number(
          item.attributes.monint_Smax_number_201912031321158.replace(/,/, '.'),
        ),
        Td: Number(
          item.attributes.monint_Td_number_201912031300517.replace(/,/, '.'),
        ),
        Sd: Number(
          item.attributes.monint_Sd_number_201912031300519.replace(/,/, '.'),
        ),
        kSd: Number(
          item.attributes.monint_kSd_number_201912031300520.replace(/,/, '.'),
        ),
      }));
      return items;
    })
    .catch(error => {
      console.log(error);
      return [];
    });
};

export const getObservationData = (serviceCode: string): Promise<ObsRes> => {
  const obsRes: any = { id: serviceCode };
  return axios
    .get(ENTRYPOINT, {
      params: {
        service_code: serviceCode,
        extension: 'true',
      },
    })
    .then(({ data }) => {
      obsRes.items = data.map((item: any) => ({
        id: item.service_request_id,
        date: Date.parse(item.requested_datetime),
        lat: Number(item.lat.replace(/,/, '.')),
        long: Number(item.long.replace(/,/, '.')),
      }));
      return obsRes;
    })
    .catch(error => {
      console.log(error);
      obsRes.items = [];
      return obsRes;
    });
};
