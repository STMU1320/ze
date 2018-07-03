// 暂时把所有图形的事件都挂在canvas实列下，注册事件的图形过多后可能会对性能有影响.
// import EventBus from './eventBus';
import animate from './animate';

const DRAW_ATTRS = [
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

  static ATTRS = {
    fillStyle: 'black',
    strokeStyle: 'black'
  }

  constructor (container, type, cfg) {
    this.container = container;
    this.type = type;
    this.computed = {};
    this.canvas = null;
    const drawAttrs = {};
    const shapeAttrs = {};
    if (cfg.attrs) {
      Object.keys(cfg.attrs).forEach((key) => {
        if (DRAW_ATTRS.includes(key)) {
          drawAttrs[key] = cfg.attrs[key];
        } else {
          shapeAttrs[key] = cfg.attrs[key];
        }
      });
    }
    this.drawAttrs = Object.assign({}, Element.ATTRS, drawAttrs);
    this.animateCfg = Object.assign({}, cfg.animate);
    this.timer = null;
    this.shapeAttrs = shapeAttrs;
    this.zIndex = cfg.zIndex || 0;
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

  
  _playAnimation = () => {
    let { startTime, duration, to, diff, from, effect  } = this.animateCfg;
    const canvas = this._getCanvasInstance();
    const now = Date.now();
    const passTime = now - startTime;
    if (passTime > 0) {
      if (passTime < duration) {
        const baseRatio = passTime / duration;
        const ratio = animate[effect](baseRatio);
        const nextAttrs = {};
        Object.keys(from).forEach(key => {
          nextAttrs[key] = from[key] + diff[key] * ratio;
        });
        this.setShapeAttrs(nextAttrs);
        Object.assign(this.animateCfg, { status: 'playing' });
      } else {
        this.setShapeAttrs(to);
        Object.assign(this.animateCfg, { status: 'stop' });
      }
      
      canvas.draw();
    }

    if (passTime < duration) {
      this.timer = requestAnimationFrame(this._playAnimation);
    } else {
      cancelAnimationFrame(this.timer);
      this.timer = null;
    }
  }

  animate (attrs, duration, effect, cb, delay = 0) {
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
    const initAttrs = this.getShapeAttrs();
    const from = {};
    const diff = {};
    Object.keys(attrs).forEach(key => {
      const temp = attrs[key] - initAttrs[key];
      from[key] = initAttrs[key];
      diff[key] = temp;
    });
    this.animateCfg = { startTime: Date.now() + delay, duration, effect, status: 'ready', to: attrs, from, diff };
    this.timer = requestAnimationFrame(this._playAnimation);
    cb && cb();
  }

  getShapeAttrs () {
    return this.attrs;
  }

  setShapeAttrs (attrs) {
    Object.assign(this.attrs, attrs);
  }

  getContext () {
    return this.container.getContext();
  }

  getCanvas () {
    return this.container.getCanvas();
  }

  includes () {
    return true;
  }

  on (event, fun) {
    const canvasInstance = this._getCanvasInstance();
    canvasInstance.on(event, fun, this);
  }

}