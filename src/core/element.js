// 暂时把所有图形的事件都挂在canvas实列下，注册事件的图形过多后可能会对性能有影响.
// import EventBus from './eventBus';
import Animate from './animate';

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

export default class Element extends Animate {

  static ATTRS = {
    fillStyle: 'black',
    strokeStyle: 'black'
  }

  constructor (container, type, cfg) {
    super(cfg.animate);
    this.container = container;
    this.type = type;
    this.computed = {};
    this.canvas = null;
    const drawAttrs = {};
    if (cfg.attrs) {
      Object.keys(cfg.attrs).forEach((key) => {
        if (DRAW_ATTRS.includes(key)) {
          drawAttrs[key] = cfg.attrs[key];
        }
      });
    }
    this.drawAttrs = Object.assign({}, Element.ATTRS, drawAttrs);
    this.zIndex = cfg.zIndex || 0;
  }

  set (key, value) {
    this[key] = value;
  }

  getContext () {
    return this.container.getContext();
  }

  getCanvas () {
    return this.container.getCanvas();
  }

  _getCanvasInstance () {
    if (!this.canvas) {
      this.canvas = this.container._getCanvasInstance();
    }
    return this.canvas;
  }

  includes () {
    return true;
  }

  on (event, fun) {
    const canvasInstance = this._getCanvasInstance();
    canvasInstance.on(event, fun, this);
  }

}