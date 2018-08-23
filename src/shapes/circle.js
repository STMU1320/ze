import Shape from '../core/shape';
import Utils from 'utils';
import Inside from './utils/inside';
export default class Circle extends Shape {

  static ATTRS = {
    x: 0,
    y: 0,
    r: 10,
    cw: false
  }

  constructor (cfg, container) {
    const defaultCfg = Utils.assign({}, { attrs: Circle.ATTRS } ,cfg);
    super('Circle', defaultCfg, container);
  }

  includes (clientX, clientY) {
    let { x, y, r, hasStroke } = this.attrs;
    if (hasStroke) {
      const lineWidth = this._getLineWidth();
      r += (lineWidth / 2);
    }
    return Inside.circle(x, y, r, clientX, clientY);
  }
  
  _createPath (ctx) {
    const { x, y, r, cw } = this.attrs;
    if (r <= 0) {
      throw 'r must be greater than 0';
    }
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2*Math.PI, cw);
    ctx.closePath();
  }
}