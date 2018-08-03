
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

canvas.draw();
