import Shape from '../core/shape';
import Utils from 'utils';
import Inside from './utils/inside';

export default class Text extends Shape {

  static ATTRS = {
    text: '',
    x: 0,
    y: 0,

  }

  constructor (cfg, container) {
    const defaultCfg = Utils.assign({}, { attrs: Text.ATTRS } ,cfg);
    super('Text', defaultCfg, container);
  }

  _getCtxFontSize (ctx) {
    const size = /(^|\s)(\d{1,})px(\s|$)/ig.exec(ctx.font)[2];
    return size ? +size : 0;
  }

  includes (clientX, clientY) {
    let { x, y, text, font, textBaseline } = this.attrs;
    let { w, h } = this.computed;
    const { computed: { offsetX, offsetY } } = this.container;
    if (!w || !h) {
      const ctx = document.createElement('canvas').getContext('2d');
      ctx.font = font;
      h = this._getCtxFontSize(ctx);
      w = ctx.measureText(text).width;
      this.computed.w = w;
      this.computed.h = h;
    }
    switch (textBaseline) {
      case 'bottom':
        y = y - h * 1.5;
        break;
      case 'top':
        y = y + h / 4;
        break;
    
      default:
        y = y -  h;
        break;
    }
    return Inside.rect(x, y, w, h, clientX - offsetX, clientY - offsetY);
  }
  
  _draw (ctx) {
    let _font = ctx.font, baseLine = ctx.textBaseline;
    const { attrs, style } = this;
    const { x, y, text, font, textBaseline, hasFill, hasStroke, opacity } = attrs;
    const ga = ctx.globalAlpha;
    ctx.globalAlpha = Utils.clamp(ga * opacity, 0, 1); 
    ctx.save();
    Object.keys(style).forEach(attr => {
      ctx[attr] = style[attr];
    });
    // 这里主要为计算文字的w,h准备
    if (this._getCtxFontSize(ctx) < 12) {
      _font = _font.replace(/(^|\s)(\d{1,}px)(\s|$)/ig, ' 12px ');
      ctx.font = _font;
    }
    if (_font !== font) {
      this.attrs.font = _font;
    }
    if (baseLine !== textBaseline) {
      this.attrs.textBaseline = baseLine;
    }
    if (hasFill) {
      ctx.fillText(text, x, y);
    }
    if (hasStroke) {
      ctx.strokeText(text, x, y);
    }
    ctx.globalAlpha = ga;
    ctx.restore();
  }
}