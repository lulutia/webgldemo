// 整个处理过程: 顶点坐标-》图形装配过程-》光栅化过程-》执行片元着色器过程
// 光栅化过程中生成的片元都是带有坐标信息的，调用片元着色器时这些坐标信息也随着片元传了进来
// 可以通过片元着色器中的内置变量来访问片元的坐标


// 注意varying变量只能是float,vec2,vec3,vec4,mat2,mat3,mat4类型
// 注意lowp的使用
var VSHADER_SOURCE = 
	'attribute vec4 a_Position; \n' +
	'attribute vec4 a_Color; \n' +
	'varying lowp vec4 v_Color;\n' +
	'void main() {\n' +
	'gl_Position = a_Position;\n' + 
	'gl_PointSize = 10.0;\n' +
	'v_Color = a_Color;\n' +
	'}\n';

// 在WebGL中，如果顶点着色器与片元着色器中有类型和命名都相同的varying变量，那么顶点着色器
// 赋给该变量的值就会自动被传入片元着色器
// 但是，片元着色器中的v_Color变量和顶点着色器中的v_Color实际并不是一回事，
// 顶点着色器中的v_Color变量在传入片元着色器之前经过了内插过程，所以称为varying
var FSHADER_SOURCE = 
	'varying lowp vec4 v_Color;\n' +
 	'void main() {\n' +
	'gl_FragColor = v_Color;\n' + // 从顶点着色器接收数据
	'}\n';


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

	gl.drawArrays(gl.TRIANGLES, 0, n);
}

function initVertexBuffers(gl) {
	var n = 3;
	
	var verticesColorBuffer = gl.createBuffer();
	var verticesColors = new Float32Array([
			0.0, 0.5, 1.0, 0.0, 0.0,
			-0.5, -0.5, 0.0, 1.0, 0.0,
			0.5, -0.5, 0.0, 0.0, 1.0
		]);

	gl.bindBuffer(gl.ARRAY_BUFFER, verticesColorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);
	var FSIZE = verticesColors.BYTES_PER_ELEMENT;
	var  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
	var a_Color = gl.getAttribLocation(gl.program, 'a_Color');
	gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 5, 0);
	gl.enableVertexAttribArray(a_Position);
	gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 5, FSIZE * 2);
	gl.enableVertexAttribArray(a_Color);
	return n;
}

