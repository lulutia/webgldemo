
var VSHADER_SOURCE = 
	'attribute vec4 a_Position; \n' +
	'attribute vec2 a_TexCoord; \n' +
	'varying lowp vec2 v_TexCoord;\n' +
	'void main() {\n' +
	'gl_Position = a_Position;\n' + 
	'v_TexCoord = a_TexCoord;\n' +
	'}\n';

var FSHADER_SOURCE = 
	'uniform sampler2D u_Sampler;\n' +
	'varying lowp vec2 v_TexCoord;\n' +
 	'void main() {\n' +
	'gl_FragColor = texture2D(u_Sampler, v_TexCoord);\n' +
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
	
	if (!initTextures(gl, n)) {
		console.log('sth wrong');
	}

}

function initVertexBuffers(gl) {
	var n = 4;
	
	var verticesTexCoordsBuffer = gl.createBuffer();
	var verticesTexCoords = new Float32Array([
		// 顶点坐标 纹理坐标
			-0.5, 0.5, -0.3, 1.7,
			-0.5, -0.5, -0.3, -0.2,
			0.5, 0.5, 1.7, 1.7,
			0.5, -0.5, 1.7, -0.2
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
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
	gl.uniform1i(u_Sampler, 0);
	gl.clear(gl.COLOR_BUFFER_BIT);
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
}

