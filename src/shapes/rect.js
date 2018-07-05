import Inside from './utils/inside';
export default class Rect {

  static ATTRS = {
    x: 0,
    y: 0,
    w: 10,
    h: 10,
    cw: false
  }

  constructor (cfg) {
    this.attrs = Object.assign({}, Rect.ATTRS ,cfg);
  }

  includes (clientX, clientY) {
    const { x, y, w, h } = this.attrs;
    return Inside.rect(x, y, w, h, clientX, clientY);
  }
  
  draw (ctx) {
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