// 暂时把所有图形的事件都挂在canvas实列下，注册事件的图形过多后可能会对性能有影响.
// import EventBus from './eventBus';
import Utils from 'utils';
import animate from './animate';
import {interpolate, interpolateNumber, interpolateRgb} from 'd3-interpolate';

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
    const {attrs, style, animate, zIndex, event} = cfg;
    this.container = container;
    this.type = type;
    this.attrs = attrs;
    this.canvas = null;
    this.timer = null;
    this.zIndex = zIndex || 0;
    this.deep = container instanceof Element ? container.deep + 1 : 0;
    this._status = {drawn: false, dirty: false};
    this._initStyle(style);
    this._initEvent(event);
    this._initComputed();
    this._initAnimate(animate);
  }

  _initStyle(style = {}) {
    const parentStyle = this.container.style;
    const _style = this._getFontStyle(style);
    Object.keys(style).forEach(key => {
      if (STYLE_KEYS.includes(key)) {
        _style[key] = style[key];
      }
    });
    this.style = Utils.assign({}, parentStyle, _style);
  }

  _getFontStyle(style) {
    const result = {};
    const parent = this.container;
    const ctx = parent.getContext();
    const parentFont = ctx.font;
    const pFontArr = parentFont.split(/(\d{1,}px)/ig);
    result.textBaseline = parent.style.textBaseline || ctx.textBaseline;
    if (!style.font) {
      let font = [''];
      if (style.fontStyle) {
        font[0] = font[0] + style.fontStyle + ' ';
      }
      if (style.fontWeight) {
        font[0] = font[0] + style.fontWeight + ' ';
      }
      if (style.fontVariant) {
        font[0] = font[0] + style.fontVariant + ' ';
      }
      if (style.fontSize) {
        const fontSize = typeof style.fontSize === 'string'
          ? style.fontSize
          : `${style.fontSize}px`;
        font[1] = fontSize;
      } else {
        font[1] = pFontArr[1];
      }
      if (style.fontFamily) {
        font[2] = style.fontFamily;
      } else {
        font[2] = pFontArr[2];
      }
      font[0] = font[0] || pFontArr[0];
      if (parseInt(font[1]) < 12) {
        font[1] = '12px';
      }
      result.font = font.join(' ');
    }
    return result;
  }

  _getFontSize (font) {
    const ctx = this.container.getContext();
    const size = /(^|\s)(\d{1,}\.?\d*)px(\s|$)/ig.exec(font || ctx.font)[2];
    return size ? +size : 0;
  }

  _initEvent(event) {
    if (event && typeof event === 'object') {
      for (let key in event) {
        this.on(key, event[key]);
      }
    }
  }

  _initAnimate(animate) {
    this.animateCfg = Utils.assign({}, Element.DEFAULT_ANIMATE_CFG);
    if (animate) {
      this.animate(animate);
    }
  }

  _initComputed() {
    this.computed = {};
  }

  _updateComputed() {}

  _stopAnimation = cb => {
    const canvas = this.getCanvas();
    if (this.timer) {
      cancelAnimationFrame(this.timer);
      this.timer = null;
    }
    const animateCount = canvas.computed.animate;
    canvas._setComputed({animate: animateCount - 1});
    canvas.draw();
    cb && cb(this);
  };

  _playAnimation = () => {
    let {
      startTime,
      duration,
      to,
      diff,
      from,
      effect,
      callback,
      repeat,
      loop
    } = this.animateCfg;
    const now = Date.now();
    const passTime = now - startTime;
    if (passTime < 0) {
      return setTimeout(this._playAnimation, -passTime);
    } else if (passTime < duration) {
      const baseRatio = passTime / duration;
      const ratio = animate[effect](baseRatio);
      const nextProps = {};
      Object.keys(diff).forEach(key => {
        nextProps[key] = diff[key](ratio);
      });
      this.setAttrs(nextProps);
      Utils.assign(this.animateCfg, {status: 'playing', lastTime: now});
      this.timer = requestAnimationFrame(this._playAnimation);
    } else if (loop) {
      this.setAttrs(to);
      this.animate({
        props: from,
        loop,
        duration,
        effect
      });
    } else if (repeat) {
      this.setAttrs(from);
      Utils.assign(this.animateCfg, {
        status: 'playing',
        lastTime: now,
        startTime: now,
      });
      this.timer = requestAnimationFrame(this._playAnimation);
    } else {
      this.setAttrs(to);
      this.animateCfg.status = 'stop';
      this._stopAnimation(callback);
    }
  };

  _noticeParentStatus(status) {
    const parent = this.container;
    if (parent.type === 'Layer') {
      parent._set('_status', status);
    }
  }
  _set(key, value) {
    if (!this[key]) {
      this[key] = value;
    } else {
      Utils.assign(this[key], value);
    }
  }

  _clear () {}

  setAttrs(props) {
    // 改变属性后自动更新计算属性并将自己设为脏值状态表示在下一次绘画中需要重新绘制
    if (Utils.isEmpty(props) && this.type !== 'Video') {
      return ;
    }
    const attrs = {}, style = {}, nextStatus = { dirty: true };
    Object.keys(props).forEach(key => {
      const value = props[key];
      if (key === 'fontSize') {
        style.font = this.style.font.replace(/(^|\s)(\d{1,}\.?\d*px)(\s|$)/ig, ` ${value}px `);
      } else if (['fillStyle', 'strokeStyle'].includes(key)) {
        style[key] = value;
      } else {
        attrs[key] = value;
      }
    });
    if (!Utils.isEmpty(style)) {
      nextStatus.styleChanged = true;
      this._set('style', style);
    }
    if ('opacity' in attrs) {
      nextStatus.styleChanged = true;
    }
    if (!Utils.isEmpty(attrs)) {
      this._set('attrs', attrs);
    }
    this._updateComputed();
    this.setStatus(nextStatus);
  }

  setStyle(style) {
    
    if (Utils.isEmpty(style)) {
      return ;
    }
    const keys = Object.keys(style);
    this._set('style', style);
    if (this.shapes) {
      this.shapes.forEach(shape => {
        shape.setStyle(style);
      });
    }
    if (keys.includes('lineWidth') || keys.includes('font')) {
      this._updateComputed();
    }
  }

  setStatus(status) {
    this._set('_status', status);
    if (status.dirty) {
      this._noticeParentStatus({dirty: true});
    }
  }

  getStatus() {
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
    const {
      props,
      duration,
      effect = 'linear',
      callback,
      delay = 0,
      repeat,
      loop,
      autoPlay = true,
    } = cfg;
    if (!props || !duration) {
      return;
    }
    const currentCfg = this.animateCfg;
    if (currentCfg.status === 'playing') {
      this._stopAnimation(currentCfg.callback);
    }
    const initAttrs = this.attrs;
    const style = this.style;
    const from = {};
    const to = {};
    const diff = {};
    Object.keys(props).forEach(key => {
      let start = initAttrs[key];
      if (['fillStyle', 'strokeStyle'].includes(key)) {
        const ctx = this.getContext();
        start = style[key] || ctx[key];
        diff[key] = interpolateRgb(start, props[key]);
      } else if (key === 'fontSize') {
        start = this._getFontSize(style.font);
        diff[key] = interpolateNumber(start, props[key]);
      } else if (typeof start === 'number') {
        diff[key] = interpolateNumber(start, props[key]);
      } else {
        diff[key] = interpolate(start, props[key]);
      }
      from[key] = start;
      to[key] = props[key];
    });
    Utils.assign(this.animateCfg, {
      duration,
      effect,
      status: 'ready',
      to,
      from,
      diff,
      callback,
      delay,
      repeat,
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
        canvas._setComputed({animate: animateCount + 1});
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
    const canvas = this.getCanvas();
    canvas.update();
  }

  on(event, fun) {
    const canvas = this.getCanvas();
    canvas.on(event, fun, this);
  }

  off(type, fun) {
    const canvas = this.getCanvas();
    canvas.off(type, fun, this);
  }

  destroy() {
    this._clear();
    const canvas = this.getCanvas();
    canvas.remove(this);
  }
}
