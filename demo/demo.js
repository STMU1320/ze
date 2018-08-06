
const canvas = new ZE.Canvas('container', {
  width: 800,
  height: 600,
  style: {
    strokeStyle: 'black',
    lineWidth: 5
  }
});

canvas.addShape('arc', {
  attrs: {
    x: 300,
    y: 300,
    r: 50,
    // angle: 180
  },
  animate: {
    props: {
      angle: 360
    },
    duration: 800,
    effect: 'easeOut'
  },

  event: {
    click (e) {
      console.log(e);
    }
  }
});

canvas.addShape('bezier', {
  attrs: {
    p: [
      { x: 0, y: 100 },
      { x: 200, y: 200 },
      { x: 400, y: 100 }
    ]
  },
  event: {
    click () {
      console.log(this);
    }
  }
});

canvas.draw();
