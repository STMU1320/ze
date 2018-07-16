
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

const layer = canvas.addLayer({zIndex: -2});

function callback (shape) {
  shape.destroy();
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

layer.addShape('video', {
  attrs: {
    x: 0,
    y: 0,
    w: canvas.width,
    h: canvas.height,
    video: 'http://119.147.39.233/6774435E4C8387164F87B418A/03000B01005B4535FBA5E4F2BEEFCF21988718-6C1E-4F65-B5E3-00E577AC85B9.mp4?ccode=0502&duration=226&expire=18000&psid=9263f3783e01bd8d176ceb28c8e89ef7&sp=&ups_client_netip=7418425b&ups_ts=1531271619&ups_userid=&utid=av6sE2xGpzYCAXd7epJXGLWS&vid=XMzcxNjExNjgwOA%3D%3D&vkey=B369e3997a8398a9bdcb85a2a92daa7bc&s=5882db0d0cb64392b1a5&ali_redirect_domain=vali-dns.cp31.ott.cibntv.net',
  }
});

 const ctx = canvas.getContext();
 ctx.canvas.style.background = '#333';

 addShape();

 setInterval(addShape, 10000);
canvas.draw();
