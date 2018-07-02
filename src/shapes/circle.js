import Inside from './utils/inside';
export default class Circle {

  static ATTRS = {
    x: 0,
    y: 0,
    r: 10,
    cw: false
  }

  constructor (cfg) {
    this.attrs = Object.assign({}, Circle.ATTRS ,cfg);
  }

  includes (clientX, clientY) {
    const { x, y, r } = this.attrs;
    return Inside.circle(x, y, r, clientX, clientY);
  }
  
  draw (ctx) {
    const { x, y, r, cw } = this.attrs;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2*Math.PI, cw);
    ctx.closePath();
  }
}