import Shape from '../core/shape';
import Utils from 'utils';
import Inside from './utils/inside';
export default class Rect extends Shape {

  static ATTRS = {
    x: 0,
    y: 0,
    w: 10,
    h: 10,
    cw: false
  }

  constructor (cfg, container) {
    const defaultCfg = Utils.assign({}, { attrs: Rect.ATTRS } ,cfg);
    super('Rect', defaultCfg, container);
  }

  includes (clientX, clientY) {
    const { x, y, w, h } = this.attrs;
    const { computed: { offsetX, offsetY } } = this.container;
    return Inside.rect(x, y, w, h, clientX - offsetX, clientY - offsetY);
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