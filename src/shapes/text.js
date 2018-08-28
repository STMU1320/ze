import Shape from '../core/shape';
import Utils from 'utils';
import Inside from './utils/inside';

export default class Text extends Shape {

  static ATTRS = {
    text: '',
    x: 0,
    y: 0,
    lineHeight: void(0)
  }

  constructor (cfg, container) {
    const defaultCfg = Utils.assign({}, { attrs: Text.ATTRS, style: Text.STYLE } ,cfg);
    super('Text', defaultCfg, container);
    this._updateComputed(defaultCfg.attrs);
  }

  _needUpdateComputedByProps (props) {
    if (!props) {
      return false;
    }
    const { text, lineHeight, font } = props;
    if (text == null && font == null && lineHeight == null) {
      return false;
    }
    return true;
  }

  _getCacheCtx () {
    let ctx = this._cacheCtx;
    if (!ctx) {
      ctx = document.createElement('canvas').getContext('2d');
      this._cacheCtx = ctx;
    }
    return ctx;
  }

  _updateComputed (props) {
    if (!this._needUpdateComputedByProps(props)) {
      return ;
    }
    let text = props.text || this.attrs.text,
        lineHeight = props.lineHeight || this.attrs.lineHeight,
        font = props.font || this.style.font;
    const ctx = this._getCacheCtx();
    const brash = this.getContext();
    ctx.font = font || brash.font;
    const fontSize = this._getFontSize(ctx.font);
    const lh = lineHeight || fontSize * 1.5;
    let h = fontSize;
    let w = 0;
    let multi = false;
    if (Array.isArray(text)) {
      multi = true;
      h = text.length * lh;
      text.forEach(txt => {
        const cw = ~~(ctx.measureText(txt).width + 0.5);
        if (cw > w) {
          w = cw;
        }
      });
    } else {
      w = ~~(ctx.measureText(text).width + 0.5);
    }
    Utils.assign(this.computed, { w, h, multi });
  }

  includes (clientX, clientY) {
    let { x, y } = this.attrs;
    const ctx = this._getCacheCtx();
    const { textBaseline, textAlign } = this.style;
    let { w, h, multi } = this.computed;
    // if (!w || !h) {
      
    //   w = this.computed.w;
    //   h = this.computed.h;
    //   multi = this.computed.multi;
    // }
    const lh = this._getFontSize(ctx.font);
    if (!multi) {
      switch (textBaseline) {
        case 'middle':
          y = y - lh / 2;
          break;
        case 'top':
        case 'hanging':
          y = y + lh / 8;
          break;
      
        default:
          y = y - lh;
          break;
      }
    }

    switch (textAlign) {
      case 'end':
      case 'right':
        x = x - w;
        break;
      case 'center':
        x = x - w / 2;
        break;
    }
    return Inside.rect(x, y, w, h, clientX, clientY);
  }

  _drawSingleText (ctx, text, x, y) {
    const { hasFill, hasStroke } = this.attrs;
    if (hasFill) {
      ctx.fillText(text, x, y);
    }
    if (hasStroke) {
      ctx.strokeText(text, x, y);
    }
  }
  
  _draw (ctx) {
    const { attrs, style, visible } = this;
    const { x, y, text, opacity, lineHeight } = attrs;
    const ga = ctx.globalAlpha;
    if (visible) {
      ctx.save();
      if (opacity !==1) {
        ctx.globalAlpha = Utils.clamp(ga * opacity, 0, 1); 
      }
      Object.keys(style).forEach(attr => {
        ctx[attr] = style[attr];
      });
      if (Array.isArray(text)) {
        const h = lineHeight || this._getFontSize(ctx.font) * 1.5;
        ctx.textBaseline = 'top';
        text.forEach((txt, i) => {
          this._drawSingleText(ctx, txt, x, y + i * h);
        });
      } else {
        this._drawSingleText(ctx, text, x, y);
      }
      ctx.restore();
    }
  }
}