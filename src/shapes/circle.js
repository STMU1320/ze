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
    const { x, y, r } = this.attrs;
    const { computed: { offsetX, offsetY } } = this.container;
    return Inside.circle(x, y, r, clientX - offsetX, clientY - offsetY);
  }
  
  _createPath (ctx) {
    const { x, y, r, cw } = this.attrs;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2*Math.PI, cw);
    ctx.closePath();
  }
}