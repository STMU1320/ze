// 暂时把所有图形的事件都挂在canvas实列下，注册事件的图形过多后可能会对性能有影响.
// import EventBus from './eventBus';
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
    const { attrs, style, animate, zIndex } = cfg;
    this.container = container;
    this.type = type;
    this.attrs = attrs;
    this.canvas = null;
    this.timer = null;
    this.zIndex = zIndex || 0;
    this._status = {drawn: false, dirty: false};
    this._initStyle(style);
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
    this.style = Object.assign({}, _style, parentStyle);
  }

  _initAnimate (animate) {
    this.animateCfg = Object.assign({}, Element.DEFAULT_ANIMATE_CFG, animate);
  }

  _initComputed() {
    this.computed = {};
  }

  _stopAnimation = cb => {
    if (this.timer) {
      cancelAnimationFrame(this.timer);
      this.timer = null;
    }
    cb && cb(this);
  };

  _playAnimation = () => {
    let {startTime, duration, to, diff, from, effect, cb} = this.animateCfg;
    const now = Date.now();
    const passTime = now - startTime;
    if (passTime < 0) {
      // 此处有待验证哪种方式的性能会好些
      // this.timer = requestAnimationFrame(this._playAnimation);
      // return this.timer;
      return setTimeout(this._playAnimation, -passTime);
    } else if (passTime < duration) {
      const baseRatio = passTime / duration;
      const ratio = animate[effect](baseRatio);
      const nextAttrs = {};
      Object.keys(from).forEach(key => {
        nextAttrs[key] = ~~(from[key] + diff[key] * ratio + 0.5);
      });
      this.setAttrs(nextAttrs);
      this.animateCfg.status = 'playing';
      this.update('auto');
      this.timer = requestAnimationFrame(this._playAnimation);
    } else {
      this.setAttrs(to);
      this.animateCfg.status = 'stop';
      this._stopAnimation(cb);
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
      Object.assign(this[key], value);
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

  animate(attrs, duration, effect, cb, delay = 0, autoPlay = true) {
    if (typeof effect === 'function') {
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
    const initAttrs = this.attrs;
    const from = {};
    const diff = {};
    Object.keys(attrs).forEach(key => {
      const temp = attrs[key] - initAttrs[key];
      from[key] = initAttrs[key];
      diff[key] = temp;
    });
    Object.assign(this.animateCfg, {
      duration,
      effect,
      status: 'ready',
      to: attrs,
      from,
      diff,
      cb,
      delay,
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
        Object.assign(this.animateCfg, {startTime: Date.now() + delay});
        this.timer = requestAnimationFrame(this._playAnimation);
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

  update(auto) {
    const canvas = this.getCanvas();
    canvas.emit('@@update', auto);
    // const now = Date.now();
    // // 判断一下是动画自动的更新还是手动触发的更新
    // if (auto === 'auto') {
    //   if (now - canvas.drawInfo.drawTime > 10) {
    //     canvas.emit('@@update', 'auto');
    //   }
    // } else {
    //   canvas.emit('@@update');
    // }
  }

  on(event, fun) {
    const canvas = this.getCanvas();
    canvas.on(event, fun, this);
  }

  off(type, fun) {
    const canvas = this.getCanvas();
    canvas.off(type, fun, this);
  }
}
