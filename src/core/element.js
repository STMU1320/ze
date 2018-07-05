// 暂时把所有图形的事件都挂在canvas实列下，注册事件的图形过多后可能会对性能有影响.
// import EventBus from './eventBus';
import animate from './animate';

const DRAW_STYLE_KEYS = [
  'fillStyle',
  'font',
  'globalAlpha',
  'lineCap',
  'lineWidth',
  'lineJoin',
  'miterLimit',
  'shadowBlur',
  'shadowColor',
  'shadowOffsetX',
  'shadowOffsetY',
  'strokeStyle',
  'textAlign',
  'textBaseline',
  'lineDash',
  'lineDashOffset'
];

export default class Element {

  static DRAW_STYLE_KEYS = DRAW_STYLE_KEYS;

  static DEFAULT_ANIMATE_CFG = {
    to: null,
    from: null,
    cb: null,
    diff: null,
    startTime: null,
    delay: 0,
    duration: 0,
    status: 'stop',
    effect: 'linear'
  }

  constructor (container, type, cfg) {
    this.container = container;
    this.type = type;
    this.computed = {};
    this.canvas = null;
    const drawStyle = {};
    const shapeAttrs = {};
    if (cfg.attrs) {
      Object.keys(cfg.attrs).forEach((key) => {
        if (DRAW_STYLE_KEYS.includes(key)) {
          drawStyle[key] = cfg.attrs[key];
        } else {
          shapeAttrs[key] = cfg.attrs[key];
        }
      });
    }
    this.drawStyle = Object.assign({}, drawStyle);
    this.animateCfg = Object.assign({},  Element.DEFAULT_ANIMATE_CFG, cfg.animate);
    this.timer = null;
    this.shapeAttrs = shapeAttrs;
    this.zIndex = cfg.zIndex || 0;
    this._status = { drawn: false, dirty: false };
  }

  // set (key, value) {
  //   this[key] = value;
  // }

  _setComputed (data) {
    Object.assign(this.computed, data);
  }

  _getCanvasInstance () {
    if (!this.canvas) {
      this.canvas = this.container._getCanvasInstance();
    }
    return this.canvas;
  }

  _stopAnimation = (cb) => {
    if (this.timer) {
      cancelAnimationFrame(this.timer);
      this.timer = null;
    }
    cb && cb(this);
  }

  
  _playAnimation = () => {
    let { startTime, duration, to, diff, from, effect, cb  } = this.animateCfg;
    const now = Date.now();
    const passTime = now - startTime;
    if (passTime > 0) {
      if (passTime < duration) {
        const baseRatio = passTime / duration;
        const ratio = animate[effect](baseRatio);
        const nextAttrs = {};
        Object.keys(from).forEach(key => {
          nextAttrs[key] = ~~(from[key] + diff[key] * ratio + 0.5);
        });
        this.setShapeAttrs(nextAttrs);
        Object.assign(this.animateCfg, { status: 'playing' });
        this.timer = requestAnimationFrame(this._playAnimation);
      } else {
        this.setShapeAttrs(to);
        Object.assign(this.animateCfg, { status: 'stop' });
        this._stopAnimation(cb);
      }
      this.update();
    }
  }

  _noticeParent (status) {
    const parent = this.container;
    if (parent.type === 'Layer') {
      parent.setStatus(status);
    }
  }

  getStatus () {
    return { ...this._status };
  }

  setStatus (status) {
    Object.assign(this._status, status);
    if (status.dirty) {
      this._noticeParent({dirty: true});
    }
  }

  getShapeAttrs () {
    return this.attrs;
  }

  setShapeAttrs () {
    this.setStatus({dirty: true});
  }

  getContext () {
    return this.container.getContext();
  }

  getCanvas () {
    return this.container.getCanvas();
  }

  animate (attrs, duration, effect, cb, delay = 0, autoPlay = true) {
    if ( typeof effect === 'function' ) {
      delay = cb;
      cb = effect;
      effect = 'linear';
    } else if (typeof effect === 'number') {
      delay = effect;
      cb = null;
      effect = 'linear';
    }
    if (typeof cb === 'number') {
      delay = cb;
      cb = null;
    }
    if (!animate[effect]) {
      effect = 'linear';
    }
    const currentCfg = this.animateCfg;
    if (currentCfg.status === 'playing') {
      this._stopAnimation(currentCfg.cb);
    }
    const initAttrs = this.getShapeAttrs();
    const from = {};
    const diff = {};
    Object.keys(attrs).forEach(key => {
      const temp = attrs[key] - initAttrs[key];
      from[key] = initAttrs[key];
      diff[key] = temp;
    });
    Object.assign(this.animateCfg, { duration, effect, status: 'ready', to: attrs, from, diff, cb, delay });
    if (autoPlay) {
      this.play();
    }
  }

  play = () => {
    const { status, delay } = this.animateCfg;
    const canvas = this._getCanvasInstance();
    const canvasStatus = canvas.getStatus();
    if (canvasStatus.drawn){
      if (status === 'ready') {
        Object.assign(this.animateCfg, { startTime: Date.now() + delay });
        this.timer = requestAnimationFrame(this._playAnimation);
      }
    } else {
      canvas.once('@@play', this.play);
    }
  }

  stop () {
    this._stopAnimation(this.animateCfg.cb);
  }

  includes () {
    return true;
  }

  update () {
    const canvas = this._getCanvasInstance();
    canvas.emit('@@update');
  }

  on (event, fun) {
    const canvasInstance = this._getCanvasInstance();
    canvasInstance.on(event, fun, this);
  }

}