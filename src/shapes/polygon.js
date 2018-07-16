import Shape from '../core/shape';
import Utils from 'utils';
import Inside from './utils/inside';
export default class Polygon extends Shape {

  static ATTRS = {
    x: 0,
    y: 0,
    r: 50,
    angle: 0,
    count: 0,
    regular: false,
    cw: false,
    points: []
  }

  constructor (cfg, container) {
    const defaultCfg = Utils.assign({}, { attrs: Polygon.ATTRS } ,cfg);
    super('Polygon', defaultCfg, container);
    if (this.attrs.regular && this.attrs.count > 2) {
      this._initPathPoints();
    }
  }

  _initPathPoints() {
    // const { r, angle, count, x, y} = this.attrs;
    // const points = [ [x, y - r] ];
    // const vertexAngle = Math.PI * 2/ count;
    // for (let i = 1; i < count; i++) {
    //   const prePoint = points[i - 1];

    // }
  }

  _updateComputed () {
    const { points } = this.attrs;
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
    Utils.assign(this.computed, { minX, minY, maxX, maxY });
  }

  includes (clientX, clientY) {
    let { minX, minY, maxX, maxY } = this.computed;
    if (minX == null || minY == null || maxX == null || maxY == null) {
      this._updateComputed();
      minX = this.computed.minX;
      minY = this.computed.minY;
      maxX = this.computed.maxX;
      maxY = this.computed.maxY;
    }
    return Inside.box(minX, minY, maxX, maxY, clientX, clientY);
  }
  
  _createPath (ctx) {
    const { points, cw } = this.attrs;
    if (points.length) {
      ctx.beginPath();
      ctx.moveTo(points[0][0], points[0][1]);
      if (!cw) {
        for (let i = 1; i < points.length; i++) {
          ctx.lineTo(points[i][0], points[i][1]);
        }
      } else {
        for (let l = points.length; l > 1 ; l--) {
          ctx.lineTo(points[l][0], points[l][1]);
        }
      }
      ctx.closePath();    
    }
  }
}