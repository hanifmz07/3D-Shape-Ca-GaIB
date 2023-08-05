// Source code for vertex shader
var vertexShaderText = 
[
'precision mediump float;',
'',
'attribute vec3 vertPosition;',
'attribute vec3 vertColor;',
'varying vec3 fragColor;',
'uniform mat4 mWorld;',
'uniform mat4 mView;',
'uniform mat4 mProj;',
'',
'void main()',
'{',
'   fragColor = vertColor;',
'   gl_Position = mProj * mView * mWorld * vec4(vertPosition, 1.0);',
'}'
].join('\n');

// Source code for fragment shader
var fragmentShaderText =
[
'precision mediump float;',
'',
'varying vec3 fragColor;',
'void main()',
'{',
'   gl_FragColor = vec4(fragColor, 1.0);',
'}'
].join('\n');

// 3D cube
var cubeDisplay = function() {
    var canvas = document.getElementById('cube');
    var gl = canvas.getContext('webgl');

    if (!gl) {
        console.log("WebGL not supported, falling back on experimental-webgl");
        gl = canvas.getContext('experimental-webgl');
        if (!gl) {
            alert('Your browser does not support WebGL');
        }
    }

    // R G B A
    gl.clearColor(0.75, 0.85, 0.8, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.frontFace(gl.CCW);
    gl.cullFace(gl.BACK);

    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

    gl.shaderSource(vertexShader, vertexShaderText);
    gl.shaderSource(fragmentShader, fragmentShaderText);

    gl.compileShader(vertexShader);
    
    // Checking compilation error
    compStatus = gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)
    if (!compStatus) {
        console.error("Error compiling vertex shader!", gl.getShaderInfoLog(vertexShader));
        return;
    }
    
    gl.compileShader(fragmentShader);
    // Checking compilation error
    compStatus = gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)
    if (!compStatus) {
        console.error("Error compiling fragment shader!", gl.getShaderInfoLog(vertexShader));
        return;
    }

    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    linkStatus = gl.getProgramParameter(program, gl.LINK_STATUS)
    if (!linkStatus) {
        console.error('Error linking program!', gl.getProgramInfoLog(program));
        return;
    }

    gl.validateProgram(program);
    validateStatus = gl.getProgramParameter(program, gl.VALIDATE_STATUS)
    if (!validateStatus) {
        console.error('Error validating program!', gl.getProgramInfoLog(program));
        return;
    }
    console.log("Working as usual :D");

    // 3D shape vertices
    var boxVertices = 
	[ // X, Y, Z                R, G, B
		// Top
		-0.5, 0.5, -0.5,        0.0, 0.0, 0.0,
		-0.5, 0.5, 0.5,         0.0, 0.0, 0.0,
		0.5, 0.5, 0.5,          0.0, 0.0, 0.0,
		0.5, 0.5, -0.5,         0.0, 0.0, 0.0,

		// Left
		-0.5, 0.5, 0.5,         0.75, 0.25, 0.5,
		-0.5, -0.5, 0.5,        0.75, 0.25, 0.5,
		-0.5, -0.5, -0.5,       0.75, 0.25, 0.5,
		-0.5, 0.5, -0.5,        0.75, 0.25, 0.5,

		// Right
		0.5, 0.5, 0.5,          0.25, 0.25, 0.75,
		0.5, -0.5, 0.5,         0.25, 0.25, 0.75,
		0.5, -0.5, -0.5,        0.25, 0.25, 0.75,
		0.5, 0.5, -0.5,         0.25, 0.25, 0.75,

		// Front
		0.5, 0.5, 0.5,          1.0, 0.35, 0.15,
		0.5, -0.5, 0.5,         1.0, 0.35, 0.15,
		-0.5, -0.5, 0.5,        1.0, 0.35, 0.15,
		-0.5, 0.5, 0.5,         1.0, 0.35, 0.15,

		// Back
		0.5, 0.5, -0.5,         0.65, 1.0, 0.15,
		0.5, -0.5, -0.5,        0.65, 1.0, 0.15,
		-0.5, -0.5, -0.5,       0.65, 1.0, 0.15,
		-0.5, 0.5, -0.5,        0.65, 1.0, 0.15,

		// Bottom
		-0.5, -0.5, -0.5,       0.5, 0.5, 1.0,
		-0.5, -0.5, 0.5,        0.5, 0.5, 1.0,
		0.5, -0.5, 0.5,         0.5, 0.5, 1.0,
		0.5, -0.5, -0.5,        0.5, 0.5, 1.0,
	];

	var boxIndices =
	[
		// Top
		0, 1, 2,
		0, 2, 3,

		// Left
		5, 4, 6,
		6, 4, 7,

		// Right
		8, 9, 10,
		8, 10, 11,

		// Front
		13, 12, 14,
		15, 14, 12,

		// Back
		16, 17, 18,
		16, 18, 19,

		// Bottom
		21, 20, 22,
		22, 20, 23
	];

    var boxVertexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, boxVertexBufferObject);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(boxVertices), gl.STATIC_DRAW);
    
    var boxIndexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, boxIndexBufferObject);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(boxIndices), gl.STATIC_DRAW);
    
    var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
    var colorAttribLocation = gl.getAttribLocation(program, 'vertColor');
    
    gl.vertexAttribPointer(
        positionAttribLocation, // Attribute Location
        3, // Number of elements per attribute
        gl.FLOAT, // Type of elements
        gl.FALSE,
        6 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
        0 // Offset from the beginning of a single vertex to this attribute
    );
    
    gl.vertexAttribPointer(
        colorAttribLocation, // Attribute Location
        3, // Number of elements per attribute
        gl.FLOAT, // Type of elements
        gl.FALSE,
        6 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
        3 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
    );

    gl.enableVertexAttribArray(positionAttribLocation);
    gl.enableVertexAttribArray(colorAttribLocation);

    gl.useProgram(program);

    // 3D to NDC
    var matWorldUniformLocation = gl.getUniformLocation(program, 'mWorld');
    var matViewUniformLocation = gl.getUniformLocation(program, 'mView');
    var matProjUniformLocation = gl.getUniformLocation(program, 'mProj');
    
    var worldMatrix = new Float32Array(16);
    var viewMatrix = new Float32Array(16);
    var projMatrix = new Float32Array(16);
    identityMat4(worldMatrix);
    lookAtPosition(viewMatrix, [0, 0, -3], [0,0,0], [0,1,0]);
    perspectiveProjection(projMatrix, glMatrix.glMatrix.toRadian(45), canvas.width / canvas.clientHeight, 0.1, 1000.0);

    gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
    gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);
    gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix);
    
    // Main render loop
    var loop = function () {
        rotateMatrix(worldMatrix, 0.008, 'x');
        rotateMatrix(worldMatrix, 0.012, 'y');
        rotateMatrix(worldMatrix, 0.016, 'z');
        gl.uniformMatrix4fv(matWorldUniformLocation, gl.False, worldMatrix);

        gl.clearColor(0.75, 0.85, 0.8, 1.0);
        gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
        gl.drawElements(gl.TRIANGLES, boxIndices.length, gl.UNSIGNED_SHORT, 0);
        requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
};

// 3D pyramid
var pyramidDisplay = function() {
    var canvas = document.getElementById('pyramid');
    var gl = canvas.getContext('webgl');

    if (!gl) {
        console.log("WebGL not supported, falling back on experimental-webgl");
        gl = canvas.getContext('experimental-webgl');
        if (!gl) {
            alert('Your browser does not support WebGL');
        }
    }

    // R G B A
    gl.clearColor(0.75, 0.85, 0.8, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);

    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

    gl.shaderSource(vertexShader, vertexShaderText);
    gl.shaderSource(fragmentShader, fragmentShaderText);

    gl.compileShader(vertexShader);
    // Checking compilation error
    compStatus = gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)
    if (!compStatus) {
        console.error("Error compiling vertex shader!", gl.getShaderInfoLog(vertexShader));
        return;
    }
    
    gl.compileShader(fragmentShader);
    compStatus = gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)
    if (!compStatus) {
        console.error("Error compiling fragment shader!", gl.getShaderInfoLog(vertexShader));
        return;
    }

    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    linkStatus = gl.getProgramParameter(program, gl.LINK_STATUS)
    if (!linkStatus) {
        console.error('Error linking program!', gl.getProgramInfoLog(program));
        return;
    }

    gl.validateProgram(program);
    validateStatus = gl.getProgramParameter(program, gl.VALIDATE_STATUS)
    if (!validateStatus) {
        console.error('Error validating program!', gl.getProgramInfoLog(program));
        return;
    }
    console.log("Working as usual :D");

    // 3D shape vertices
    var pyramidVertices = 
	[ // X, Y, Z,           R, G, B
    // Bottom
    0.5, -0.5, 0.5,         0.2, 0.0, 0.0,
    -0.5, -0.5, 0.5,        0.2, 0.0, 0.0,
    0.5, -0.5, -0.5,        0.2, 0.0, 0.0,
    -0.5, -0.5, -0.5,       0.2, 0.0, 0.0,
    
    // Right
    0.0, 0.3, 0.0,          0.0, 0.4, 0.0,
    0.5, -0.5, 0.5,         0.0, 0.4, 0.0,
    0.5, -0.5, -0.5,        0.0, 0.4, 0.0,
    
    // Front
    0.0, 0.3, 0.0,          0.6, 0.0, 0.6,
    0.5, -0.5, 0.5,         0.6, 0.0, 0.6,
    -0.5, -0.5, 0.5,        0.6, 0.0, 0.6,
    
    // Left
    0.0, 0.3, 0.0,          0.8, 0.8, 0.0,
    -0.5, -0.5, 0.5,        0.8, 0.8, 0.0,
    -0.5, -0.5, -0.5,       0.8, 0.8, 0.0,
    
    // Back
    0.0, 0.3, 0.0,          0.0, 0.0, 1.0,
    0.5, -0.5, -0.5,        0.0, 0.0, 1.0,
    -0.5, -0.5, -0.5,       0.0, 0.0, 1.0,
    
    ];

    var pyramidIndices =
    [
        // Bottom
        0, 1, 2,
        1, 2, 3,

        // Right
        4, 5, 6,

        // Front
        7, 8, 9,
        
        // Left
        10, 11, 12,
        
        // Back
        13, 14, 15
    ];

    var pyramidVertexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, pyramidVertexBufferObject);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pyramidVertices), gl.STATIC_DRAW);
    
    var pyramidIndexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, pyramidIndexBufferObject);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(pyramidIndices), gl.STATIC_DRAW);
    
    var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
    var colorAttribLocation = gl.getAttribLocation(program, 'vertColor');
    
    gl.vertexAttribPointer(
        positionAttribLocation, // Attribute Location
        3, // Number of elements per attribut
        gl.FLOAT, // Type of elements
        gl.FALSE,
        6 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
        0 // Offset from the beginning of a single vertex to this attribute
    );
    
    gl.vertexAttribPointer(
        colorAttribLocation, // Attribute Location
        3, // Number of elements per attribut
        gl.FLOAT, // Type of elements
        gl.FALSE,
        6 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
        3 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
    );

    gl.enableVertexAttribArray(positionAttribLocation);
    gl.enableVertexAttribArray(colorAttribLocation);

    gl.useProgram(program);
    
    // 3D to NDC
    var matWorldUniformLocation = gl.getUniformLocation(program, 'mWorld');
    var matViewUniformLocation = gl.getUniformLocation(program, 'mView');
    var matProjUniformLocation = gl.getUniformLocation(program, 'mProj');
    
    var worldMatrix = new Float32Array(16);
    var viewMatrix = new Float32Array(16);
    var projMatrix = new Float32Array(16);
    identityMat4(worldMatrix);
    lookAtPosition(viewMatrix, [0, 0, -3], [0,0,0], [0,1,0]);
    perspectiveProjection(projMatrix, glMatrix.glMatrix.toRadian(45), canvas.width / canvas.clientHeight, 0.1, 1000.0);

    gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
    gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);
    gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix);
    
    // Main render loop
    var loop = function () {
        rotateMatrix(worldMatrix, 0.016, 'x');
        rotateMatrix(worldMatrix, 0.012, 'y');
        rotateMatrix(worldMatrix, 0.008, 'z');
        gl.uniformMatrix4fv(matWorldUniformLocation, gl.False, worldMatrix);

        gl.clearColor(0.75, 0.85, 0.8, 1.0);
        gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
        gl.drawElements(gl.TRIANGLES, pyramidIndices.length, gl.UNSIGNED_SHORT, 0);
        requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
};

// Matrix operations
function identityMat4(out) {

    out[0] = 1; out[1] = 0; out[2] = 0; out[3] = 0;
    out[4] = 0; out[5] = 1; out[6] = 0; out[7] = 0;
    out[8] = 0; out[9] = 0; out[10] = 1; out[11] = 0;
    out[12] = 0; out[13] = 0; out[14] = 0; out[15] = 1;

    return out;
}

function subtractVec3(v1, v2) {
    return new Float32Array([v1[0] - v2[0], v1[1] - v2[1], v1[2] - v2[2]]);
}

function normalizeVec3(v) {
    const length = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
    if (length !== 0) {
        return new Float32Array([v[0] / length, v[1] / length, v[2] / length]);
    } else {
        return new Float32Array([0,0,0])
    }
}

function crossVec3(a, b) {
    const result = new Float32Array(3);
    result[0] = a[1] * b[2] - a[2] * b[1];
    result[1] = a[2] * b[0] - a[0] * b[2];
    result[2] = a[0] * b[1] - a[1] * b[0];
    return result;
}

function multiplyMat4(a, b) {
    const result = new Float32Array(16);
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            for (let i = 0; i < 4; i++) {
                result[row * 4 + col] += a[row * 4 + i] * b[i * 4 + col];
            }
        }
    }
    return result;
}

// Look at from a certain 3D pos to a target 3D pos
// out: output matrix
// lookPos: 3D pos of looking position
// target: 3D pos of target position
// up: vector that points upward from the looking direction and target
function lookAtPosition(out, lookPos, target, up) {
    const lookDirection = normalizeVec3(subtractVec3(lookPos, target));

    // Assume up is y+ if not defined
    if (!up) {
        up = new Float32Array([0, 1, 0]);
    }

    // right from the look direction
    const right = normalizeVec3(crossVec3(up, lookDirection));

    // Recalculate up vector (checking)
    up = normalizeVec3(crossVec3(lookDirection, right));

    // Look At transformation matrix
    const lookAtMat = new Float32Array([
        right[0], up[0], lookDirection[0], 0,
        right[1], up[1], lookDirection[1], 0,
        right[2], up[2], lookDirection[2], 0,
        0, 0, 0, 1
      ]);
    
    // Translation matrix
    const translationMat = new Float32Array([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        -lookPos[0], -lookPos[1], -lookPos[2], 1
    ]);

    // Apply the transformation
    result = multiplyMat4(translationMat, lookAtMat)
    
    out[0] = result[0];
    out[1] = result[1];
    out[2] = result[2];
    out[3] = result[3];
    out[4] = result[4];
    out[5] = result[5];
    out[6] = result[6];
    out[7] = result[7];
    out[8] = result[8];
    out[9] = result[9];
    out[10] = result[10];
    out[11] = result[11];
    out[12] = result[12];
    out[13] = result[13];
    out[14] = result[14];
    out[15] = result[15];
    
    return out;
}

// Generate perspective projection matrix for transforming 3D world into a Normalized Device Coordinates (NDC)
// out: output matrix
// fov: Vertical field of view (in rad)
// aspect: Aspect ratio of the canvas
// near: Distance to near clipping planes
// far: Distance to far clipping planes
function perspectiveProjection(out, fov, aspect, near, far) {
    const f = 1.0 / Math.tan(fov / 2);
    const rangeInv = 1.0 / (near - far);
  
    result = new Float32Array([
      f / aspect, 0, 0, 0,
      0, f, 0, 0,
      0, 0, (near + far) * rangeInv, -1,
      0, 0, near * far * rangeInv * 2, 0,
    ]);
    
    out[0] = result[0];
    out[1] = result[1];
    out[2] = result[2];
    out[3] = result[3];
    out[4] = result[4];
    out[5] = result[5];
    out[6] = result[6];
    out[7] = result[7];
    out[8] = result[8];
    out[9] = result[9];
    out[10] = result[10];
    out[11] = result[11];
    out[12] = result[12];
    out[13] = result[13];
    out[14] = result[14];
    out[15] = result[15];
    
    return out;
}

// Rotate a matrix
// angle: Angle of the rotation (in rad)
// axis: Axis of the rotation
function rotateMatrix(out, angle, axis) {
    const cosAngle = Math.cos(angle);
    const sinAngle = Math.sin(angle);

    var rotMat;
    if (axis === 'x') {
        rotMat = new Float32Array([
            1, 0, 0, 0,
            0, cosAngle, sinAngle, 0,
            0, -sinAngle, cosAngle, 0,
            0, 0, 0, 1
        ]);        
    } else if (axis === 'z') {
        rotMat = new Float32Array([
          cosAngle, 0, -sinAngle, 0,
          0, 1, 0, 0,
          sinAngle, 0, cosAngle, 0,
          0, 0, 0, 1
        ]);
    } else {
        rotMat = new Float32Array([
          cosAngle, sinAngle, 0, 0,
          -sinAngle, cosAngle, 0, 0,
          0, 0, 1, 0,
          0, 0, 0, 1
        ]);
    }

    result = multiplyMat4(rotMat, out);

    out[0] = result[0];
    out[1] = result[1];
    out[2] = result[2];
    out[3] = result[3];
    out[4] = result[4];
    out[5] = result[5];
    out[6] = result[6];
    out[7] = result[7];
    out[8] = result[8];
    out[9] = result[9];
    out[10] = result[10];
    out[11] = result[11];
    out[12] = result[12];
    out[13] = result[13];
    out[14] = result[14];
    out[15] = result[15];
    
    return out;
}
