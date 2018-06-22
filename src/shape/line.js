export default class Line {
  constructor (cfg, container) {
    this.attrs = Object.assign({}, cfg.attrs);
    this.container = container;
  }
  
  draw (ctx) {
    const context = ctx || this.getContext();
    const { x1, y1, x2, y2, lineWidth } = this.attrs;
    context.save();
    context.lineWidth = lineWidth;
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.stroke();
    context.restore();
  }

  getContext () {
    return this.container.getContext();
  }
}