export interface ObsPointData {
  id: string;
  date: Date;
  lat: number;
  long: number;
  serviceName: string;
  radius?: number;
  Tv?: number;
  Ts?: number;
  Tr?: number;
  Sv?: number;
  Ss?: number;
  Sr?: number;
  kSv?: number;
  kSs?: number;
  kSr?: number;
  Sinf?: number;
  Somin?: number;
  Spmin?: number;
  Spmax?: number;
  dSv?: number;
  serviceId?: string;
  Smin?: number;
  Smax?: number;
  Td?: number;
  Sd?: number;
  kSd?: number;
}

export interface MonInterestData {
  id: string;
  date: Date;
  obsPointId: string;
  monInterestDefId: string;
  lat: number;
  long: number;
  radius: number;
}

export interface MonInterestDefData {
  id: string;
  date: Date;
  lat: number;
  long: number;
  Tv: number;
  Ts: number;
  Tr: number;
  Sv: number;
  Ss: number;
  Sr: number;
  kSv: number;
  kSs: number;
  kSr: number;
  Sinf: number;
  Somin: number;
  Spmin: number;
  Spmax: number;
  dSv: number;
}

export interface MonInterestTriggerData {
  id: string;
  date: Date;
  monInterestId: string;
  obsId: string;
  monServiceId: string;
  lat: number;
  long: number;
  startPhase: number;
  passPhase: number;
  Smin: number;
  Smax: number;
  Td: number;
  Sd: number;
  kSd: number;
}

export interface ObsData {
  id: string;
  date: Date;
  lat: number;
  long: number;
}

export interface ObsRes {
  id: string;
  items: ObsData[];
}
