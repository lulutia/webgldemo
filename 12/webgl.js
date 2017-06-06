// mat4类型是4*4的矩阵
var VSHADER_SOURCE = 
	'attribute vec4 a_Position; \n' +
	'uniform mat4 u_xformMatrix; \n' +
	'void main() {\n' +
	'gl_Position = u_xformMatrix * a_Position;\n' + //设置坐标，必须
	'}\n';

var FSHADER_SOURCE = 
	'void main() {\n' +
	'gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n' + // 设置颜色
	'}\n';

var Tx = 0.5, Ty = 0.5, Tz = 0.0;
var ANGLE = 90.0;
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

	// JS没有表示矩阵的类型，所以需要使用类型化数组
	// 旋转
	// var xformMatrix = new Float32Array([
	// 	cosB, sinB, 0.0, 0.0,
	// 	-sinB, cosB, 0.0, 0.0,
	// 	0.0, 0.0, 1.0, 0.0,
	// 	0.0, 0.0, 0.0, 1.0
	// ]);

	//平移
	// var xformMatrix = new Float32Array([
	// 	1.0, 0.0, 0.0, 0.0,
	// 	0.0, 1.0, 0.0, 0.0,
	// 	0.0, 0.0, 1.0, 0.0,
	// 	0.5, 0.5, 0.5, 1.0
	// ]);
	
	// 缩放
	var xformMatrix = new Float32Array([
		0.5, 0.0, 0.0, 0.0,
		0.0, 0.5, 0.0, 0.0,
		0.0, 0.0, 0.5, 0.0,
		0.0, 0.0, 0.0, 1.0
	]);

	var u_xformMatrix = gl.getUniformLocation(gl.program, 'u_xformMatrix');

	// gl.uniformMatrix4fv(location, transpose, array)
	// 将array表示的4*4矩阵分配给由location指定的uniform变量
	// transpose在WebGL中必须指定为false
	gl.uniformMatrix4fv(u_xformMatrix, false, xformMatrix);
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT);

	gl.drawArrays(gl.TRIANGLE_FAN, 0, n);
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
