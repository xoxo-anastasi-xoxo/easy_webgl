class Scene {
    constructor(scene) {
        this.scene = scene;
        this.gl = undefined;

        this.color = [255, 255, 255, 0];

        this.objects = [];
        this.cameras = [];
        this.activeCamera = undefined;
        this.light = undefined;


        this.fragmentShaderSource =
            "  precision mediump float;\
            \
              varying vec4 v_color;\
             varying vec3 v_light;\
            \
            uniform vec3 u_reverseLightDirection;\
            \
              void main() {\
               gl_FragColor = vec4(v_color.rgb * v_light, v_color.a);\
              }";
        this.vertexShaderSource = "attribute vec4 a_position;\
       attribute vec4 a_color;\
       attribute vec3 a_normal;\
    \
       uniform mat4 u_matrix;\
       uniform mat3 u_normal_matrix;\
       uniform vec3 u_fon_light_color;\
       uniform vec3 u_light_direction;\
       uniform vec3 u_directed_light_color;\
       uniform int u_use_light;\
    \
       varying vec4 v_color;\
       varying vec3 v_light;\
    \
       void main() {\
         gl_Position = u_matrix * a_position;\
    \
         v_color = a_color;\
    \
         if (u_use_light == 0) {\
           v_light = vec3(1,1,1);\
         } else {\
           vec3 transformedNormal = u_normal_matrix * a_normal;\
    \
           float directed_light_weight = max(dot(transformedNormal, u_light_direction), 0.0);\
    \
           v_light = u_fon_light_color + u_directed_light_color * directed_light_weight;\
    }\
        }";

        this.registerAll();
        this.init();
        this.drawScene(true);
    }

    /**
     * Регистрация всех кастомных HTML-элементов.
     */
    registerAll() {
        let mySceneProto = Object.create(HTMLCanvasElement.prototype);
        document.registerElement("my-scene", {
            prototype: mySceneProto,
            extends: 'canvas'
        });

        let tags = [
            "my-camera",
            "my-transform",
            "my-shape",
            "my-appearance",
            "my-indexed-face-set",
            "my-box",
            "my-color",
            "my-cone",
            "my-cylinder",
            "my-sphere",
            "my-directed-light"
        ];

        for (let tag of tags) {
            let myProto = Object.create(HTMLElement.prototype);
            document.registerElement(tag, {
                prototype: myProto
            });
        }
    }


    /**
     * Инициализирует данные для шедеров, используя атрибуты тега my-scene.
     * Проверяет наличие обязательных тегов.
     * Запускает инициализацию Камеры, Света и всех фигур сцены.
     */
    init() {
        this.scene.width = this.scene.width || "0";
        this.scene.height = this.scene.height || "0";

        // Задаем для нее графический контекст.
        this.gl = this.scene.getContext("webgl");
        if (!this.gl)
            throw new Error("В данном браузере недоступен WebGL");

        // Проверяем на наличие камеры.
        if (!this.scene.getElementsByTagName("my-camera").length)
            throw new Error("Отсутствует дочерний элемент - my-camera");
        for (let cam of this.scene.getElementsByTagName("my-camera")) {
            this.cameras.push(new Camera(cam));
            if (this.cameras[this.cameras.length - 1].isActive)
                this.activeCamera = this.cameras[this.cameras.length - 1];
        }
        if (this.activeCamera)
            this.activeCamera = this.cameras[0];

        // Подготовим пространство для отрисовки
        this.gl.enable(this.gl.CULL_FACE); // разрешим отрисовку только лицевых треугольников
        this.gl.enable(this.gl.DEPTH_TEST); // включим проверку z-индекса

        // Достаем из атрибутов указанный цвет фона
        this.color =

            // Запускаем инициализацию дерева элемнтов.
            initCamera(thi.scene);
        initTransform(world.scene);
        initDirectedLight(world.scene);
    }

    /**
     * Подгоняем размер canvas под экран
     */
    resize() {
        // получаем размер HTML-элемента canvas
        let displayWidth = world.scene.clientWidth;
        let displayHeight = world.scene.clientHeight;

        // проверяем, отличается ли размер canvas
        if (world.scene.width !== displayWidth ||
            world.scene.height !== displayHeight) {

            // подгоняем размер буфера отрисовки под размер HTML-элемента
            world.scene.width = displayWidth;
            world.scene.height = displayHeight;
        }
    }


    addObject(transform, shape, appearance) {
        let fragmentShader = this.createShader(this.gl, this.gl.FRAGMENT_SHADER, this.fragmentShaderSource);
        let vertexShader = this.createShader(this.gl, this.gl.VERTEX_SHADER, this.vertexShaderSource);
        let program = this.createProgram(this.gl, vertexShader, fragmentShader);
        let obj = {
            transform,
            shape,
            appearance,
            fragmentShader,
            vertexShader,
            program
        };
        this.objects.push(obj);
        this.drawNewObject(this.objects[this.objects.length - 1]);
    }

    drawNewObject(object) {
        // Указываем, какую программу использовать.
        this.gl.useProgram(object.program);

        // Передаем данные а атрибуты и буферы.
        // Передаем позиции вершин фигуры.
        let size = 3;              // 3 компоненты на итерацию
        let type = world.gl.FLOAT; // наши данные - 32-битные числа с плавающей точкой
        let normalize = false;     // не нормализовать данные
        let stride = 0;            // 0 = перемещаться на size * sizeof(type) каждую итерацию для получения следующего положения
        let buf_offset = 0;        // начинать с начала буфера
        fillAttribute(world.gl, world.program, "a_position", new Float32Array(figure.positions),
            size, type, normalize, stride, buf_offset);

        console.log("zagruzca нормалей...", prev - new Date());
        prev = new Date();

        // Передаем координаты нормалей фигуры.
        size = 3;                // 3 компоненты на итерацию
        type = world.gl.FLOAT;   // наши данные - 32-битные числа с плавающей точкой
        normalize = false;       // не нормализовать данные
        stride = 0;              // 0 = перемещаться на size * sizeof(type) каждую итерацию для получения следующего положения
        buf_offset = 0;          // начинать с начала буфера
        fillAttribute(world.gl, world.program, "a_normal", new Float32Array(figure.normals),
            size, type, normalize, stride, buf_offset);

        console.log("zagruzca цветов...", prev - new Date());
        prev = new Date();
        // Передаем цвета вершин фигуры.
        size = 3;                       // 3 компоненты на итерацию
        type = world.gl.UNSIGNED_BYTE;  // данные - 8-битные беззнаковые целые
        normalize = true;               // нормализовать данные (конвертировать из 0-255 в 0-1)
        stride = 0;                     // 0 = перемещаться на size * sizeof(type) каждую итерацию для получения следующего положения
        buf_offset = 0;                 // начинать с начала буфера
        fillAttribute(world.gl, world.program, "a_color", new Uint8Array(figure.colors),
            size, type, normalize, stride, buf_offset);

        console.log("zagruzca разных юниформ переменных...", prev - new Date());
        prev = new Date();

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
            console.log("zagruzca индексов...", prev - new Date());
            prev = new Date();

            // создание буфера индексов
            let indexBuffer = world.gl.createBuffer();
            world.gl.bindBuffer(world.gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
            world.gl.bufferData(world.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(figure.indices), world.gl.STATIC_DRAW);
            // указываем число линий. это число равно числу индексов
            indexBuffer.numberOfItems = figure.indices.length;

            console.log("отрисовка", prev - new Date());
            prev = new Date();

            world.gl.drawElements(world.gl.TRIANGLES, indexBuffer.numberOfItems, world.gl.UNSIGNED_SHORT, 0);
            console.log("done", prev - new Date());

        } else {
            // Отрисовка сцены.
            let primitiveType = world.gl.TRIANGLES; // рисовать триугольники.
            let offset = 0; // начинать с начала буферов
            let count = figure.positions.length / 3; // количество триугольников передаваемых для отрисовки.
            world.gl.drawArrays(primitiveType, offset, count);
        }
    }

    drawScene(flag) {
        // Подгоняем размер окна прорисовки под канвас.
        resizeScene(world.gl.canvas);
        this.gl.viewport(0, 0, world.gl.canvas.width, world.gl.canvas.height);

        // Очищаем canvas.
        this.gl.clearColor(30 / 255, 30 / 255, 30 / 255, 0.5);
        // Очищаем буферы цветов и глубины.
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);


        // Запускаем прорисовку каждой фигуры сцены по порядку.
        for (let obj of this.objects) {
            if (flag)
                this.drawNewObject(obj);
            else
                this.drawObject(obj)
        }
    }

    drawObject(object) {
        // Указываем, какую программу использовать.
        this.gl.useProgram(object.program);
        // Передаем данные в Uniform-переменные.
        // Передача матрицы смещения.
        let matrixLocation = world.gl.getUniformLocation(world.program, "u_matrix");
        world.gl.uniformMatrix4fv(matrixLocation, false, figure.getMatrix());

        // Передача матрицы нормалей.
        let nMatrixLocation = world.gl.getUniformLocation(world.program, "u_normal_matrix");
        world.gl.uniformMatrix3fv(nMatrixLocation, false, figure.getNormalMatrix());


        if (figure.indices) {
            world.gl.drawElements(world.gl.TRIANGLES, figure.indices.length, world.gl.UNSIGNED_SHORT, 0);

        } else {
            // Отрисовка сцены.
            let primitiveType = world.gl.TRIANGLES; // рисовать триугольники.
            let offset = 0; // начинать с начала буферов
            let count = figure.positions.length / 3; // количество триугольников передаваемых для отрисовки.
            world.gl.drawArrays(primitiveType, offset, count);
        }


    }

    /**
     * Создание и компиляция шейдера.
     *
     * @param gl Текущий графический контекст.
     * @param type Тип шейдера.
     * @param source {String} Код шейдера.
     * @returns {WebGLShader} Шейдер.
     */
    createShader(gl, type, source) {
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
    createProgram(gl, vertexShader, fragmentShader) {
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
    fillAttribute(gl, program, name, data, size, type, normalize, stride, buf_offset) {
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
}