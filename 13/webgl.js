
var VSHADER_SOURCE = 
	'attribute vec4 a_Position; \n' +
	'uniform mat4 u_xformMatrix; \n' +
	'void main() {\n' +
	'gl_Position = u_xformMatrix * a_Position ;\n' + //设置坐标，必须
	'}\n';

var FSHADER_SOURCE = 
	'void main() {\n' +
	'gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n' + // 设置颜色
	'}\n';

var ANGLE = 60.0;
var Tx = 0.5;
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

	var radian = Math.PI * ANGLE / 180.0; // 转为弧度制
	var cosB = Math.cos(radian);
	var sinB = Math.sin(radian);

	var xformMatrix = new Matrix4();
	// 设置模型矩阵为旋转矩阵
	xformMatrix.setRotate(ANGLE, 0, 0, 1);
	// 将模型矩阵乘以平移矩阵
	xformMatrix.translate(Tx, 0, 0);

	// xformMatrix.setTranslate(Tx, 0, 0);
	// xformMatrix.rotate(ANGLE, 0, 0, 1);

	var u_xformMatrix = gl.getUniformLocation(gl.program, 'u_xformMatrix');

	gl.uniformMatrix4fv(u_xformMatrix, false, xformMatrix.elements);
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT);

	gl.drawArrays(gl.TRIANGLE_FAN, 0, n);
}

function initVertexBuffers(gl) {
	var vertices = new Float32Array([
			-0.2, 0.2, -0.2, -0.2, 0.2, 0.2, 0.2, -0.2
		]);
	var n = 4;

	var vertexBuffer = gl.createBuffer();
	if (!vertexBuffer) {
		console.log('sth wrong');
		return -1;
	}

	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
	
	gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

	var a_Position = gl.getAttribLocation(gl.program, 'a_Position');

	gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

	gl.enableVertexAttribArray(a_Position);

	return n;
}
