import Element from './element';
import Utils from '../utils';
import * as Shapes from '../shapes';

export default class Shape extends Element {

  static ATTRS = {
    hasFill: true,
    hasStroke: false,
    opacity: 1
  }

  constructor (type, cfg, container) {
    super(container, 'Shape', cfg.attrs);
    const { attrs, ...drawControl } = cfg;
    this.shape = new Shapes[type](attrs);
    if (type === 'Line') {
      drawControl.hasFill = false;
      drawControl.hasStroke = true;
    }
    this.attrs = Object.assign({}, Shape.ATTRS, drawControl);
    this.type = type;
  }

  includes (x, y) {
    const { computed } = this.container;
    return this.shape.includes(x - computed.offsetX, y - computed.offsetY);
  }

  draw (ctx) {
    const context = ctx || this.getContext();
    const { hasStroke, hasFill, opacity } = this.attrs;
    const ga = context.globalAlpha;
    context.globalAlpha = Utils.clamp(ga * opacity, 0, 1); 
    context.save();
    Object.keys(this.canvasAttrs).forEach(attr => {
      ctx[attr] = this.canvasAttrs[attr];
    });
    this.shape.draw(ctx);
    if (hasStroke) {
      context.stroke();
    }
    if (hasFill) {
      context.fill();
    }
    context.globalAlpha = ga;
    context.restore();
  }
}