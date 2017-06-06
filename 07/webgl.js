// WebGL提供了 缓冲区对象，它可以一次性的向着色器传入多个顶点的数据。
// 缓冲区对象是WebGL系统中的一块内存区域，我们可以一次性向缓冲区对象中填充大量的顶点数据，然后将
// 这些数据保存其中，供顶点着色器使用

var VSHADER_SOURCE = 
	'attribute vec4 a_Position; \n' +
	'void main() {\n' +
	'gl_Position = a_Position;\n' + //设置坐标，必须
	'gl_PointSize = 5.0;\n' + // 设置尺寸，非必需，默认1.0
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

	var n = initVertexBuffers(gl);
	if (n < 0) {
		console.log('sth wrong');
	}
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT);

	// WebGL系统并不知道缓冲区有多少个顶点的数据，所以要显示告诉它
	gl.drawArrays(gl.POINTS, 0, n);
}

// 使用缓冲区对象向顶点着色器传入多个顶点数据的步骤
// 1. 创建缓冲区对象
// 2. 绑定缓冲区对象
// 3. 将数据写入缓冲区对象
// 4. 将缓冲区对象分配给一个attribute变量
// 5. 开启attribute变量
function initVertexBuffers(gl) {
	// JS中通用的数组Array是一种通用的类型，既可以在里面存储数字也可以存储字符串
	// 但是它并没有对"大量元素都是同一种类型"这种情况进行优化，
	// 所以WebGL为每种基本数据类型引入了一种特殊的数组，既类型化数组
	// 有 Int8Array UInt8Array Int16Array UInt16Array Int32Array UInt32Array Float32Array Float64Array
	// 类型化数组 不 支持push 和 pop，其创建的唯一方法是使用new元算符
	var vertices = new Float32Array([
			0.0, 0.5, -0.5, -0.5, 0.5, -0.5
		]);
	// 点的个数
	var n = 3;

	// 创建缓冲区对象gl.createBuffer()
	// 这一步的结果是WebGL系统中多了一个新创建出来的缓冲区对象
	// 相应的有 gl.deleteBuffer(buffer)来删除被其创建的缓冲区对象
	var vertexBuffer = gl.createBuffer();
	if (!vertexBuffer) {
		console.log('sth wrong');
		return -1;
	}

	// 将缓冲区对象绑定到目标，这个目标表示缓冲区对象的用途
	// 我们不能直接向缓冲区写入数据，而只能向目标写入数据，所以要向缓冲区写入数据，必须先绑定
	// gl.bindBuffer(target, buffer)允许使用buffer表示的缓冲区对象并将其绑定到target表示的目标上
	// target: gl.ARRAY_BUFFER 表示缓冲区对象中包含了顶点的数据
	// 		   gl.ELEMENT_ARRAY_BUFFER表示缓冲区对象中包含了顶点的索引值
	// buffer: 指定之前由gl.createBuffer()返回的待绑定的缓冲区对象
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
	
	// 向缓冲区对象写入数据
	// gl.bufferData(target, data, usage): 开辟存储空间，向绑定在target上的缓冲区对象写入数据data
	// target: gl.ARRAY_BUFFER gl.ELELMENT_ARRAY_BUFFER
	// data: 写入缓冲区对象的数据[类型化数组]
	// usage: 表示程序将如何使用存储在缓冲区对象中的数据，为WebGL优化程序而用
	// 		gl.STATIC_DRAW: 只会向缓冲区对象写入一次数据，但需要绘制很多次
	// 		gl.STREAM_DRAW: 只会向缓冲区对象中写入一次数据，然后绘制若干次
	// 		gl.DYNAMIC_DRAW: 会向缓冲区对象中多次写入数据，并绘制很多次
	gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

	var a_Position = gl.getAttribLocation(gl.program, 'a_Position');

	// 将缓冲区对象分配给a_Position变量
	// gl.vertexAttribPointer(location, size, type, normalized, stride, offset)
	// 将绑定到gl.ARRAY_BUFFER的缓冲区对象分配给由location指定的attribute变量
	// size: 指定缓冲区中每个顶点的分量个数(1-4)，若size比attribute变量需要的分量小，缺失分量按照之前的规则自动补全
	// type: 指定数据格式 [gl.UNSIGNED_BYTE, gl.SHORT, gl.UNSIGNED_SHORT, gl.INT, gl.UNSIGNED_INT, gl.FLOAT]
	// normalized: 传入true, false表明是否将非浮点数的数据归一化到[0, 1]或[-1, 1]区间
	// stride: 指定相邻两个顶点间的字节数，默认0
	// offset: 指定缓冲区对象中的偏移量(以字节为单位)
	gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

	// 链接a_Position变量与分配给它的缓冲区对象
	// 使顶点着色器能够访问缓冲区内的数据，注意此函数处理的对象是缓冲区
	// gl.enableVertexArray(location): 开启location指定的attribute变量
	// 同样，可以使用gl.disableVertexAttribArray()来关闭分配
	gl.enableVertexAttribArray(a_Position);

	return n;
}
