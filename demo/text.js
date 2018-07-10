
function getRandomNum (min, max) {
  if (!max) {
    max = min;
    min = 0;
  }
  return Math.round(Math.random() * (max - min) + min);
}


const canvas = new ZE.Canvas('container', {
  width: 1000,
  height: 800,
  style: {
    fillStyle: '#fff',
  }
});
function callback (shape) {
  shape.destroy();
};

function addShape (count = 500) {
  const { shapeLength } = canvas.computed;
  if (shapeLength < count) {
    for (let i = 0; i < count - shapeLength; i++) {
      canvas.addShape('text', {
        attrs: {
          x: 1000,
          y: getRandomNum(800),
          text: i
        },
        style: {
          fillStyle: ['#fff', 'blue', 'green', 'red'][ i % 4],
          fontSize: getRandomNum(16, 32)
        },
        animate: {
          attrs: {
            x: -50
          },
          duration: getRandomNum(10000, 20000),
          callback,
          delay: getRandomNum(20000),
          // repeat: true
        },
        event: {
          click (e) {
            console.log(e);
          }
        }
      });
    }
  }
}


 const ctx = canvas.getContext();
 ctx.canvas.style.background = '#333';

 addShape();

 setInterval(addShape, 10000);

canvas.draw();