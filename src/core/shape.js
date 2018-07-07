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
    const defaultCfg = Utils.assign({},  { attrs: Shape.ATTRS }, cfg);
    if (type === 'Line') {
      defaultCfg.attrs.hasFill = false;
      defaultCfg.attrs.hasStroke = true;
    }
    super(container, 'Shape', defaultCfg);
    if (!Shapes[type]) {
      throw `目前还不支持${type}类型的图形`;
    }
    this.shape = new Shapes[type](defaultCfg.attrs);
    this.attrs = this.shape.attrs;
    this.type = type;
  }

  _draw (ctx) {
    const { attrs, style, shape, type } = this;
    const { hasStroke, hasFill, opacity } = attrs;
    const ga = ctx.globalAlpha;
    ctx.globalAlpha = Utils.clamp(ga * opacity, 0, 1); 
    ctx.save();
    Object.keys(style).forEach(attr => {
      ctx[attr] = style[attr];
    });
    shape.draw(ctx, { hasStroke, hasFill });
    // text 的描边和填充直接在draw方法完成
    if (type !== 'Text') {
      if (hasStroke) {
        ctx.stroke();
      }
      if (hasFill) {
        ctx.fill();
      }
    }
    ctx.globalAlpha = ga;
    ctx.restore();
  }

  includes (x, y) {
    const { computed } = this.container;
    return this.shape.includes(x - computed.offsetX, y - computed.offsetY);
  }

}