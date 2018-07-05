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

  _draw (ctx) {
    const { hasStroke, hasFill, opacity } = this.attrs;
    const ga = ctx.globalAlpha;
    ctx.globalAlpha = Utils.clamp(ga * opacity, 0, 1); 
    ctx.save();
    Object.keys(this.drawStyle).forEach(attr => {
      ctx[attr] = this.drawStyle[attr];
    });
    this.shape.draw(ctx, { hasStroke, hasFill });
    // text 的描边和填充直接在draw方法完成
    if (this.type !== 'Text') {
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

  getShapeAttrs () {
    return this.shape.attrs;
  }

  setShapeAttrs (attrs) {
    Object.assign(this.shape.attrs, attrs);
    super.setShapeAttrs();
  }

  includes (x, y) {
    const { computed } = this.container;
    return this.shape.includes(x - computed.offsetX, y - computed.offsetY);
  }

}