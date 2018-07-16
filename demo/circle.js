
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

function addShape (count = 500) {
  const { shapeLength } = canvas.computed;
  if (shapeLength < count) {
    for (let i = 0; i < count - shapeLength; i++) {
      canvas.addShape('circle', {
        attrs: {
          x: getRandomNum(10, 980),
          y: getRandomNum(10, 980),
          r: getRandomNum(3, 6),
          opacity: .6
        },
        animate: {
          props: {
            fillStyle: ['Aqua', 'Crimson', 'Fuchsia', 'Gold', 'PaleGreen'][i % 5],
            r: getRandomNum(6, 10),
            x: getRandomNum(450, 550),
            Y: getRandomNum(450, 550)
          },
          duration: getRandomNum(800, 2400),
          loop: true,
          effect: 'easeIn'
        }
      });
  }
}
}


 const ctx = canvas.getContext();
 ctx.canvas.style.background = '#333';

 addShape();

canvas.draw();
