export default class Line {
  constructor (cfg) {
    this.attrs = Object.assign({}, cfg);
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