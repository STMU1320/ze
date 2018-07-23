// 此处代码为生成Html元素


const canvas = new ZE.Canvas('container', {
  width: 1000,
  height: 800,
  style: {
    fillStyle: '#fff',
  }
});

const ctx = canvas.getContext();
ctx.canvas.style.background = '#333';

canvas.addShape('polygon', {
  attrs: {
    r: 100,
    x: 200,
    y: 200,
    vertices: 4,
    // angle: 90,
    regular: true
  },
  animate: {
    props: {
      angle: 360,
      r: 200
    },
    effect: 'easeIn',
    duration: 5000,
    loop: true
  },
  style: {
    fillStyle: 'red'
  }
});

canvas.draw();
