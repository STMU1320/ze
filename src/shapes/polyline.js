import Shape from '../core/shape';
import Utils from 'utils';
import Inside from './utils/inside';
import Smooth from './math/smooth';
export default class Polyline extends Shape {
  static ATTRS = {
    close: false,
    points: [],
    smooth: 0,
    hasFill: false,
    hasStroke: true,
  };

  constructor(cfg, container) {
    const defaultCfg = Utils.assign({}, {attrs: Polyline.ATTRS}, cfg);
    super('Polyline', defaultCfg, container);
    const { smooth, points } = this.attrs;
    if (smooth) {
      this._cps = Smooth(points, smooth);
    }
  }

  _updateComputed() {
    const {points} = this.attrs;
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

  // setAttrs(props) {
  //   let {r, vertices, x, y, angle, regular} = this.attrs;
  //   if (regular) {
  //     if (
  //       'r' in props ||
  //       'x' in props ||
  //       'y' in props ||
  //       'angle' in props ||
  //       'vertices' in props) {
  //         r = Utils.isEmpty(props.r) ? r : props.r;
  //         vertices = props.vertices != null ? Utils.clamp(Math.round(props.vertices), 3, 100) : vertices;
  //         x = Utils.isEmpty(props.x) ? x : props.x;
  //         y = Utils.isEmpty(props.y) ? y : props.y;
  //         angle = Utils.isEmpty(props.angle) ? angle : props.angle;
  //         const points = generatePoints({r, x, y, vertices, angle});
  //         props.points = points;
  //     }
  //   }
  //   super.setAttrs(props);
  // }

  includes(clientX, clientY) {
    const { close, points } = this.attrs;
    const lineWidth = this._getLineWidth();
    return Inside.polyline(points, lineWidth, close, clientX, clientY);
  }

  _createPath(ctx) {
    const {points, close, smooth} = this.attrs;
    const cps = this._cps;
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
