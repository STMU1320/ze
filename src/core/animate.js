
export default class Animate {

  static ATTRS = {}

  constructor (cfg) {
    this.animateCfg = Object.assign({}, Animate.ATTRS, cfg);
    this.animating = false;
    this.timer = null;
  }

  // animate (attrs, duration) {
  //   let step = 0;
  //   Object.keys(attrs).forEach(key => {});
  // }

  // stop () {

  // }


}