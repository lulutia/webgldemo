// 在片元着色器中准备uniform变量
// 用这个uniform变量向gl_FragColor赋值
// 将颜色数据从JS传给uniform变量

var VSHADER_SOURCE = 
	'attribute vec4 a_Position; \n' +
	'attribute float a_PointSize; \n' +
	'void main() {\n' +
	'gl_Position = a_Position;\n' + //设置坐标，必须
	'gl_PointSize = a_PointSize;\n' + // 设置尺寸，非必需，默认1.0
	'}\n';

var FSHADER_SOURCE = 
	'precision mediump float; \n' +
	'uniform vec4 u_FragColor; \n' + // uniform变量
	'void main() {\n' +
	'	gl_FragColor = u_FragColor;\n' + // 设置颜色
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

	var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
	var a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize');

	var u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');

	if (a_Position < 0) {
		console.log('sth wrong');
		return;
	}

	canvas.onmousedown = function (ev) {
		click(ev, gl, canvas, a_Position, a_PointSize, u_FragColor);
	}
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT);
}

var g_colors = [];
var g_Points = [];
function click(ev, gl, canvas, a_Position, a_PointSize, u_FragColor) {
	var x = ev.clientX;
	var y = ev.clientY;
	var rect = ev.target.getBoundingClientRect();
	// 准换坐标，将canvas的原点平移到中心点(WebGL的坐标系统的原点位于此处)
	x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
	y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);
	
	g_Points.push([x,y]);

	if (x >= 0.0 && y >= 0.0) {
		g_colors.push([1.0, 0.0, 0.0, 1.0]);
	} else if (x < 0.0 && y < 0.0) {
		g_colors.push([0.0, 1.0, 0.0, 1.0]);
	} else {
		g_colors.push([1.0, 1.0, 1.0, 1.0]);
	}

	gl.clear(gl.COLOR_BUFFER_BIT);

	for(var i = 0; i < g_Points.length; i++) {
		gl.vertexAttrib3f(a_Position, g_Points[i][0], g_Points[i][1], 0.0);
		gl.vertexAttrib1f(a_PointSize, 5.0);
		gl.uniform4f(u_FragColor, g_colors[i][0], g_colors[i][1], g_colors[i][2], g_colors[i][3]);
		gl.drawArrays(gl.POINTS, 0, 1);
	}

}
