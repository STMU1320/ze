import Shape from '../core/shape';
import Utils from 'utils';
import Inside from './utils/inside';
export default class ZImage extends Shape {

  static ATTRS = {
    x: 0,
    y: 0,
    w: 10,
    h: 10,
    img: void(0)
  }

  constructor (cfg, container) {
    const defaultCfg = Utils.assign({}, { attrs: ZImage.ATTRS } ,cfg);
    super('Image', defaultCfg, container);
    if (typeof this.attrs.img === 'string') {
      this.setStatus({ loading: true });
      this._createImage(this.attrs.img);
    }
  }

  includes (clientX, clientY) {
    const { x, y, w, h } = this.attrs;
    const { computed: { offsetX, offsetY } } = this.container;
    return Inside.rect(x, y, w, h, clientX - offsetX, clientY - offsetY);
  }

  _createImage (src) {
    const img = new Image();
    img.onload = () => {
      this.setAttrs({ img });
      this.setStatus({ loading: false });
      this.update();
    };
    img.src = src;
  }

  _createPath (ctx) {
    const { x, y, w, h } = this.attrs;
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.closePath();    
  }
  
  _draw (ctx) {
    const { attrs, style } = this;
    const { hasStroke, opacity, img, x, y, w, h } = attrs;
    const { loading } = this.getStatus();
    const ga = ctx.globalAlpha;
    if (opacity !== 1) {
      ctx.globalAlpha = Utils.clamp(ga * opacity, 0, 1); 
    }
    ctx.save();
    Object.keys(style).forEach(attr => {
      ctx[attr] = style[attr];
    });
    this._createPath(ctx);
    if (hasStroke && ctx.lineWidth > 0) {
      ctx.stroke();
    }
    if (img && !loading) {
      ctx.drawImage(img, x, y, w, h);
    }
    if (opacity !== 1) {
      ctx.globalAlpha = ga;
    }
    ctx.restore();
  }
}