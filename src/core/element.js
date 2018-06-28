// 暂时把所有图形的事件都挂在canvas实列下，注册事件的图形过多后可能会对性能有影响.
// import EventBus from './eventBus';

export default class Element {
  constructor (container, type) {
    this.container = container;
    this.type = type;
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