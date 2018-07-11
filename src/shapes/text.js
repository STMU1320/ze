import Shape from '../core/shape';
import Utils from 'utils';
import Inside from './utils/inside';

export default class Text extends Shape {

  static ATTRS = {
    text: '',
    x: 0,
    y: 0
  }

  constructor (cfg, container) {
    const defaultCfg = Utils.assign({}, { attrs: Text.ATTRS, style: Text.STYLE } ,cfg);
    super('Text', defaultCfg, container);
  }

  // _setFontStyle (style) {

  // }

  _getCtxFontSize (font) {
    const size = /(^|\s)(\d{1,})px(\s|$)/ig.exec(font)[2];
    return size ? +size : 0;
  }

  includes (clientX, clientY) {
    let { x, y, text } = this.attrs;
    const { font, textBaseline } = this.style;
    let { w, h } = this.computed;
    if (!w || !h) {
      const ctx = document.createElement('canvas').getContext('2d');
      h = this._getCtxFontSize(font);
      w = ~~(ctx.measureText(text).width + 0.5);
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
    return Inside.rect(x, y, w, h, clientX, clientY);
  }
  
  _draw (ctx) {
    const { attrs, style } = this;
    const { x, y, text, hasFill, hasStroke, opacity } = attrs;
    // const { textBaseline } = style;
    const ga = ctx.globalAlpha;
    if (opacity !==1) {
      ctx.globalAlpha = Utils.clamp(ga * opacity, 0, 1); 
    }
    ctx.save();
    Object.keys(style).forEach(attr => {
      ctx[attr] = style[attr];
    });
    // 这里主要为计算文字的w,h准备
    // if (this._getCtxFontSize(ctx) < 12) {
    //   _font = _font.replace(/(^|\s)(\d{1,}px)(\s|$)/ig, ' 12px ');
    //   ctx.font = _font;
    //   this.style.font = _font;
    // }
    // if (!textBaseline) {
    //   this.style.textBaseline = baseLine;
    // }
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