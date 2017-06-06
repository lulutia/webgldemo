// 将位置信息从js传给顶点着色器，可以使用attribute变量和uniform变量
// attribute传输与顶点相关的数据，只有顶点着色器能使用
// uniform传输的是那些对于所有顶点都相同(或与顶点无关)的数据
// 使用方式：
// 1. 在顶点着色器中，声明attribute变量
// 2. 将attribute变量赋值给gl_Position变量
// 3. 向attribute变量传输数据

var VSHADER_SOURCE = 
	// attribute被称为 存储限定符 ，表示接下来的变量是一个attribute变量
	// attribute必须声明为 全局变量， 数据将从着色器外部传给该变量
	'attribute vec4 a_Position; \n' +
	'attribute float a_PointSize; \n' +
	'void main() {\n' +
	'gl_Position = a_Position;\n' + //设置坐标，必须
	'gl_PointSize = a_PointSize;\n' + // 设置尺寸，非必需，默认1.0
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

	// WEbGL中的每个变量都具有一个存储地址，以便通过存储地址向变量传输数据
	// gl.getAttribLocation(program, name): 获取由name参数指定的attribute变量的存储地址
	// program: 指定包含顶点着色器和片元着色器的着色器程序对象
	// name: 指定想要获取其存储地址的attribute变量的名称
	var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
	var a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize');

	if (a_Position < 0) {
		console.log('sth wrong');
		return;
	}

	// gl.vertexAttrib3f(location, v0, v1, v2): 将数据(v0, v1, v2)传给由location参数指定的attribute变量
	// location: 指定将要修改的attribute变量的存储位置
	// v0,v1,v2: 分别为填充的分量
	// 如果省略了第4个参数，这个方法会默认将第4个分量设置为1.0
	// gl.vertexAttribXf是一系列同族函数，其中X可以为1，2，3，4，无论哪一个，第四个值都为1.0，其他未填位填充0.0
	// gl.vertexAttribXv是其矢量版本，接受类型化数组
	// gl.vertexAttrib 基础函数名 x 参数个数 v参数类型 还能够有gl.vertexAttrib[123]f这种用法
	gl.vertexAttrib3f(a_Position, 0.0, 0.0, 0.0);
	gl.vertexAttrib1f(a_PointSize, 5.0);
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT);
	
	gl.drawArrays(gl.POINTS, 0, 1);
}
