// 在代码中，着色器程序是以字符串的形式嵌入在js文件中的，在程序开始运行前就已经设置好了
// 执行顺序： 浏览器-》执行加载的js程序-》执行WebGL的相关方法-》渲染到颜色缓冲区-》显示
// 颜色缓冲区的内容会自动显示在浏览器中

// vec4 表示由四个float组成的矢量
// 齐次坐标: (x, y, z, w) 等价于三维坐标 (x/w, y/w, z/w)，w必需大于等于0
// 齐次坐标的存在，使得用矩阵乘法来描述顶点变换称为可能，三维图形系统在计算过程中，
// 通常使用齐次坐标来表示顶点的三维坐标，这样能够提高处理三维数据的效率
 
// 顶点着色器程序
// 用来描述顶点的特性(位置，颜色)
// 两个变量从顶点着色器中被传入了片元着色器
var VSHADER_SOURCE = 
	'void main() {\n' +
	'gl_Position = vec4(0.0, 0.0, 0.0, 1.0);\n' + //设置坐标，必须
	'gl_PointSize = 10.0;\n' + // 设置尺寸，非必需，默认1.0
	'}\n';

// 片元着色器程序: 进行逐片元处理过程
// 片元可大概理解为像素(图像的单元)
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

	// 将字符串的着色器代码从js传给WebGL系统，并建立着色器，注意着色器是运行在WebGL系统中的
	if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
		console.log('sth wrong');
		return;
	}

	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT);

	// gl.drawArrays(mode, first, count)
	// 按照mode参数指定的方式绘制图形(gl.POINTS, gl.LINES, gl.LINE_STRIP, gl.LINE_LOOP
	// gl.TRIANGLES, gl.TRIANGLE_STRIP, gl.TRIANGLE_FAN)
	// first: 指定从哪个顶点开始绘制 整型
	// count: 指定绘制多少个点 整型
	gl.drawArrays(gl.POINTS, 0, 1);
}
