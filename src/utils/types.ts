export interface ObsPointData {
  id: string;
  date: Date;
  lat: number;
  long: number;
  serviceName: string;
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
  minNv: number;
  maxNv: number;
  dSv: number;
  Sv: number;
  kSv: number;
  Ts: number;
  Ss: number;
  kSs: number;
  Tr: number;
  Sr: number;
  kSr: number;
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
