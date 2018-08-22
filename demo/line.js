const data = [820, 932, 901, 934, 1290, 1330, 1320];
const xAxis = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const padding = 50;
const width = 1000;
const height = 800;
const contentHeight = height - 2 * padding;
const contentWidth = width - 2 * padding;
const scaleLength = 5; // 刻度线的长度

const canvas = new ZE.Canvas('container', {
  width,
  height
});

let lineLayer, pointsLayer;

function initLayers() {
 
  lineLayer = canvas.addLayer({
    attrs: {
      x: padding,
      y: padding,
      width: contentWidth,
      height: contentHeight,
    },
    style: {
      strokeStyle: '#FD1050',
    },
    // event: {
    // },
  });
  pointsLayer = canvas.addLayer({
    attrs: {
      x: padding,
      y: padding,
      width: contentWidth,
      height: contentHeight,
    },
    style: {
      strokeStyle: '#FD1050',
    },
    visible: false
  });
}

function drawAxis(max, data, xAxis) {
  const rows = 5;
  const columns = data.length;
  const yStep = max / rows;
  // y axis
  canvas.addShape('line', {
    attrs: {
      x1: padding,
      y1: padding - scaleLength,
      x2: padding,
      y2: padding + contentHeight,
    },
  });
  for (let i = 0; i <= rows; i++) {
    const positionY = padding + i * contentHeight / rows;

    canvas.addShape('line', {
      attrs: {
        x1: padding - scaleLength,
        y1: positionY,
        x2: padding,
        y2: positionY,
      },
    });
    canvas.addShape('line', {
      attrs: {
        x1: padding,
        y1: positionY,
        x2: padding + contentWidth,
        y2: positionY,
        opacity: 0.2
      },
    });
    canvas.addShape('text', {
      attrs: {
        x: padding - scaleLength * 2,
        y: positionY,
        text: max - yStep * i,
      },
      style: {
        textAlign: 'right',
        textBaseline: 'middle',
      },
    });
  }
  // x axis
  const xStep = contentWidth / columns;
  const half = xStep / 2;
  canvas.addShape('line', {
    attrs: {
      x1: padding,
      y1: padding + contentHeight,
      x2: width - padding + scaleLength,
      y2: padding + contentHeight,
    },
  });

  for (let j = 0; j < columns; j++) {
    const startX = padding + half;
    const textX = startX + xStep * j;
    const scaleX = padding + (j + 1) * xStep;
    canvas.addShape('line', {
      attrs: {
        x1: scaleX,
        y1: padding + contentHeight,
        x2: scaleX,
        y2: padding + contentHeight + scaleLength,
      },
    });
    canvas.addShape('text', {
      attrs: {
        x: textX,
        y: padding + contentHeight + scaleLength,
        text: xAxis[j],
      },
      style: {
        textAlign: 'center',
        textBaseline: 'top',
      },
    });
  }
}

function drawLine(max, data) {
  const ratio = contentHeight / max;
  const xStep = contentWidth / data.length;
  const half = xStep / 2;
  const points = data.map((item, index) => {
    let positionY = item * ratio;
    positionY = contentHeight - positionY;
    const positionX = half  + index * xStep;
    return [positionX, positionY];
  });

  const ball = lineLayer.addShape('circle');


  // lineLayer.addShape('polyline', {
  //   attrs: {
  //     points,
  //     smooth: 0.2,
  //   },
  // });
  lineLayer.addShape('polyline', {
    attrs: {
      points,
      smooth: 0.2,
      t: 0,
      position: true
    },
    style: {
      lineWidth: 5
    },
    animate: {
      props: {
        t: 1
      },
      duration: 10000,
      // effect: 'easeOut',
      frameEnd (line) {
        const { position } = line.computed;
        ball.setAttrs({ x: position[0], y: position[1] });
      },
      callback () {
        pointsLayer.show();
      },
    },
    event: {
      click () {
        console.log('click');
      }
    }
  });
  points.forEach((item, index) => {
    const point = pointsLayer.addShape('circle', {
      attrs: {
        x: item[0],
        y: item[1],
        r: 3,
        hasStroke: true
      },
      style: {
        lineWidth: 2,
        fillStyle: 'white',
      },
      event: {
        mouseenter () {
          this.animate({
            props: {
              r: 6
            },
            duration: 200,
            effect: 'easeInQuint'
          });
          this.text.show();
        },
        mouseout () {
          this.animate({
            props: {
              r: 3
            },
            duration: 200,
            effect: 'easeOutQuint'
          });
          this.text.hide();
        }
      }
    });
    const text = pointsLayer.addShape('text', {
      attrs: {
        x: item[0],
        y: item[1] - 20,
        text: data[index],
      },
      style: {
        textAlign: 'center'
      },
      visible: false
    });
  
    point.text = text;
  });
}

function draw(data, xAxis) {
  let max = -Infinity;
  data.forEach(item => {
    if (item > max) {
      max = item;
    }
  });
  max = Math.ceil(max / 100) * 100;
  initLayers();
  drawAxis(max, data, xAxis);
  drawLine(max, data);
  canvas.draw();
}

draw(data, xAxis);
