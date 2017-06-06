// 动画: 不断擦除和重绘三角形，并且在每次重绘时轻微改变角度
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

	var xformMatrix = new Matrix4();

	var u_xformMatrix = gl.getUniformLocation(gl.program, 'u_xformMatrix');

	var currentAngle = 0.0;

	var tick = function() {
		currentAngle = animate(currentAngle);
		draw(gl, n, currentAngle, xformMatrix, u_xformMatrix);
		// 请求浏览器在将来某时刻回调函数func以完成重绘。与setInterval()的区别是只有当标签页处于激活状态时才会生效
		// 想取消请求，使用cancelAnimationFrame()
		requestAnimationFrame(tick);
	}

	tick();
}

function initVertexBuffers(gl) {
	var vertices = new Float32Array([
			0.0, 0.5, -0.5, -0.5, 0.5, -0.5
		]);
	var n = 3;

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
function draw(gl, n, currentAngle, xformMatrix, u_xformMatrix) {
	xformMatrix.setRotate(currentAngle, 0, 0, 1);
	xformMatrix.translate(0.35, 0.0, 0.0);

	// xformMatrix.setTranslate(0.35, 0.0, 0.0);
	// xformMatrix.rotate(currentAngle, 0, 0, 1);
	
	gl.uniformMatrix4fv(u_xformMatrix, false, xformMatrix.elements);
	gl.clear(gl.COLOR_BUFFER_BIT);
	gl.drawArrays(gl.TRIANGLE_FAN, 0, n);
}

var g_last = Date.now();
function animate(angle) {
	var now = Date.now();
	var elapse = now - g_last;
	g_last = now;
	var newAngle = angle + (ANGLE_STEP * elapse) / 1000.0;
	return newAngle%360;
}
