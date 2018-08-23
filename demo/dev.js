function getRandomNum (min, max) {
  if (!max) {
    max = min;
    min = 0;
  }
  return Math.round(Math.random() * (max - min) + min);
}

function clamp(a, min, max) {
  if (a < min) {
    return min;
  } else if (a > max) {
    return max;
  }
  return a;
}

const colors = ['#ffe065', '#f968e0', '#b16af3', '#3bcfea', '#77f3da', '#79e942'];
const wrap = document.getElementById('#content') || document.body;
const width = wrap.clientWidth;
const height = wrap.clientHeight || window.innerHeight;
const centerX = width / 2;
const canvas = new ZE.Canvas('container', {
  width,
  height
});

for (let i = 0; i < 150; i++) {
  const duration = getRandomNum(800, 1200);
  const firstDiff = getRandomNum(-centerX / 8, centerX / 8);
  const secondDiff = getRandomNum(firstDiff * 1.5, firstDiff * 3);
  const thirdDiff = getRandomNum(secondDiff * 1.5, secondDiff * 3);
  const maxR = clamp((1 - Math.abs(thirdDiff / centerX)) * 70, 10, 70);
  const ball = canvas.addShape('circle', {
    attrs: {
      x: centerX,
      y: 0,
      r: 3,
      opacity: 0.2
    },
    style: {
      fillStyle: 'white'
    },
    animate: {
      props: {
        fillStyle: colors[getRandomNum(colors.length - 1)],
        r: getRandomNum(30, maxR),
        opacity: 0.8
      },
      duration,
      effect: 'easeOut'
    }
  });

  const line = canvas.addShape('polyline', {
    attrs: {
      points: [[centerX, 0], [centerX + firstDiff, height * 0.5 ], [centerX + secondDiff, height * 0.75], [centerX + thirdDiff, height - getRandomNum(maxR * 1.5)]],
      smooth: 0.2,
      t: 0,
      position: true
    },
    visible: false,
    animate: {
      props: {
        t: 1
      },
      duration,
      effect: 'easeOutQuart',
      frameEnd (self) {
        const { position } = self.computed;
        self.ball.setAttrs({ x: position[0], y: position[1] });
      },
      callback (self) {
        const ball = self.ball;
        const { x, y } = ball.attrs;
        const ratio =  1.2 - Math.abs((x - centerX) / centerX);
        const diffX = getRandomNum(-100, 100) * ratio;
        const diffY = getRandomNum(-50, 50) * ratio;
        ball.animate({
          props: {
            x: x + diffX,
            y: y + diffY,
          },
          duration: getRandomNum(1500, 2500),
          loop: true
        });
      }
    }
  });
  line.ball = ball;
}

const textLayer = canvas.addLayer();

textLayer.addShape('text', {
  attrs: {
    text: 'Z E',
    x: centerX,
    y: height * 0.4
  },
  style: {
    fontSize: 90,
    textAlign: 'center',
    textBaseline: 'middle'
  }
});

canvas.draw();

