const algebra = require('algebra.js');

export function generate ({ r, x, y, vertices }) {
			const half =  vertices / 2;
			const points = [
				[x, y - r]
			];
			if (vertices % 2 === 0) {
				points[half] = [x, y + r];
			}
			const vertexAngle = Math.PI * 2 / vertices;
			const vectorProduct = vertexAngle => Math.round(r * r * Math.cos(vertexAngle));
			
			for(let i = 1; i <= (vertices - 1) / 2; i++) {
				let xp = 0, yp = 0;
				const nowAngle = vertexAngle * i;
				const px = points[0][0];
				const py = points[0][1];
				const vectorStr = `(x - ${x}) * (${px - x}) + (y - ${y}) * (${py - y}) = ${vectorProduct(nowAngle)}`;
				const eq1 = algebra.parse(vectorStr);
				console.log(eq1.toString());
				const yAns = eq1.solveFor('y');
				const yStr = yAns.toString();
//				console.log(yStr, yAns);
				const eq2 = algebra.parse(`(x - ${x}) ^ 2 + (${ yStr } - ${y}) ^ 2 = ${ Math.pow(r, 2) }`);
				const xAns = eq2.solveFor('x').valueOf();
				// debugger
				xAns.forEach((_x, index) => {
					xp = Math.round(_x.valueOf());
					if (yStr.includes('x')) {
						const temp = yAns.eval({ x: xp }).toString();
						if (temp.includes('/')) {
							const numArr = temp.split('/');
							const num1 = +numArr[0];
							const num2 = +numArr[1];
							yp = Math.round(num1 / num2);
						} else {
							yp = Math.round(+temp);
						}
					} else {
						yp = Math.round(yAns.valueOf());
					}

					if (index === 0 ) {
						points[vertices - i] = [xp, yp];
					} else {
						points[i] = [xp, yp];
					}
				});
			}
			
    return points;
}