const toRad = (val: number) => {
  return (val * Math.PI) / 180;
};

export const haverSine = (
  latA: number,
  lonA: number,
  latB: number,
  lonB: number,
) => {
  const R = 6371e3; // metres
  const φ1 = toRad(latA);
  const φ2 = toRad(latB);
  const Δφ = toRad(latB - latA);
  const Δλ = toRad(lonB - lonA);

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const d = R * c;
  return d;
};

export const arrayToObject = (array: any[], key: string) => {
  const initialValue = {};
  return array.reduce((obj, item) => {
    return {
      ...obj,
      [item[key]]: item,
    };
  }, initialValue);
};

export const isInside = (point: number[], vs: number[]) => {
  // ray-casting algorithm based on
  // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html

  const x = point[0], y = point[1];

  let isInside = false;
  for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
      const xi = vs[i][0], yi = vs[i][1];
      const xj = vs[j][0], yj = vs[j][1];

      const intersect = ((yi > y) != (yj > y))
          && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
      if (intersect) {
        isInside = !isInside;
      }
  }

  return isInside;
};

export const hoursBetweenTimestamps = (t0: number, t1: number): number => {
  const diff = t0 - t1;
  const hours = Math.floor(diff / 1000 / 60 / 60);
  return hours;
}