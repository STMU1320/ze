
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
  // shape.destroy();
  console.log('done');
};

function addShape (count = 3) {
  const { shapeLength } = canvas.computed;
  if (shapeLength < count) {
    for (let i = 0; i < count - shapeLength; i++) {
      canvas.addShape('text', {
        attrs: {
          x: 300,
          y: getRandomNum(800),
          text: i
        },
        style: {
          fillStyle: ['#fff', 'blue', 'green', 'red'][ i % 4]
        },
        animate: {
          attrs: {
            x: 100
          },
          duration: getRandomNum(10000, 20000),
          callback,
          delay: getRandomNum(20000),
          loop: true
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

//  canvas.addShape('rect', {
//     attrs: {
//       x: 50,
//       y: 50,
//       w: 100,
//       h: 200
//     },
//     animate: {
//       attrs: {
//         w: 300
//       },
//       duration: 1000,
//       loop: true
//     },
//   });

const circle = canvas.addShape('circle', {
  attrs: {
    x: 500,
    y: 500,
    r: 50,
    hasStroke: true
  },
  style: {
    strokeStyle: 'red',
    lineWidth: 5
  }
});

circle.animate({
  attrs: {
    r: 300
  },
  duration: 1000,
  loop: true
});

 addShape();

//  setInterval(addShape, 10000);

canvas.draw();

console.log(canvas);