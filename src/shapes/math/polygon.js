const algebra = require('algebra.js');
const Utils = require('utils').default;

export function generatePoints ({ r, x, y, vertices, angle }) {
			const half =  vertices / 2;
			let points = [
				[x, y - r]
			];
			if (vertices % 2 === 0) {
				points[half] = [x, y + r];
			}
			const vertexAngle = Math.PI * 2 / vertices;
			const vectorProduct = vectorAngle => 0 | Math.round(r * r * Math.cos(vectorAngle));
			
			for(let i = 1; i <= (vertices - 1) / 2; i++) {
				let pointX = 0, pointY = 0;
				// 根据向量夹角公式和两点距离公式算出多边形的每一个顶点
				const nowAngle = vertexAngle * i;
				const p1x = points[0][0];
				const p1y = points[0][1];
				const vectorStr = `(x - ${x}) * (${p1x - x}) + (y - ${y}) * (${p1y - y}) = ${vectorProduct(nowAngle)}`;
				const eq1 = algebra.parse(vectorStr);
				const yAns = eq1.solveFor('y');
				const yStr = yAns.toString();
				const eq2 = algebra.parse(`(x - ${x}) ^ 2 + (${ yStr } - ${y}) ^ 2 = ${ 0 | Math.pow(r, 2) }`);
				const xAns = eq2.solveFor('x').valueOf();
				// debugger
				xAns.forEach((_x, index) => {
					pointX = Math.round(_x.valueOf());
					if (yStr.includes('x')) {
						const temp = yAns.eval({ x: pointX }).toString();
						if (temp.includes('/')) {
							const numArr = temp.split('/');
							const num1 = +numArr[0];
							const num2 = +numArr[1];
							pointY = Math.round(num1 / num2);
						} else {
							pointY = Math.round(+temp);
						}
					} else {
						pointY = Math.round(yAns.valueOf());
					}

					if (index === 0 ) {
						points[vertices - i] = [pointX, pointY];
					} else {
						points[i] = [pointX, pointY];
					}
				});
			}

			if (!Utils.isEmpty(angle)) {
				// 如有旋转角度根据矩阵变换求出每一个顶点变换后的值， 起始角度为-Y轴
				const piAngle = angle / 180 * Math.PI;
				const cos = Math.cos;
				const sin = Math.sin;
				const trfMat = [];
				trfMat[0] = cos(piAngle);
				trfMat[1] = sin(piAngle);
				trfMat[2] = 0;
				trfMat[3] = -sin(piAngle);
				trfMat[4] = cos(piAngle);
				trfMat[5] = cos(0);
				trfMat[6] = (1 - cos(piAngle)) * x + sin(piAngle) * y;
				trfMat[7] = (1 - cos(piAngle)) * y - sin(piAngle) * x;
				trfMat[8] = 1;
				
				const newPoints = [];
				points.forEach((point) => {
					const x = point[0];
					const y = point[1];
					const z = 1;
					const _x = x * trfMat[0] + y * trfMat[3] + z * trfMat[6];
					const _y = x * trfMat[1] + y * trfMat[4] + z * trfMat[7];
					const _z = x * trfMat[2] + y * trfMat[5] + z * trfMat[8];
					newPoints.push([_x, _y, _z]);
				});
				points = newPoints;
			}


			// console.log(points);
			
    return points;
}