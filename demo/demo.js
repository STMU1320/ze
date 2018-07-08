
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
    font: '16px sans-serif'
  }
});
function callback (shape) {
  canvas.remove(shape);
};

function addShape (count = 1000) {
  const { shapeLength } = canvas.computed;
  if (shapeLength < count) {
    for (let i = 0; i < count - shapeLength; i++) {
      canvas.addShape('text', {
        attrs: {
          x: 1000,
          y: getRandomNum(800),
          text: i
        },
        animate: {
          attrs: {
            x: -50
          },
          duration: getRandomNum(10000, 20000),
          callback,
          delay: getRandomNum(20000)
        }
      });
    }
  }
}


 const ctx = canvas.getContext();
 ctx.canvas.style.background = '#666';

 addShape();

 setInterval(addShape, 10000);

canvas.draw();

console.log(canvas);