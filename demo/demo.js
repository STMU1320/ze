
const canvas = new ZE.Canvas('container', {
  width: 800,
  height: 600,
});

canvas.addShape('line', {
  attrs: {
    x1: 0,
    x2: 800,
    y1: 300,
    y2: 300,
    opacity: 0.6
  }
});

canvas.addShape('text', {
  attrs: {
    text: ['看欧派咯天津楼市', '看欧派咯天津楼市', '看欧派咯天津楼市'],
    x: 400,
    y: 300,
    lineHeight: 30
  },
  style: {
    textAlign: 'left',
    fontSize: 20,
    textBaseline: 'top'
  },
  event: {
    click (e) {
      canvas.addShape('line', {
        attrs: {
          x1: 0,
          x2: 800,
          y1: e.y,
          y2: e.y,
          opacity: 0.6
        },
        style: {
          strokeStyle: 'red'
        }
      });
      canvas.update();
    }
  }
});

canvas.draw();

