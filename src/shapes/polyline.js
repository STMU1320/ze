import Shape from '../core/shape';
import Utils from 'utils';
import Inside from './utils/inside';
import * as Cubic from './math/cubic';
import * as Vec2 from 'gl-matrix/src/gl-matrix/vec2';
import * as Helper from './math/polyline';
export default class Polyline extends Shape {
  static ATTRS = {
    close: false,
    points: [],
    smooth: 0,
    t: 1,
    position: false,
    hasFill: false,
    hasStroke: true,
  };

  constructor(cfg, container) {
    const defaultCfg = Utils.assign({}, {attrs: Polyline.ATTRS}, cfg);
    super('Polyline', defaultCfg, container);
    const { smooth, points, t, position } = this.attrs;
    if (smooth) {
      this._cps = Helper.smooth(points, smooth);
    }
    // 这个方法不仅计算折线的总长度，还会将每个节点的长度存放到每个节点的索引2上(point[2])
    const distances = Helper.distances(points, this._cps, smooth);
    const computed = { distances };
    if (t !== 1 && position) {
      computed.position = this._getCurrentPosition(t, distances);
    }
    Utils.assign(this.computed, computed);
  }

  _getCurrentPosition (t, distances) {
    const { points, smooth } = this.attrs;
    const cps = this._cps;
    const currentDis = distances * t;
    const index = points.findIndex((item) => item[2] >= currentDis);
    const prevIndex = index - 1;
    let position = [0, 0];
    if (prevIndex > -1) {
      const prevPoint = points[prevIndex];
      const currentPoint = points[index];
      const diffDis = prevPoint[2] ? (currentDis - prevPoint[2]) : currentDis;
      const betweenDis = currentPoint[2] - prevPoint[2];
      let _t = Utils.clamp(diffDis / betweenDis, 0, 1);
      if (smooth && !Utils.isEmpty(cps)) {
        const cp1 = cps[prevIndex * 2];
        const cp2 = cps[prevIndex * 2 + 1];
        // 速度平滑匀速处理
        _t = Cubic.evenSpeed(prevPoint[0], prevPoint[1], cp1[0], cp1[1], cp2[0], cp2[1], currentPoint[0], currentPoint[1], _t, betweenDis);
        position = [
          Cubic.at(prevPoint[0], cp1[0], cp2[0], currentPoint[0], _t),
          Cubic.at(prevPoint[1], cp1[1], cp2[1], currentPoint[1], _t)
        ];
      } else {
        Vec2.lerp(position, prevPoint, currentPoint, _t);
      }
    } else {
      position = [points[0][0], points[0][1]];
    }

    return position;
  }

  _updateComputed(props) {
    if (props && props.points) {
      const {points} = props;
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      points.forEach(point => {
        if (point[0] < minX) {
          minX = point[0];
        }
        if (point[1] < minY) {
          minY = point[1];
        }
        if (point[0] > maxX) {
          maxX = point[0];
        }
        if (point[1] > maxY) {
          maxY = point[1];
        }
      });
      Utils.assign(this.computed, {minX, minY, maxX, maxY});
    }
  }

  setAttrs(props) {
    const { t, position } = this.attrs;
    if (position && 't' in props) {
      const _t = props.t;
      const { distances } = this.computed;
      if (_t !== t) {
        const positionData = this._getCurrentPosition(_t, distances);
        Utils.assign(this.computed, { position: positionData });
      }
    }
    super.setAttrs(props);
  }

  includes(clientX, clientY) {
    const { close, points, smooth } = this.attrs;
    const lineWidth = this._getLineWidth();
    if (smooth && !Utils.isEmpty(this._cps)) {
      const cps = this._cps;
      return Inside.polyBezier(points, cps, lineWidth, close, clientX, clientY);
    }
    return Inside.polyline(points, lineWidth, close, clientX, clientY);
  }

  _createPath(ctx) {
    const {points, close, smooth, t } = this.attrs;
    const { distances } = this.computed;
    const cps = this._cps;
    if (t !== 1 && ctx.setLineDash) {
      ctx.setLineDash([ distances * t, distances]);
    }
    if (points.length) {
      ctx.beginPath();
      ctx.moveTo(points[0][0], points[0][1]);
      if (smooth && !Utils.isEmpty(cps)) {
        for (let i = 0, len = points.length; i < len - 1; i++) {
          const cp1 = cps[i * 2];
          const cp2 = cps[i * 2 + 1];
          const p = points[i + 1];
          ctx.bezierCurveTo(
              cp1[0], cp1[1], cp2[0], cp2[1], p[0], p[1]
          );
        }
      } else {
        for (let i = 1; i < points.length; i++) {
          ctx.lineTo(points[i][0], points[i][1]);
        }
      }
      if (close) {
        ctx.closePath();
      }
    }
  }
}
