
function getRandomNum (min, max) {
  if (!max) {
    max = min;
    min = 0;
  }
  return Math.round(Math.random() * (max - min) + min);
}


const canvas = new ZE.Canvas('container', {
  width: 1000,
  height: 800
});
function callback (shape) {
  canvas.remove(shape);
};

function addShape (count = 500) {
  const { shapeLength } = canvas.computed;
  if (shapeLength < count) {
    for (let i = 0; i < count - shapeLength; i++) {
      const text = canvas.addShape('text', {
        attrs: {
          x: 1000,
          y: getRandomNum(800),
          text: i
        }
      });
      text.animate({ x: -50 }, getRandomNum(10000, 20000), callback, getRandomNum(20000));
      text.on('click', (e) => { console.log(e.shape); });
    }
  }
}

 const ctx = canvas.getContext();
 ctx.canvas.style.background = '#666';
 ctx.font = '16px Arial';
 ctx.fillStyle = '#fff';

 addShape();

 setInterval(addShape, 10000);

canvas.draw();
console.log(canvas);