function getRandomNum (min, max) {
  if (!max) {
    max = min;
    min = 0;
  }
  return Math.round(Math.random() * (max - min) + min);
}

const data = [
  {
    label: 'pie1',
    value: getRandomNum(10, 500),
    color: '#ffe065'
  },
  {
    label: 'pie2',
    value: getRandomNum(10, 500),
    color: '#f968e0'
  },
  {
    label: 'pie3',
    value: getRandomNum(10, 500),
    color: '#b16af3'
  },
  {
    label: 'pie4',
    value: getRandomNum(10, 500),
    color: '#3bcfea'
  },
  {
    label: 'pie5',
    value: getRandomNum(10, 500),
    color: '#77f3da'
  },
  {
    label: 'pie6',
    value: getRandomNum(10, 500),
    color: '#79e942'
  },
];

const outer = 200;
const inner = 100;
const duration = 800;
const cx = 400, cy = 300;

const canvas = new ZE.Canvas('container', {
  width: 800,
  height: 600,
  style: {
    strokeStyle: 'black'
  }
});

const infoLayer = canvas.addLayer({
  visible: false,
  zIndex: 9
  });
infoLayer.addShape('rect', {
  attrs: {
    w: 100,
    h: 100,
    x: 20,
    y: 10,
    opacity: 0.6,
    radius: 5
  },
  style: {
    shadowBlur: 10,
    shadowColor: '#000000',
  }
});
const text = infoLayer.addShape('text', {
  attrs: {
    x: 30,
    y: 40,
    text: ['label: -', 'value: 0']
  },
  style: {
    fontSize: 16,
    fillStyle: 'white'
  }
});

const ringLayer = canvas.addLayer({
  event: {
    mouseenter () {
      canvas.element.style.cursor = 'pointer';
      infoLayer.show();
    },
    mousemove: (e) => {
      infoLayer.setAttrs({
        x: e.x,
        y: e.y
      }).update();
      // const x = e.x + 20;
      // const y = e.y;
      // const l = Math.sqrt(
      //   Math.pow(x - infoLayer.attrs.x, 2),
      //   Math.pow(y - infoLayer.attrs.y, 2),
      // );
      // if (l > 20) {
      //   infoLayer.animate({
      //     props: {
      //       x,
      //       y
      //     },
      //     duration: 100,
      //     effect: 'easeOut'
      //   });
      // }
    },
    mouseout () {
      canvas.element.style.cursor = 'auto';
      infoLayer.hide();
    }
  }
});
ringLayer.boxTrigger(false);


const total = data.reduce((pre, item) => pre += item.value, 0);
let percent = 0;


data.forEach((item) => {
  const currentPercent = item.value / total;
  const start = percent * 360;
  ringLayer.addShape('ring', {
    attrs: {
      x: cx,
      y: cy,
      inner,
      outer,
      angle: 0,
      start,
    },
    animate: {
      props: {
        angle: currentPercent * 360
      },
      // effect: 'easeInOut',
      duration: duration * currentPercent,
      delay: duration * percent - 10
    },
    style: {
      fillStyle: item.color,
    },
    event: {
      mouseenter () {
        text.setAttrs({
          text: [`label: ${item.label}`, `value: ${item.value}`]
        });
        this.animate({
          props: {
            outer: outer * 1.1
          },
          duration: 100,
          effect: 'easeOutCirc'
        });
      },
      mouseout () {
        this.animate({
          props: {
            outer
          },
          duration: 100,
          effect: 'easeOutCirc'
        });
      }
    }
  });
  percent += currentPercent;
});
canvas.draw();
