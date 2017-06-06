// 纹路映射的作用，就是根据纹理图像，为之前光栅化后的每个片元涂上合适的颜色
// 组成纹理图像的像素又被称为纹素，每一个纹素的颜色都使用RGB或RGBA格式编码

// 纹理映射步骤
// 1. 准备好映射到几何图形上的纹理图像
// 2. 为几何图形配置纹理映射方式
// 3. 加载纹理图像，对其进行一些配置，以在WebGL中使用它
// 4. 在片元着色器中将相应的纹素从纹理中抽取出来，并将纹素的颜色赋给片元
var VSHADER_SOURCE = 
	'attribute vec4 a_Position; \n' +
	'attribute vec2 a_TexCoord; \n' +
	'varying lowp vec2 v_TexCoord;\n' +
	'void main() {\n' +
	'gl_Position = a_Position;\n' + 
	'v_TexCoord = a_TexCoord;\n' +
	'}\n';

// texture2D(sample2D, sampler, vec2, coord): 从sample指定的纹理上获取coord指定的纹理坐标处的像素颜色
var FSHADER_SOURCE = 
	'uniform sampler2D u_Sampler;\n' +
	'varying lowp vec2 v_TexCoord;\n' +
 	'void main() {\n' +
	'gl_FragColor = texture2D(u_Sampler, v_TexCoord);\n' +
	'}\n';

// 程序五个部分
// 1. 顶点着色器中接收顶点的纹理坐标，光栅化后传递给片元着色器
// 2. 片元着色器根据片元的纹理坐标，从纹理图像中抽取出纹素颜色，赋给当前片元
// 3. 设置顶点的纹理坐标
// 4. 准备待加载的纹理图像，令浏览器读取它
// 5. 监听纹理图像的加载时间，一旦加载完成，就在WebGL系统中使用纹理

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
	
	if (!initTextures(gl, n)) {
		console.log('sth wrong');
	}

}

function initVertexBuffers(gl) {
	var n = 4;
	
	var verticesTexCoordsBuffer = gl.createBuffer();
	var verticesTexCoords = new Float32Array([
		// 顶点坐标 纹理坐标
			-0.5, 0.5, 0.0, 1.0,
			-0.5, -0.5, 0.0, 0.0,
			0.5, 0.5, 1.0, 1.0,
			0.5, -0.5, 1.0, 0.0
		]);

	gl.bindBuffer(gl.ARRAY_BUFFER, verticesTexCoordsBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, verticesTexCoords, gl.STATIC_DRAW);
	var FSIZE = verticesTexCoords.BYTES_PER_ELEMENT;
	var  a_TexCoord = gl.getAttribLocation(gl.program, 'a_TexCoord');
	var  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
	gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 4, 0);
	gl.enableVertexAttribArray(a_Position);
	gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, FSIZE * 4, FSIZE * 2);
	gl.enableVertexAttribArray(a_TexCoord);
	return n;
}
function initTextures(gl, n) {
	// gl.createTexture()
	// 创建纹理对象以存储纹理图像
	// gl.deleteTexture() 可以删除一个纹理对象
	var texture = gl.createTexture();

	var u_Sampler = gl.getUniformLocation(gl.program, 'u_Sampler');
	var image = new Image();
	image.onload = function() {
		loadTexture(gl, n, texture, u_Sampler, image);
	}
	image.src = '../resources/sky.JPG';
	return true;
}

function loadTexture(gl, n, texture, u_Sampler, image) {
	// 对纹理图像进行Y轴反转
	// WebGL纹理坐标系统中t轴的方向和PNG,BMP,JPG等格式图片的坐标系统的Y轴方向是相反的
	// gl.pixelStorei(pname, param): 使用pname和param指定的方式处理加载得到的图片
	// pname: 
	// 		gl.UNPACK_FLIP_Y_WEBGL: 对图像进行Y轴反转，默认为false
	// 		gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL: 将图像RGB颜色值的每一个分量乘以A，默认为false
	// param: 指定非0(true)或0(false)，必须为整数
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

	// gl.activeTexture(texUnit): 激活texUnit指定的纹理单元
	gl.activeTexture(gl.TEXTURE0);

	// gl.bindTexture(target, texture): 开启texture指定的纹理对象，并将其绑定到target上
	// 如果已经激活了某个纹理单元，则纹理对象也会绑定到这个纹理单元上
	// target: gl.TEXTURE_2D  gl.TEXTURE_CUBE_MAP
	// 在WebGL中，没法直接操作纹理对象，必须通过将纹理对象绑定到纹理单元上，然后通过操作纹理单元来操作纹理对象
	gl.bindTexture(gl.TEXTURE_2D, texture);

	// gl.texParameteri(target, pname, param)
	// 将param的值赋给绑定到目标的纹理对象的pname参数上
	// target: gl.TEXTURE_2D  gl.TEXTURE_CUBE_MAP
	// pname: gl.TEXTURE_MAG_FILTER 放大方法 gl.LINEAR
	// 		  gl.TEXTURE_MIN_FILTER 缩小方法 gl.NEAREST_MIPMAP_LINEAR
	// 		  gl.TEXTURE_WRAP_S 水平填充方法 gl.REPEAT
	// 		  gl.TEXTURE_WRAP_T 垂直填充方法 gl.REPEAT
	// 可以赋值给gl.TEXTURE_MAG_FILTER的param:
	// 		  gl.NEAREST: 使用原纹理上距离映射后新像素中心最近的那个像素的颜色值
	// 		  gl.LINEAR: 使用距离新像素中心最近的四个像素的颜色值的加权平均，作为新像素的值
	// 可以赋值给gl.TEXTURE_MIN_FILTER的param:[https://my.oschina.net/sweetdark/blog/177812]
	//  	  gl.LINEAR, gl.NEAREST, gl.NEAREST_MIPMAP_NEAREST, gl.LINEAR_MIPMAP_NEAREST, gl.NEAREST_MIPMAP_LINEAR (default value), gl.LINEAR_MIPMAP_LINEAR.
	// 可以赋值给gl.TEXTURE_WRAP_S和gl.TEXTURE_WRAP_T的param:
	// 		  gl.REPEAT: 平铺式的重复纹理
	// 		  gl.CLAMP_TO_EDGE: 使用纹理图像边缘值
	// 		  gl.MIRRORED_REPEAT: 镜像对称式的重复纹理
	// 通常可以不用调用，使用默认值就可以了
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

	// gl.texImage2D(target, level, internalformat, format, type, image) [https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texImage2D]
	// 将image指定的图像分配给绑定到目标上的纹理对象
	// internalformat: 图像的内部格式 
	// format: 纹理数据的格式，必须与internalformat一样
	// image: 包含纹理图像的Image对象
	// 一旦将纹理图像传入了WebGL系统，就必须将其传入片元着色器并映射到图形的表面上去
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

	// 将0号纹理传递给着色器中的取样器变量
	gl.uniform1i(u_Sampler, 0);
	gl.clear(gl.COLOR_BUFFER_BIT);
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
}

