// 获取<canvas>元素
// 请求该元素的“绘图上下文”
// 在上下文上调用相应的绘图函数以绘制二维图形

function main() {
	var canvas = document.getElementById('example');
	if (!canvas) {
		console.log('获取canvas元素失败');
		return;
	}

	var ctx = canvas.getContext('2d');

	ctx.fillStyle = 'rgba(0, 0, 255, 1.0)';
	ctx.fillRect(120, 10, 150, 150);
}