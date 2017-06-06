// 发生在顶点着色器和片元着色器之间的从图形到片元的转化，称为图元光栅化
var VSHADER_SOURCE = 
	'attribute vec4 a_Position; \n' +
	'attribute float a_PointSize; \n' +
	'void main() {\n' +
	'gl_Position = a_Position;\n' + //设置坐标，必须
	'gl_PointSize = a_PointSize;\n' +
	'}\n';

var FSHADER_SOURCE = 
	'void main() {\n' +
	'gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n' + // 设置颜色
	'}\n';

// 每秒旋转角度
var ANGLE_STEP = 45.0;
function main() {
	var canvas = document.getElementById('example');
	var gl = canvas.getContext('webgl');
	if (!gl) {
		console.log('sth wrong');
		return;
	}

	if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
		console.log('sth wrong');
		return;
	}

	var n = initVertexBuffers(gl);
	if (n < 0) {
		console.log('sth wrong');
	}
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT);

	gl.drawArrays(gl.POINTS, 0, n);
}

function initVertexBuffers(gl) {
	var n = 3;
	
	var vertices = new Float32Array([
			0.0, 0.5, -0.5, -0.5, 0.5, -0.5
		]);
	

	var sizes = new Float32Array([
			10.0, 20.0, 30.0
		]);
	
	var verticesSizesBuffer = gl.createBuffer();
	var verticesSizes = new Float32Array([
			0.0, 0.5, 10.0,
			-0.5, -0.5, 20.0,
			0.5, -0.5, 30.0
		]);

	var vertexBuffer = gl.createBuffer();
	var sizeBuffer = gl.createBuffer();
	if (!vertexBuffer) {
		console.log('sth wrong');
		return -1;
	}

	// 基本逻辑
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);	
	gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
	var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
	gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(a_Position);

	gl.bindBuffer(gl.ARRAY_BUFFER, sizeBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, sizes, gl.STATIC_DRAW);
	var a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize');
	gl.vertexAttribPointer(a_PointSize, 1, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(a_PointSize);

	// 统一处理机制
	// gl.bindBuffer(gl.ARRAY_BUFFER, verticesSizesBuffer);
	// gl.bufferData(gl.ARRAY_BUFFER, verticesSizes, gl.STATIC_DRAW);
	// var FSIZE = verticesSizes.BYTES_PER_ELEMENT;
	// var  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
	// var a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize');
	// gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 3, 0);
	// gl.enableVertexAttribArray(a_Position);
	// gl.vertexAttribPointer(a_PointSize, 1, gl.FLOAT, false, FSIZE * 3, FSIZE * 2);
	// gl.enableVertexAttribArray(a_PointSize);
	return n;
}

