import Element from './element';
import * as Shapes from '../shapes';

export default class Shape extends Element {
  constructor (type, options, container) {
    super(container, 'shape');
    const { attrs, ...drawControl  } = options;
    this.shape = new Shapes[type](attrs);
    let defaultCtrl = { hasFill: true, hasStroke: false };
    if (type === 'Line') {
      defaultCtrl = { hasFill: false, hasStroke: true };
    }
    this.attrs = Object.assign(defaultCtrl, drawControl);
    this.type = type;
  }

  includes (x, y) {
    return this.shape.includes(x, y);
  }

  draw (ctx) {
    const context = ctx || this.getContext();
    const { hasStroke, hasFill } = this.attrs;
    context.save();
    this.shape.draw(ctx);
    if (hasStroke) {
      context.stroke();
    }
    if (hasFill) {
      context.fill();
    }
    context.restore();
  }
}