import Shape from '../core/shape';
import Utils from 'utils';
import Inside from './utils/inside';
export default class Rect extends Shape {

  static ATTRS = {
    x: 0,
    y: 0,
    w: 10,
    h: 10,
    round: 0,
    cw: false
  }

  constructor (cfg, container) {
    const defaultCfg = Utils.assign({}, { attrs: Rect.ATTRS } ,cfg);
    super('Rect', defaultCfg, container);
  }

  includes (clientX, clientY) {
    const { x, y, w, h } = this.attrs;
    return Inside.rect(x, y, w, h, clientX, clientY);
  }
  
  _createPath (ctx) {
    const { x, y, w, h, cw, round } = this.attrs;
    const r = round;
    const pi = Math.PI;
    ctx.beginPath();
    if (r <= 0) {
      if (!cw) {
        ctx.rect(x, y, w, h);
      } else {
        ctx.moveTo(x, y);
        ctx.lineTo(x, y + h);
        ctx.lineTo(x + w, y + h);
        ctx.lineTo(x + w, y);
      }
    } else {
      if (!cw) {
        ctx.moveTo(x, y + r);
        ctx.arc(x+r, y+r, r, pi, pi * 1.5);
        ctx.lineTo(x + w - r, y);
        ctx.arc(x+w-r, y+r, r, pi * 1.5, pi * 2);
        ctx.lineTo(x + w, y + h -r);
        ctx.arc(x+w-r, y+h-r, r, 0, pi / 2);
        ctx.lineTo(x + r, y+h);
        ctx.arc(x+r, y+h-r, r, pi / 2, pi);
        ctx.lineTo(x, y+r);
      } else {
        ctx.moveTo(x, y + r);
        ctx.lineTo(x, y+ h - r);
        ctx.arc(x+r, y+h-r, r, pi, pi / 2, true);
        ctx.lineTo(x + w - r, y + h);
        ctx.arc(x+w-r, y+ h - r, r, pi / 2, 0, true);
        ctx.lineTo(x + w, y + r);
        ctx.arc(x + w - r, y + r, r, 0, pi * 1.5, true);
        ctx.lineTo(x + r, y);
        ctx.arc(x+r, y+r, r, pi * 1.5, pi, true);
      }
    }
    ctx.closePath();    
  }
}