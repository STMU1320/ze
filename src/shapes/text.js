import Utils from 'utils';
import Inside from './utils/inside';

export default class Text {

  static ATTRS = {
    text: '',
    x: 0,
    y: 0,

  }

  constructor (cfg) {
    this.attrs = Utils.assign({}, Text.ATTRS ,cfg);
    this.computed = {};
  }

  _getCtxFontSize (ctx) {
    const size = /(^|\s)(\d{1,})px(\s|$)/ig.exec(ctx.font)[2];
    return size ? +size : 0;
  }

  includes (clientX, clientY) {
    let { x, y, text, font, textBaseline } = this.attrs;
    let { w, h } = this.computed;
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
    return Inside.rect(x, y, w, h, clientX, clientY);
  }
  
  draw (ctx, drawControl) {
    let _font = ctx.font, baseLine = ctx.textBaseline;
    const { x, y, text, font, textBaseline } = this.attrs;
    const { hasFill, hasStroke } = drawControl;
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
  }
}