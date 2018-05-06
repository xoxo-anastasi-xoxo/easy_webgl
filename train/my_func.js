// Вспомогательные функции для отрисовки сцены
function createShader(gl, type, source) {
    let shader = gl.createShader(type);   // создание шейдера
    gl.shaderSource(shader, source);      // устанавливаем шейдеру его программный код
    gl.compileShader(shader);             // компилируем шейдер
    let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {                        // если компиляция прошла успешно - возвращаем шейдер
        return shader;
    }

    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
}
function createProgram(gl, vertexShader, fragmentShader) {
    let program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    let success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
        return program;
    }

    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
}
function fillAttribute(gl, program, name, data, size, type, normalize, stride, buf_offset) {
    // инициализируем
    let attributeLocation = gl.getAttribLocation(program, name);
    let buffer = gl.createBuffer();

    // привязываем
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.enableVertexAttribArray(attributeLocation);

    // отдаем данные
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    gl.vertexAttribPointer(
        attributeLocation, size, type, normalize, stride, buf_offset); // привязан к ARRAY_BUFFER, а следовательно к нашему буферу
}

function drawScene() {
    resizeScene(gl.canvas); // подгоним размер окна прорисовки под канвас
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.clearColor(0, 0, 0, 0); // очищаем canvas
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // Очищаем canvas И буфер глубины

    // Указываем какую программу использовать
    gl.useProgram(program);

    for (let figure of groups) {
        // Передаем данные
        let size = 3;          // 3 компоненты на итерацию
        let type = gl.FLOAT;   // наши данные - 32-битные числа с плавающей точкой
        let normalize = false; // не нормализовать данные
        let stride = 0;        // 0 = перемещаться на size * sizeof(type) каждую итерацию для получения следующего положения
        let buf_offset = 0;        // начинать с начала буфера
        fillAttribute(gl, program, "a_position", new Float32Array(figure.positions), size, type, normalize, stride, buf_offset);

        size = 3;          // 3 компоненты на итерацию
        type = gl.FLOAT;   // наши данные - 32-битные числа с плавающей точкой
        normalize = false; // не нормализовать данные
        stride = 0;        // 0 = перемещаться на size * sizeof(type) каждую итерацию для получения следующего положения
        buf_offset = 0;        // начинать с начала буфера
        fillAttribute(gl, program, "a_normal", new Float32Array(figure.normals), size, type, normalize, stride, buf_offset);

        size = 3;                 // 3 компоненты на итерацию
        type = gl.UNSIGNED_BYTE;  // данные - 8-битные беззнаковые целые
        normalize = true;         // нормализовать данные (конвертировать из 0-255 в 0-1)
        stride = 0;               // 0 = перемещаться на size * sizeof(type) каждую итерацию для получения следующего положения
        buf_offset = 0;               // начинать с начала буфера
        fillAttribute(gl, program, "a_color", new Uint8Array(figure.colors), size, type, normalize, stride, buf_offset);

        let matrixLocation = gl.getUniformLocation(program, "u_matrix");
        gl.uniformMatrix4fv(matrixLocation, false, figure.getMatrix());

        let nMatrixLocation = gl.getUniformLocation(program, "u_normal_matrix");
        gl.uniformMatrix4fv(nMatrixLocation, false, figure.getNormalMatrix());

        let lDirectionLocation =
            gl.getUniformLocation(program, "u_light_direction");
        gl.uniform3fv(lDirectionLocation, m4.normalize(lightDirection));

        let useLightLocation =
            gl.getUniformLocation(program, "u_use_light");
        gl.uniform1i(useLightLocation, Number(isLightUsed));

        let fColorLocation =
            gl.getUniformLocation(program, "u_fon_light_color");
        gl.uniform3fv(fColorLocation, fonLightColor);

        let dColorLocation =
            gl.getUniformLocation(program, "u_directed_light_color");
        gl.uniform3fv(dColorLocation, directedLightColor);

        // Начинаем отрисовку
        let primitiveType = gl.TRIANGLES;
        let offset = 0;
        let count = figure.positions.length / 3;
        gl.drawArrays(primitiveType, offset, count);
    }
}

function registerAll() {
    registerScene();
    registerCamera();
    registerTransform();
    registerShape();
    registerCube();
    registerAppearance();
    registerColor();
    registerDirectedLight();
}