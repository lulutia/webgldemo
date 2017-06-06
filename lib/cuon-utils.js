// cuon-utils.js (c) 2012 kanda and matsuda
/**
 * Create a program object and make current
 * @param gl GL context
 * @param vshader a vertex shader program (string)
 * @param fshader a fragment shader program (string)
 * @return true, if the program object was created and successfully made current 
 */
function initShaders(gl, vshader, fshader) {
  var program = createProgram(gl, vshader, fshader);
  if (!program) {
    console.log('Failed to create program');
    return false;
  }

  // gl.useProgram(program)
  // 告知WebGL系统绘制时使用program指定的程序对象
  gl.useProgram(program);
  gl.program = program;

  return true;
}

/**
 * Create the linked program object
 * @param gl GL context
 * @param vshader a vertex shader program (string)
 * @param fshader a fragment shader program (string)
 * @return created program object, or null if the creation has failed
 */
function createProgram(gl, vshader, fshader) {
  // Create shader object
  var vertexShader = loadShader(gl, gl.VERTEX_SHADER, vshader);
  var fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fshader);
  if (!vertexShader || !fragmentShader) {
    return null;
  }

  // gl.createProgram()
  // 创建程序对象
  // 类似的，可以使用gl.deletePRogram()函数来删除程序对象
  var program = gl.createProgram();
  if (!program) {
    return null;
  }

  // gl.attachShader(program, shader)
  // 将shader指定的着色器对象分配给program指定的程序对象
  // 着色器在附给程序对象前，并不一定要为其指定代码或进行编译(也就是说，把空的着色器附给程序对象也是可以的)
  // 类似的，可以使用gl.detachShader()函数来解除分配给程序对象的着色器
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);

  // gl.linkProgram(program)
  // 连接program指定的程序对象中的着色器
  // 进行这一步的目的是：
  // 1. 顶点着色器和片元着色器的varying变量同名同类型，且一一对应
  // 2. 顶点着色器对每个varying变量赋了值
  // 3. 顶点着色器和片元着色器中的同名uniform变量也是同类型的（这个不太懂），但不需要一一对应，即都有
  // 4. 着色器中的attribute变量，uniform变量和varying变量的个数没有超过着色器的上限
  gl.linkProgram(program);

  // gl.getProgramParameter(program, pname)
  // 获取pname指定的程序对象中pname指定的参数信息。返回值随着pname的不同而不同
  // pname：gl.DELETE_STATUS gl.LINK_STATUS gl.VALIDATE_STATUS gl.ATTACHED_SHADERS
  //        gl.ACTIVE_ATTRIBUTES gl.ACTIVE_UNIFORMS
  // 根据pname的不同，返回值不同
  // 程序对象即使连接成功了，也有可能运行失败，比如没有为取样器分配纹理单元。这些错误
  // 是在运行阶段而不是连接阶段产生的
  var linked = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (!linked) {
    // gl.getProgramInfoLog(program)
    // 获取program指定的程序对象的信息日志
    var error = gl.getProgramInfoLog(program);
    console.log('Failed to link program: ' + error);
    gl.deleteProgram(program);
    gl.deleteShader(fragmentShader);
    gl.deleteShader(vertexShader);
    return null;
  }
  return program;
}

/**
 * Create a shader object
 * @param gl GL context
 * @param type the type of the shader object to be created
 * @param source shader program (string)
 * @return created shader object, or null if the creation has failed.
 */
function loadShader(gl, type, source) {
  // gl.createShader(type) 创建由type指定的着色器对象
  // gl.VERTEX_SHADER表示顶点着色器 gl.FRAGMENT_SHADER表示片元着色器
  // 如果不需要这个着色器，可以用gl.deleteShader()函数来删除着色器
  // 注意，如果着色器对象还在使用，那么deleteShader()并不会立刻删除着色器
  // 而是要等到程序对象不再使用该着色器后，才将其删除
  var shader = gl.createShader(type);
  if (shader == null) {
    console.log('unable to create shader');
    return null;
  }

  // gl.shaderSource(shader, source)
  // 将source指定的字符串形式的代码传入shader指定着色器，如果之前已经向shader传入过
  // 代码了，旧的代码将会被替换掉
  gl.shaderSource(shader, source);

  // gl.compileShader(shader)
  // 编译shader指定的着色器中的源代码
  gl.compileShader(shader);

  // gl.getShaderParameter(shader, pnama)
  // 获取shader指定的着色器中，pname指定的参数信息
  // pname: 指定待获取参数的类型，可以是gl.SHADER_TYPE gl.DELETE_STATUS或者gl.COMPILE_STATUS
  // 根据pname的不同，返回不同的值
  var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (!compiled) {
    // gl.getShaderInfoLog(shader)
    // 获取shader指定的着色器的信息日志
    // 日志信息的具体格式依赖于浏览器对WebGL的实现
    var error = gl.getShaderInfoLog(shader);
    console.log('Failed to compile shader: ' + error);
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

/** 
 * Initialize and get the rendering for WebGL
 * @param canvas <cavnas> element
 * @param opt_debug flag to initialize the context for debugging
 * @return the rendering context for WebGL
 */
function getWebGLContext(canvas, opt_debug) {
  // Get the rendering context for WebGL
  var gl = WebGLUtils.setupWebGL(canvas);
  if (!gl) return null;

  // if opt_debug is explicitly false, create the context for debugging
  if (arguments.length < 2 || opt_debug) {
    gl = WebGLDebugUtils.makeDebugContext(gl);
  }

  return gl;
}
