// 暂时把所有图形的事件都挂在canvas实列下，注册事件的图形过多后可能会对性能有影响.
// import EventBus from './eventBus';
import Utils from 'utils';
import animate from './animate';

const STYLE_KEYS = [
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
  'lineDashOffset',
];

export default class Element {
  static STYLE_KEYS = STYLE_KEYS;

  static DEFAULT_ANIMATE_CFG = {
    to: null,
    from: null,
    cb: null,
    diff: null,
    startTime: null,
    delay: 0,
    duration: 0,
    status: 'stop',
    effect: 'linear',
  };

  constructor(container, type, cfg) {
    const { attrs, style, animate, zIndex, event } = cfg;
    this.container = container;
    this.type = type;
    this.attrs = attrs;
    this.canvas = null;
    this.timer = null;
    this.zIndex = zIndex || 0;
    this._status = {drawn: false, dirty: false};
    this._initStyle(style);
    this._initEvent(event);
    this._initComputed();
    this._initAnimate(animate);
  }
 
  _initStyle (style = {}) {
    const parentStyle = this.container.style;
    const _style = {};
    Object.keys(style).forEach(key => {
      if (STYLE_KEYS.includes(key)) {
        _style[key] = style[key];
      }
    });
    this.style = Utils.assign({}, parentStyle, _style);
  }

  _initEvent (event) {
    if (event && typeof event === 'object') {
      for (let key in event) {
        this.on(key, event[key]);
      }
    }
  }

  _initAnimate (animate) {
    this.animateCfg = Utils.assign({}, Element.DEFAULT_ANIMATE_CFG);
    console.log(animate);
    if (animate) {
      this.animate(animate);
    }
  }

  _initComputed() {
    this.computed = {};
  }

  _stopAnimation = cb => {
    const canvas = this.getCanvas();
    if (this.timer) {
      cancelAnimationFrame(this.timer);
      this.timer = null;
    }
    const animateCount = canvas.computed.animate;
    canvas._setComputed({ animate: animateCount - 1 });
    canvas.draw();
    cb && cb(this);
  };

  _playAnimation = () => {
    let {startTime, duration, to, diff, from, effect, callback, loop} = this.animateCfg;
    const now = Date.now();
    const passTime = now - startTime;
    if (passTime < 0) {
      return setTimeout(this._playAnimation, -passTime);
    } else if (passTime < duration) {
      const baseRatio = passTime / duration;
      const ratio = animate[effect](baseRatio);
      const nextAttrs = {};
      Object.keys(from).forEach(key => {
        nextAttrs[key] = ~~(from[key] + diff[key] * ratio + 0.5);
      });
      this.setAttrs(nextAttrs);
      Utils.assign(this.animateCfg, { status: 'playing', lastTime: now });
      this.timer = requestAnimationFrame(this._playAnimation);
    } else if (loop){
      this.setAttrs(from);
      Utils.assign(this.animateCfg, { status: 'playing', lastTime: now, startTime: now });
      this.timer = requestAnimationFrame(this._playAnimation);
    } else {
      this.setAttrs(to);
      this.animateCfg.status = 'stop';
      this._stopAnimation(callback);
    }
  };

  _noticeParentStatus(status) {
    const parent = this.container;
    parent._set('_status',status);
  }
  _set (key, value) {
    if (!this[key]) {
      this[key] = value;
    } else {
      Utils.assign(this[key], value);
    }
  }

  setAttrs(attrs) {
    this._set('attrs', attrs);
    this.setStatus({dirty: true});
  }

  setStatus (status) {
    this._set('_status', status);
    if (status.dirty) {
      this._noticeParentStatus({ dirty: true });
    }
  }

  getStatus () {
    return this._status;
  }

 
  getContext() {
    return this.container.getContext();
  }

  getCanvas() {
    if (!this.canvas) {
      this.canvas = this.container.getCanvas();
    }
    return this.canvas;
  }

  animate(cfg = {}) {
    const {attrs, duration, effect = 'linear', callback, delay = 0, loop, autoPlay = true} = cfg;
    if (!attrs || !duration) {
      return ;
    }
    const currentCfg = this.animateCfg;
    if (currentCfg.status === 'playing') {
      this._stopAnimation(currentCfg.callback);
    }
    const initAttrs = this.attrs;
    const from = {};
    const diff = {};
    Object.keys(attrs).forEach(key => {
      const temp = attrs[key] - initAttrs[key];
      from[key] = initAttrs[key];
      diff[key] = temp;
    });
    Utils.assign(this.animateCfg, {
      duration,
      effect,
      status: 'ready',
      to: attrs,
      from,
      diff,
      callback,
      delay,
      loop
    });
    if (autoPlay) {
      this.play();
    }
  }

  play = () => {
    const {status, delay} = this.animateCfg;
    const canvas = this.getCanvas();
    const canvasStatus = canvas.getStatus();
    if (canvasStatus.drawn) {
      if (status === 'ready') {
        const startTime = Date.now() + delay;
        const animateCount = canvas.computed.animate;
        canvas._setComputed({ animate: animateCount + 1 });
        Utils.assign(this.animateCfg, {startTime, lastTime: 0});
        this.timer = requestAnimationFrame(this._playAnimation);
        canvas.draw();
      }
    } else {
      canvas.once('@@play', this.play);
    }
  };

  stop() {
    this._stopAnimation(this.animateCfg.cb);
  }

  includes() {
    return true;
  }

  update() {
  }

  on(event, fun) {
    const canvas = this.getCanvas();
    canvas.on(event, fun, this);
  }

  off(type, fun) {
    const canvas = this.getCanvas();
    canvas.off(type, fun, this);
  }

  destroy () {
    const canvas = this.getCanvas();
    canvas.remove(this);
  }
}
