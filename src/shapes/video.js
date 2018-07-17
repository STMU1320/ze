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
    const { video } = this.attrs;
    if (typeof video === 'string') {
      this.setStatus({ loading: true });
      this._createVideo(video);
      if (/\.m3u8$/ig.test(video)) {
        this._loadHlsLib();
      }
    }
  }

  includes (clientX, clientY) {
    const { x, y, w, h } = this.attrs;
    return Inside.rect(x, y, w, h, clientX, clientY);
  }
  _videoPlay () {
    const { video } = this.attrs;
    try {
      video.play();
    } catch (error) {
    }

  }

  _loadHlsLib () {
    const { video } = this.attrs;
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src='https://cdn.jsdelivr.net/npm/hls.js@latest';
    document.body.appendChild(script);
    script.onload = () => {
      const hls = new Hls();
      hls.loadSource(video.getAttribute('src'));
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED,() => {
        this._videoPlay();
    });
    };
  }

  _createVideo (src) {
    const { w, h } = this.attrs;
    const video = document.createElement('video');
    video.setAttribute('width', w);
    video.setAttribute('height', h);
    video.setAttribute('preload', 'metadata');
    this.setAttrs({ video });
    video.onplay = () => {
      this.play();
    };
    video.onloadedmetadata = (e) => {
      this.setStatus({ loading: false });
      this.animate({ props: {}, duration: ~~(e.timeStamp * 1000 + 0.5) });
      this._videoPlay();
    };
    video.onended = () => {
      this._stopAnimation();
    };
    video.muted = true;
    video.src = src;
    document.addEventListener('click', () => { video.muted = false; });
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
    if (video instanceof HTMLVideoElement && !loading) {
      ctx.drawImage(video, x, y, w, h);
    }
    ctx.restore();
  }
}