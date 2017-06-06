function main() {
	var canvas = document.getElementById('example');
	var gl = canvas.getContext('webgl');
	if (!gl) {
		console.log('sth wrong');
		return;
	}
	// 设定背景色，一旦指定了背景色后，背景色就会常驻
	// WebGL系统，在下一次再调用这个函数前不会改变
	gl.clearColor(0.0, 0.0, 0.0, 1.0);

	// 用背景色清空canvas绘图区域
	// 此方法继承自OpenGL，基于多基本缓冲区模型
	// 清空绘图区域，实际上是在清空颜色缓冲区
	// 类似的还有 gl.DEPTH_BUFFER_BIT,gl.STENCIL_BUFFER_BIT
	gl.clear(gl.COLOR_BUFFER_BIT);
}