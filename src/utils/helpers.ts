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
