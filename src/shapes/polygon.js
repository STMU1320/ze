import Shape from '../core/shape';
import Utils from 'utils';
import Inside from './utils/inside';
import {generatePoints} from './math/polygon';
export default class Polygon extends Shape {
  static ATTRS = {
    x: 0,
    y: 0,
    r: 50,
    angle: 0,
    vertices: 0,
    regular: false,
    cw: false,
    points: [],
  };

  constructor(cfg, container) {
    if (cfg.attrs && cfg.attrs.vertices > 100) {
      console.warn('Polygon vertices for a maximum of 100');
      cfg.attrs.vertices = 100;
    }
    const defaultCfg = Utils.assign({}, {attrs: Polygon.ATTRS}, cfg);
    super('Polygon', defaultCfg, container);
    if (this.attrs.regular && this.attrs.vertices > 2) {
      this._initPathPoints();
    }
  }

  _initPathPoints() {
    const {r, vertices, x, y, angle} = this.attrs;
    const points = generatePoints({r, x, y, vertices, angle});
    this.setAttrs({points});
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

  setAttrs(props) {
    let {r, vertices, x, y, angle, regular} = this.attrs;
    if (regular) {
      if (
        'r' in props ||
        'x' in props ||
        'y' in props ||
        'angle' in props ||
        'vertices' in props) {
          r = Utils.isEmpty(props.r) ? r : props.r;
          vertices = props.vertices != null ? Utils.clamp(Math.round(props.vertices), 3, 100) : vertices;
          x = Utils.isEmpty(props.x) ? x : props.x;
          y = Utils.isEmpty(props.y) ? y : props.y;
          angle = Utils.isEmpty(props.angle) ? angle : props.angle;
          const points = generatePoints({r, x, y, vertices, angle});
          props.points = points;
      }
    }
    super.setAttrs(props);
  }

  includes(clientX, clientY) {
    let {minX, minY, maxX, maxY} = this.computed;
    if (minX == null || minY == null || maxX == null || maxY == null) {
      this._updateComputed();
      minX = this.computed.minX;
      minY = this.computed.minY;
      maxX = this.computed.maxX;
      maxY = this.computed.maxY;
    }
    return Inside.box(minX, minY, maxX, maxY, clientX, clientY);
  }

  _createPath(ctx) {
    const {points, cw} = this.attrs;
    if (points.length) {
      ctx.beginPath();
      ctx.moveTo(points[0][0], points[0][1]);
      if (!cw) {
        for (let i = 1; i < points.length; i++) {
          ctx.lineTo(points[i][0], points[i][1]);
        }
      } else {
        for (let l = points.length; l > 1; l--) {
          ctx.lineTo(points[l][0], points[l][1]);
        }
      }
      ctx.closePath();
    }
  }
}
