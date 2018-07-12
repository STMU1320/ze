import Element from './element';
import Utils from '../utils';

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
    super(container, type, defaultCfg);
  }

  _createPath () {
  }

  _draw (ctx) {
    const { attrs, style } = this;
    const { hasStroke, hasFill, opacity } = attrs;
    const ga = ctx.globalAlpha;
    ctx.save();
    if (opacity !== 1) {
      ctx.globalAlpha = Utils.clamp(ga * opacity, 0, 1); 
    }
    Object.keys(style).forEach(attr => {
      ctx[attr] = style[attr];
    });
    this._createPath(ctx);
    if (hasStroke && ctx.lineWidth > 0) {
      ctx.stroke();
    }
    if (hasFill) {
      ctx.fill();
    }
    ctx.restore();
  }

}