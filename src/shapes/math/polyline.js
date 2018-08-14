import Utils from 'utils';
import * as Cubic from './cubic';
import * as Vec2 from 'gl-matrix/src/gl-matrix/vec2';

export function smooth (points, smooth) {
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

export function distances (points, cps, smooth) {
  let sum = 0;
  const len = points.length;
  if (len < 1) {
    return sum;
  }

  if (!Utils.isEmpty(cps) && smooth ) {
    for (let i = 0; i < len - 1; i++) {
      const current = points[i];
      const next = points[i + 1];
      const cp1 = cps[i * 2];
      const cp2 = cps[i * 2 + 1];
      const dis = Cubic.len(current[0], current[1], cp1[0], cp1[1], cp2[0], cp2[1], next[0], next[1]);
      sum += dis;
      next[2] = sum;
    }
  } else {
    for (let i = 1; i < len; i++) {
      const prevPoint = points[i - 1];
      const current = points[i];
      const dis = Vec2.distance(prevPoint, current);
      sum += dis;
      current[2] = sum;
    }
    // 暂时不考虑闭合的情况， 后续和平滑的闭合一起处理
    // if (close) {
    //   sum += Vec2.distance(points[0], points[len - 1]);
    // }
  }
  points[0][2] = 0;
  return sum;
}