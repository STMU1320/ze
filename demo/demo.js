
const canvas = new ZE.Canvas('container', {
  width: 800,
  height: 600,
  style: {
    strokeStyle: 'black'
  }
});

canvas.addShape('line', {
  attrs: {
    x1: 0,
    y1: 10,
    x2: 1000,
    y2: 500,
    dash: 5
  }
});

canvas.draw();
