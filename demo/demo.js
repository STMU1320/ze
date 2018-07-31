
const canvas = new ZE.Canvas('container', {
  width: 800,
  height: 600,
  style: {
    strokeStyle: 'black'
  }
});

// canvas.addShape('ring', {
//   attrs: {
//     x: 200,
//     y: 200,
//     inner: 50,
//     outer: 100,
//     angle: 360,
//     start: 0,
//     opacity: 0.1
//   },
//   event: {
//     click () {
//       console.log('1');
//     }
//   }
// });
canvas.addShape('ring', {
  attrs: {
    x: 200,
    y: 200,
    inner: 50,
    outer: 100,
    angle: -300,
    start: 0
  },
  event: {
    click () {
      console.log('click');
    }
  }
});

canvas.draw();
