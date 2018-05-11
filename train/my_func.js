/**
 * Создание и компиляция шейдера.
 *
 * @param gl Текущий графический контекст.
 * @param type Тип шейдера.
 * @param source {String} Код шейдера.
 * @returns {WebGLShader} Шейдер.
 */
function createShader(gl, type, source) {
    // Создание шейдера
    let shader = gl.createShader(type);

    // Устанавливаем шейдеру его программный код
    gl.shaderSource(shader, source);

    // Компилируем шейдер
    gl.compileShader(shader);

    // В случае успешной компиляции возвращаем шейдер
    let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
        return shader;
    }

    // В случае ошибки - сообщаем о ней
    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
}

/**
 * Собираем программу для видеокарты из двух шейдеров.
 *
 * @param gl Текущий графический контекст.
 * @param vertexShader {WebGLShader} Вершинный шейдер.
 * @param fragmentShader {WebGLShader} Фрагментный шейдер.
 * @returns {WebGLProgram} Программа для видеокарты.
 */
function createProgram(gl, vertexShader, fragmentShader) {
    // Создаем программую
    let program = gl.createProgram();

    // Закрепляем за ней шейдеры.
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);

    // Указываем, что именно это программу надо выполнять в текущем графическом контексте.
    gl.linkProgram(program);

    // В случае успеха линковки - вернуть программу.
    let success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
        return program;
    }

    // В случае ошибки - вывести информацию о ней.
    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
}

/**
 * Заполняет атрибут и буфер даннми.
 *
 * @param gl Текущий графический контекст.
 * @param program {WebGLProgram} Текущая программа для видеокарты.
 * @param name {String} Наименование атрибута в шейдере.
 * @param data Массив данных для передачи, приведенный к нужному типу.
 * @param size {Number} Количество компонент массива на итерацию.
 * @param type Тип массива данных.
 * @param normalize {Boolean} Нуждаются ли данные в нормализации.
 * @param stride {Number} Дополнительное перемещение по данным относительно итерации.
 * @param buf_offset {Number} Элемент массива, с которого начнется первая итерация.
 */
function fillAttribute(gl, program, name, data, size, type, normalize, stride, buf_offset) {
    // Инициализируем атрибут и буфер.
    let attributeLocation = gl.getAttribLocation(program, name);
    let buffer = gl.createBuffer();

    // Привязываем атрибут и буфер.
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.enableVertexAttribArray(attributeLocation);

    // Передаем данные в атрибут и в буфер.
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    gl.vertexAttribPointer(
        attributeLocation, size, type, normalize, stride, buf_offset);
}

/**
 * Отрисовывает сцену.
 */
function drawScene() {
    // Подгоняем размер окна прорисовки под канвас.
    resizeScene(world.gl.canvas);
    world.gl.viewport(0, 0, world.gl.canvas.width, world.gl.canvas.height);

    // Очищаем canvas.
    world.gl.clearColor(1, 193/255, 193/255, 0.95);
    // Очищаем буферы цветов и глубины.
    world.gl.clear(world.gl.COLOR_BUFFER_BIT | world.gl.DEPTH_BUFFER_BIT);

    // Указываем, какую программу использовать.
    world.gl.useProgram(world.program);

    // Запускаем прорисовку каждой фигуры сцены по порядку.
    for (let figure of world.groups) {
        // Передаем данные а атрибуты и буферы.
        // Передаем позиции вершин фигуры.
        let size = 3;              // 3 компоненты на итерацию
        let type = world.gl.FLOAT; // наши данные - 32-битные числа с плавающей точкой
        let normalize = false;     // не нормализовать данные
        let stride = 0;            // 0 = перемещаться на size * sizeof(type) каждую итерацию для получения следующего положения
        let buf_offset = 0;        // начинать с начала буфера
        fillAttribute(world.gl, world.program, "a_position", new Float32Array(figure.positions),
            size, type, normalize, stride, buf_offset);

        // Передаем координаты нормалей фигуры.
        size = 3;                // 3 компоненты на итерацию
        type = world.gl.FLOAT;   // наши данные - 32-битные числа с плавающей точкой
        normalize = false;       // не нормализовать данные
        stride = 0;              // 0 = перемещаться на size * sizeof(type) каждую итерацию для получения следующего положения
        buf_offset = 0;          // начинать с начала буфера
        fillAttribute(world.gl, world.program, "a_normal", new Float32Array(figure.normals),
            size, type, normalize, stride, buf_offset);

        // Передаем цвета вершин фигуры.
        size = 3;                       // 3 компоненты на итерацию
        type = world.gl.UNSIGNED_BYTE;  // данные - 8-битные беззнаковые целые
        normalize = true;               // нормализовать данные (конвертировать из 0-255 в 0-1)
        stride = 0;                     // 0 = перемещаться на size * sizeof(type) каждую итерацию для получения следующего положения
        buf_offset = 0;                 // начинать с начала буфера
        fillAttribute(world.gl, world.program, "a_color", new Uint8Array(figure.colors),
            size, type, normalize, stride, buf_offset);

        // Передаем данные в Uniform-переменные.
        // Передача матрицы смещения.
        let matrixLocation = world.gl.getUniformLocation(world.program, "u_matrix");
        world.gl.uniformMatrix4fv(matrixLocation, false, figure.getMatrix());

        // Передача матрицы нормалей.
        let nMatrixLocation = world.gl.getUniformLocation(world.program, "u_normal_matrix");
        world.gl.uniformMatrix3fv(nMatrixLocation, false, figure.getNormalMatrix());

        // Передача направления освещения.
        let lDirectionLocation =
            world.gl.getUniformLocation(world.program, "u_light_direction");
        world.gl.uniform3fv(lDirectionLocation, m4.normalize(world.lightDirection));

        // Передача флага использования света.
        let useLightLocation =
            world.gl.getUniformLocation(world.program, "u_use_light");
        world.gl.uniform1i(useLightLocation, Number(world.isLightUsed));

        // Передача цвета фонового освещения.
        let fColorLocation =
            world.gl.getUniformLocation(world.program, "u_fon_light_color");
        world.gl.uniform3fv(fColorLocation, world.fonLightColor);

        // Передача цвета направленного освещения.
        let dColorLocation =
            world.gl.getUniformLocation(world.program, "u_directed_light_color");
        world.gl.uniform3fv(dColorLocation, world.directedLightColor);

        if (figure.indices) {
            // создание буфера индексов
            let indexBuffer = world.gl.createBuffer();
            world.gl.bindBuffer(world.gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
            world.gl.bufferData(world.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(figure.indices), world.gl.STATIC_DRAW);
            // указываем число линий. это число равно числу индексов
            indexBuffer.numberOfItems = figure.indices.length;

            world.gl.drawElements(world.gl.TRIANGLES, indexBuffer.numberOfItems, world.gl.UNSIGNED_SHORT, 0);
        } else {
            // Отрисовка сцены.
            let primitiveType = world.gl.TRIANGLES; // рисовать триугольники.
            let offset = 0; // начинать с начала буферов
            let count = figure.positions.length / 3; // количество триугольников передаваемых для отрисовки.
            world.gl.drawArrays(primitiveType, offset, count);
        }

    }
}

/**
 * Перевод из градусов в радианы.
 *
 * @param angle {number} Угол в градусах.
 * @returns {number} Угол в радианах.
 */
function getRadians(angle) {
    return angle * Math.PI / 180;
}

/**
 * Регистрация всех кастомных HTML-элементов.
 */
function registerAll() {
    registerScene();
    registerCamera();
    registerTransform();
    registerShape();
    registerBox();
    registerIndexedFaceSet();
    registerAppearance();
    registerColor();
    registerDirectedLight();
}

/**
 * Проверка значения на принадлежность к множеству массивов из трех вещественных чисел.
 * Бросает исключение в случае не принадлежности.
 *
 * @param value Проверяемое значение.
 * @param tagName {string} Имя тега, откуда значение пришло.
 * @param attributeName {string} Имя атрибута, откуда значение пришло.
 */
function checkArrayAttribute(value, tagName, attributeName) {
    if (value.length !== 3 || !checkNumber(value[0]) || !checkNumber(value[1]) || !checkNumber(value[2]))
        throw new Error("Ошибка при задании атрибута " + attributeName + " тега " + tagName +
            ". Данный атрибут должен принимать значения \"x y z\", где x, y, z - это вещественные числа.");
}

/**
 * Проверка значения на принадлежность к вещественным числам.
 * Бросает исключение в случае не принадлежности.
 *
 * @param value Проверяемое значение.
 * @param tagName {string} Имя тега, откуда значение пришло.
 * @param attributeName {string} Имя атрибута, откуда значение пришло.
 */
function checkNumberAttribute(value, tagName, attributeName) {
    if (!checkNumber(value))
        throw new Error("Ошибка при задании атрибута " + attributeName + " тега " + tagName +
            ". Данный атрибут должен принимать значения \"x\", где x - это вещественное число.");
}

/**
 * Проверка значения на принадлежность к вещественным числам.
 *
 * @param value Проверяемое значение.
 * @returns {boolean} Флаг принадлежности к вещественным числам.
 */
function checkNumber(value) {
    return !(value !== value || typeof value === "undefined" || (typeof value === "object" && !value));
}