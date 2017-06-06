// 增加平移量
var VSHADER_SOURCE = 
	'attribute vec4 a_Position; \n' +
	'uniform vec4 u_Translation; \n' +
	'void main() {\n' +
	'gl_Position = a_Position + u_Translation;\n' + //设置坐标，必须
	'}\n';

var FSHADER_SOURCE = 
	'void main() {\n' +
	'gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n' + // 设置颜色
	'}\n';

var Tx = 0.5, Ty = 0.5, Tz = 0.0;

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

	// 为平移赋值
	// 注意平移的最后一个分量为0.0，因为平移相加后最后一个分量必须为1.0
	var u_Translation = gl.getUniformLocation(gl.program, 'u_Translation');
	gl.uniform4f(u_Translation, Tx, Ty, Tz, 0.0);

	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT);

	gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
}

function initVertexBuffers(gl) {
	var vertices = new Float32Array([
			-0.5, 0.5, -0.5, -0.5, 0.5, 0.5, 0.5, -0.5
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
