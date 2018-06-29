import Inside from './utils/inside';

export default class Line {

  static ATTRS = {
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 10,
    lineWidth: 1
  }

  constructor (cfg) {
    this.attrs = Object.assign({}, Line.ATTRS, cfg);
  }

  includes (x, y) {
    const { x1, y1, x2, y2, lineWidth } = this.attrs;
    return Inside.line(x1, y1, x2, y2, lineWidth, x ,y);
  }
  
  draw (ctx) {
    const { x1, y1, x2, y2 } = this.attrs;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
  }
}