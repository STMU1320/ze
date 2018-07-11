import Shape from '../core/shape';
import Utils from 'utils';
import Inside from './utils/inside';
export default class ZVideo extends Shape {

  static ATTRS = {
    x: 0,
    y: 0,
    w: 10,
    h: 10,
    video: void(0)
  }

  constructor (cfg, container) {
    const defaultCfg = Utils.assign({}, { attrs: ZVideo.ATTRS } ,cfg);
    super('Video', defaultCfg, container);
    if (typeof this.attrs.video === 'string') {
      this.setStatus({ loading: true });
      this._createVideo(this.attrs.video);
    }
  }

  includes (clientX, clientY) {
    const { x, y, w, h } = this.attrs;
    const { computed: { offsetX, offsetY } } = this.container;
    return Inside.rect(x, y, w, h, clientX - offsetX, clientY - offsetY);
  }

  _createVideo (src) {
    const { w, h } = this.attrs;
    const video = document.createElement('video');
    video.setAttribute('width', w);
    video.setAttribute('height', h);
    video.setAttribute('preload', 'metadata');
    video.onplay = () => {
      this.play();
    };
    video.onloadedmetadata = (e) => {
      this.setAttrs({ video });
      this.setStatus({ loading: false });
      this.animate({ attrs: {}, duration: ~~(e.timeStamp * 1000 + 0.5) });
      video.play();
    };
    video.src = src;
  }

  _createPath (ctx) {
    const { x, y, w, h } = this.attrs;
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.closePath();    
  }
  
  _draw (ctx) {
    const { attrs, style } = this;
    const { hasStroke, opacity, video, x, y, w, h } = attrs;
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
    if (video instanceof HTMLVideoElement && !loading) {
      ctx.drawImage(video, x, y, w, h);
    }
    if (opacity !== 1) {
      ctx.globalAlpha = ga;
    }
    ctx.restore();
  }
}