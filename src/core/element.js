// 暂时把所有图形的事件都挂在canvas实列下，注册事件的图形过多后可能会对性能有影响.
// import EventBus from './eventBus';

const CANVAS_ATTRS = [
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
    const canvasAttrs = {};
    if (cfg.attrs) {
      Object.keys(cfg.attrs).forEach((key) => {
        if (CANVAS_ATTRS.includes(key)) {
          canvasAttrs[key] = cfg.attrs[key];
        }
      });
    }
    this.canvasAttrs = Object.assign({}, Element.ATTRS, canvasAttrs);
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
    return this.container._getCanvasInstance();
  }

  includes () {
    return true;
  }

  on (event, fun) {
    const canvasInstance = this._getCanvasInstance();
    canvasInstance.on(event, fun, this);
  }

}