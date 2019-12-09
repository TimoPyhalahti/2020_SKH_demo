import axios from 'axios';

import {
  ObsPointData,
  MonInterestData,
  MonInterestDefData,
  MonInterestTriggerData,
  ObsData,
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
        service_code: 'monint_smodel_service_code_201911181743121',
        extension: 'true',
      },
    })
    .then(({ data }) => {
      const items: MonInterestDefData[] = data.map((item: any) => ({
        id: item.service_request_id,
        date: Date.parse(item.requested_datetime),
        lat: Number(item.lat.replace(/,/, '.')),
        long: Number(item.long.replace(/,/, '.')),
        Tv: Number(item.attributes.monint_Tv_number_201911181747260.replace(/,/, '.')),
        minNv: Number(item.attributes.monint_minNv_number_201911181759422.replace(/,/, '.')),
        maxNv: Number(item.attributes.monint_maxNv_number_201911181800316.replace(/,/, '.')),
        dSv: Number(item.attributes.monint_dSv_number_201911181801125.replace(/,/, '.')),
        Sv: Number(item.attributes.monint_Sv_number_201911181748151.replace(/,/, '.')),
        kSv: Number(item.attributes.monint_kSv_number_201911181757490.replace(/,/, '.')),
        Ts: Number(item.attributes.monint_Ts_number_201911181749390.replace(/,/, '.')),
        Ss: Number(item.attributes.monint_Ss_number_201911181751337.replace(/,/, '.')),
        kSs: Number(item.attributes.monint_kSs_number_201911181755104.replace(/,/, '.')),
        Tr: Number(item.attributes.monint_Tr_number_201911181752532.replace(/,/, '.')),
        Sr: Number(item.attributes.monint_Sr_number_201911181753213.replace(/,/, '.')),
        kSr: Number(item.attributes.monint_kSr_number_201911181756432.replace(/,/, '.')),
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
        startPhase:
          Number(item.attributes
            .monint_startevent_startphase_singlevaluelist_201912031300515.replace(/,/, '.')),
        passPhase:
          Number(item.attributes
            .monint_startevent_passphases_multivaluelist_201912031300516.replace(/,/, '.')),
        Smin: Number(item.attributes.monint_Smin_number_201912031319308.replace(/,/, '.')),
        Smax: Number(item.attributes.monint_Smax_number_201912031321158.replace(/,/, '.')),
        Td: Number(item.attributes.monint_Td_number_201912031300517.replace(/,/, '.')),
        Sd: Number(item.attributes.monint_Sd_number_201912031300519.replace(/,/, '.')),
        kSd: Number(item.attributes.monint_kSd_number_201912031300520.replace(/,/, '.')),
      }));
      return items;
    })
    .catch(error => {
      console.log(error);
      return [];
    });
};

export const getObservationData = (serviceCode: string): Promise<ObsData[]> => {
  return axios
    .get(ENTRYPOINT, {
      params: {
        service_code: serviceCode,
        extension: 'true',
      },
    })
    .then(({ data }) => {
      const items: ObsData[] = data.map((item: any) => ({
        id: item.service_request_id,
        date: Date.parse(item.requested_datetime),
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
