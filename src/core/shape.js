import Element from './element';
import Utils from '../utils';
import * as Shapes from '../shapes';

export default class Shape extends Element {

  static ATTRS = {
    hasFill: true,
    hasStroke: false,
    opacity: 1
  }

  constructor (type, cfg = {}, container) {
    super(container, 'Shape', cfg);
    const { attrs, ...drawControl } = cfg;
    if (!Shapes[type]) {
      throw `目前还不支持${type}类型的图形`;
    }
    this.shape = new Shapes[type](attrs, this);
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
    Object.keys(this.drawAttrs).forEach(attr => {
      ctx[attr] = this.drawAttrs[attr];
    });
    this.shape.draw(ctx, { hasStroke, hasFill });
    // text 的描边和填充直接在draw方法完成
    if (this.type !== 'Text') {
      if (hasStroke) {
        context.stroke();
      }
      if (hasFill) {
        context.fill();
      }
    }
    context.globalAlpha = ga;
    context.restore();
  }
}