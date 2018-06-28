import Inside from './utils/inside';
export default class Line {
  constructor (cfg) {
    this.attrs = Object.assign({}, cfg);
  }

  includes (x, y) {
    const { x1, y1, x2, y2, lineWidth } = this.attrs;
    return Inside.line(x1, y1, x2, y2, lineWidth, x ,y);
  }
  
  draw (ctx) {
    const { x1, y1, x2, y2, ...canvasAttrs } = this.attrs;
    Object.keys(canvasAttrs).forEach(attr => {
      ctx[attr] = canvasAttrs[attr];
    });
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.closePath();    
  }
}