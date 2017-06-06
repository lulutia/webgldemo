var VSHADER_SOURCE = 
	'attribute vec4 a_Position; \n' +
	'attribute float a_PointSize; \n' +
	'void main() {\n' +
	'gl_Position = a_Position;\n' + //设置坐标，必须
	'gl_PointSize = a_PointSize;\n' + // 设置尺寸，非必需，默认1.0
	'}\n';

var FSHADER_SOURCE = 
	'void main() {\n' +
	'gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n' + // 设置颜色
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

	if (a_Position < 0) {
		console.log('sth wrong');
		return;
	}

	canvas.onmousedown = function (ev) {
		click(ev, gl, canvas, a_Position, a_PointSize);
	}
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	// 初始化还没点击时将背景置黑
	gl.clear(gl.COLOR_BUFFER_BIT);
}

// 每次点击值都记录的原因: 因为WebGL使用的是颜色缓冲区，其绘制操作是在颜色缓冲区进行绘制的，绘制结束
// 后系统将缓冲区中的内容显示在屏幕上，然后颜色缓冲区就会被重置，其中的内容就会丢失
var g_Points = [];
function click(ev, gl, canvas, a_Position, a_PointSize) {
	var x = ev.clientX;
	var y = ev.clientY;
	var rect = ev.target.getBoundingClientRect();
	// 准换坐标，将canvas的原点平移到中心点(WebGL的坐标系统的原点位于此处)
	x = ((x - rect.left) - canvas.height/2)/(canvas.height/2);
	y = (canvas.width/2 - (y - rect.top))/(canvas.width/2);
	
	g_Points.push([x,y]);

	gl.clear(gl.COLOR_BUFFER_BIT);

	for(var i = 0; i < g_Points.length; i++) {
		gl.vertexAttrib3f(a_Position, g_Points[i][0], g_Points[i][1], 0.0);
		gl.vertexAttrib1f(a_PointSize, 5.0);
		gl.drawArrays(gl.POINTS, 0, 1);
	}

}
