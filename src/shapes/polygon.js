import Shape from '../core/shape';
import Utils from 'utils';
import Inside from './utils/inside';
export default class Polygon extends Shape {

  static ATTRS = {
    x: 0,
    y: 0,
    r: 50,
    angle: 0,
    regular: false,
    cw: false,
    points: []
  }

  constructor (cfg, container) {
    const defaultCfg = Utils.assign({}, { attrs: Polygon.ATTRS } ,cfg);
    super('Polygon', defaultCfg, container);
  }

  includes (clientX, clientY) {
    const { x, y, w, h } = this.attrs;
    return Inside.box(x, y, w, h, clientX, clientY);
  }
  
  _createPath (ctx) {
    const { x, y, w, h, cw } = this.attrs;
    ctx.beginPath();
    if (!cw) {
      ctx.rect(x, y, w, h);
    } else {
      ctx.moveTo(x, y);
      ctx.lineTo(x, y + h);
      ctx.lineTo(x + w, y + h);
      ctx.lineTo(x + w, y);
    }
    ctx.closePath();    
  }
}