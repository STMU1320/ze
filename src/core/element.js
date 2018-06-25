export default class Element {
  constructor (container) {
    this.container = container;
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

  on (type, fun) {
    const canvasInstance = this._getCanvasInstance();
    canvasInstance.on(type, fun, this);
  }

}