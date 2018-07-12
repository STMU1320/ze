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

  _updateComputed () {
    let ctx = this._cacheCtx;
    if (!ctx) {
      ctx = document.createElement('canvas').getContext('2d');
      this._cacheCtx = ctx;
    }
    let { text } = this.attrs;
    const { font } = this.style;
    ctx.font = font;
    const h = this._getFontSize(font);
    const w = ~~(ctx.measureText(text).width + 0.5);
    Utils.assign(this.computed, { w, h });
  }

  includes (clientX, clientY) {
    let { x, y } = this.attrs;
    const { textBaseline } = this.style;
    let { w, h } = this.computed;
    if (!w || !h) {
      this._updateComputed();
      w = this.computed.w;
      h = this.computed.h;
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
    ctx.save();
    if (opacity !==1) {
      ctx.globalAlpha = Utils.clamp(ga * opacity, 0, 1); 
    }
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
    ctx.restore();
  }
}