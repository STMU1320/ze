import Utils from 'utils';
import * as Vec2 from 'gl-matrix/src/gl-matrix/vec2';

export default function (points, smooth) {
  smooth = Utils.clamp(smooth, 0, 1);
  const cps = [];
  let v = [], v1 = [], v2 = [];
  let prevPoint, nextPoint;

  for (let i = 0, len = points.length; i < len; i++) {
    const point = points[i];
    if (i === 0 || i === len - 1) {
      cps.push(point);
    } else {
      prevPoint = points[i - 1];
      nextPoint = points[i + 1];
      Vec2.sub(v, nextPoint, prevPoint);
      Vec2.scale(v, v, smooth);
      let d0 = Vec2.distance(point, prevPoint);
      let d1 = Vec2.distance(point, nextPoint);
      const sum = d0 + d1;
      if (sum !== 0) {
        d0 /= sum;
        d1 /= sum;
      }
      Vec2.scale(v1, v, -d0);
      Vec2.scale(v2, v, d1);
      const cp0 = Vec2.add([], point, v1);
      const cp1 = Vec2.add([], point, v2);
      cps.push(cp0);
      cps.push(cp1);
    }
  }

  return cps;
}