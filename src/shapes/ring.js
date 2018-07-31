import Shape from '../core/shape';
import Utils from 'utils';
import Inside from './utils/inside';

export default class Ring extends Shape {

  static ATTRS = {
    x: 0,
    y: 0,
    inner: 10,
    outer: 20,
    start: 0,
    angle: 360
  }

  constructor (cfg, container) {
    const defaultCfg = Utils.assign({}, { attrs: Ring.ATTRS } ,cfg);
    super('Ring', defaultCfg, container);
  }

  includes (clientX, clientY) {
    const { x, y, inner, outer, start, angle } = this.attrs;
    const startAngle = Utils.translateToPi(start);
    let diffAngle = Utils.translateToPi(angle);
    if (Math.abs(angle) >= 360) {
      diffAngle = Math.PI * 2;
    }
    return Inside.ring(x, y, inner, outer, startAngle, diffAngle, clientX, clientY);
  }
  
  _createPath (ctx) {
    const { x, y, inner, outer, start, angle } = this.attrs;
    const startAngle = Utils.translateToPi(start);
    const endAngle = Utils.translateToPi(start + angle);
    if (Math.abs(angle) >= 360) {
      ctx.beginPath();
      ctx.arc(x, y, outer,  0, Math.PI * 2, false);
      ctx.arc(x, y, inner,  0, Math.PI * 2, true);
      ctx.closePath();
    } else {
      const cw = angle > 0;
      const startX = x + Math.cos(startAngle) * outer;
      const startY = y + Math.sin(startAngle) * outer;
      const endX = x + Math.cos(endAngle) * inner;
      const endY = y + Math.sin(endAngle) * inner;
      ctx.beginPath();
      ctx.arc(x, y, outer,  startAngle, endAngle, !cw);
      ctx.lineTo(endX, endY);
      ctx.arc(x, y, inner,  endAngle, startAngle, cw);
      ctx.lineTo(startX, startY);
      ctx.closePath();
    }
  }
}