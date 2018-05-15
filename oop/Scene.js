/**
 * Определяет трехмерную сцену.
 */
class Scene {
    /**
     * Создает экземпляр Scene.
     * @constructor
     * @this  {Scene}
     *
     * @param sceneElement Ссылка на DOM-элемент, который иллюстрирует этот объект.
     */
    constructor(sceneElement) {
        /**
         * Ссылка на DOM-элемент, который иллюстрирует этот объект.
         */
        this.sceneElement = sceneElement;
        /**
         * Графический контекст.
         */
        this.gl = undefined;

        /**
         * Фоновый цвет сцены.
         * @type {number[]}
         */
        this.color = [1, 1, 1, 0];

        /**
         * Все объекты сцены.
         * @type {Array}
         */
        this.objects = [];
        /**
         * Все камеры сцены.
         * @type {Camera[]}
         */
        this.cameras = [];
        /**
         * Активная камера.
         * @type {Camera}
         */
        this.activeCamera = undefined;
        /**
         * Напрвленный свет.
         * @type {DirectedLight}
         */
        this.light = undefined;

        /**
         * Текст фрагментного шейдера на GLSL.
         * @type {string}
         */
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
        /**
         * Текст вершинного шейдера на GLSL.
         * @type {string}
         */
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

        // Регистрируем все введеные библиотекой html-элементы.
        this.registerAll();
        // Запускаем инициализацию сцены и ее дочерних элементов.
        this.init();
        // Отрисовываем сцену.
        this.drawScene();
    }

    /**
     * Регистрация всех кастомных HTML-элементов.
     */
    registerAll() {
        if (!document.registerElement)
            return;

        // Регистрируем непосредственно сцену.
        let mySceneProto = Object.create(HTMLCanvasElement.prototype);
        document.registerElement("my-scene", {
            prototype: mySceneProto,
            extends: 'canvas'
        });

        // Все кастомные теги.
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

        // Регистрируем остальные теги.
        for (let tag of tags) {
            let myProto = Object.create(HTMLElement.prototype);
            document.registerElement(tag, {
                prototype: myProto
            });
        }
    }


    /**
     * Инициализирует данные, используя атрибуты тега my-scene.
     * Проверяет наличие обязательных тегов.
     * Запускает инициализацию дочерних элементов.
     */
    init() {
        this.sceneElement.width = this.sceneElement.width || "0";
        this.sceneElement.height = this.sceneElement.height || "0";

        // Задаем для нее графический контекст.
        this.gl = this.sceneElement.getContext("webgl") || this.sceneElement.getContext("experimental-webgl");
        if (!this.gl)
            throw new Error("В данном браузере недоступен WebGL");

        // Компилируем шейдеры.
        this.fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, this.fragmentShaderSource);
        this.vertexShader = this.createShader(this.gl.VERTEX_SHADER, this.vertexShaderSource);
        // Создаем шейдерную программу.
        this.program = this.createProgram(this.vertexShader, this.fragmentShader);

        // Проверяем на наличие камеры.
        if (!this.sceneElement.getElementsByTagName("my-camera").length)
            throw new Error("Отсутствует дочерний элемент - my-camera");
        for (let cam of this.sceneElement.getElementsByTagName("my-camera")) {
            this.cameras.push(new Camera(cam, this));
            if (this.cameras[this.cameras.length - 1].isActive)
                this.activeCamera = this.cameras[this.cameras.length - 1];
        }
        if (!this.activeCamera)
            this.activeCamera = this.cameras[0];

        // Подготовим пространство для отрисовки
        this.gl.enable(this.gl.CULL_FACE); // разрешим отрисовку только лицевых треугольников
        this.gl.enable(this.gl.DEPTH_TEST); // включим проверку z-индекса

        // Достаем из атрибутов указанный цвет фона
        this.color = this.sceneElement.attributes["fon-color"] ?
            this.sceneElement.attributes["fon-color"].value.split(" ").map(value => parseFloat(value)).map(value => value / 255)
            : this.color;

        // Запускаем инициализацию дерева элемнтов.
        for (let trans of this.sceneElement.getElementsByTagName("my-transform")) {
            new Transform(trans, this);
        }

        // Проверяем наличие света в сцене.
        this.light = this.sceneElement.getElementsByTagName("my-directed-light").length ?
            new DirectedLight(this.sceneElement.getElementsByTagName("my-directed-light")[0], this) : null;
    }

    /**
     * Подгоняет размер canvas под экран
     */
    resize() {
        // получаем размер HTML-элемента canvas
        let displayWidth = this.sceneElement.clientWidth;
        let displayHeight = this.sceneElement.clientHeight;

        // проверяем, отличается ли размер canvas
        if (this.sceneElement.width !== displayWidth ||
            this.sceneElement.height !== displayHeight) {

            // подгоняем размер буфера отрисовки под размер HTML-элемента
            this.sceneElement.width = displayWidth;
            this.sceneElement.height = displayHeight;
        }
    }

    /**
     * Добавление трехмерного объекта на сцену.
     * @param transform {Transform} Положение в пространстве добавляемого объекта.
     * @param shape {Shape} Форма добавляемого объекта.
     * @param appearance {Appearance} Внешний вид добавляемого объекта.
     */
    addObject({transform, shape, appearance}) {
        // Добавляем ко всем объектам сцены.
        this.objects.push({
            transform,
            shape,
            appearance
        });
        // Перерисовываем сцену.
        this.drawScene();
    }

    /**
     * Рендерит сцену.
     */
    drawScene() {
        // Подгоняем размер окна прорисовки под канвас.
        this.resize(this.gl.canvas);
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);

        // Очищаем canvas.
        this.gl.clearColor(...this.color);
        // Очищаем буферы цветов и глубины.
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        // Указываем, какую программу использовать.
        this.gl.useProgram(this.program);

        // Запускаем прорисовку каждой фигуры сцены по порядку.
        for (let obj of this.objects) {
            // Передаем данные а атрибуты и буферы.
            // Передаем позиции вершин фигуры.
            let size = 3;              // 3 компоненты на итерацию
            let type = this.gl.FLOAT; // наши данные - 32-битные числа с плавающей точкой
            let normalize = false;     // не нормализовать данные
            let stride = 0;            // 0 = перемещаться на size * sizeof(type) каждую итерацию для получения следующего положения
            let buf_offset = 0;        // начинать с начала буфера
            this.fillAttribute(this.program, "a_position", new Float32Array(obj.shape.vertices),
                size, type, normalize, stride, buf_offset);

            // Передаем координаты нормалей фигуры.
            size = 3;                // 3 компоненты на итерацию
            type = this.gl.FLOAT;   // наши данные - 32-битные числа с плавающей точкой
            normalize = false;       // не нормализовать данные
            stride = 0;              // 0 = перемещаться на size * sizeof(type) каждую итерацию для получения следующего положения
            buf_offset = 0;          // начинать с начала буфера
            this.fillAttribute(this.program, "a_normal", new Float32Array(obj.shape.normals),
                size, type, normalize, stride, buf_offset);

            // Передаем цвета вершин фигуры.
            size = 3;                       // 3 компоненты на итерацию
            type = this.gl.UNSIGNED_BYTE;  // данные - 8-битные беззнаковые целые
            normalize = true;               // нормализовать данные (конвертировать из 0-255 в 0-1)
            stride = 0;                     // 0 = перемещаться на size * sizeof(type) каждую итерацию для получения следующего положения
            buf_offset = 0;                 // начинать с начала буфера
            this.fillAttribute(this.program, "a_color", new Uint8Array(obj.appearance.colors),
                size, type, normalize, stride, buf_offset);

            // Передаем данные в Uniform-переменные.
            // Передача матрицы смещения.
            let matrixLocation = this.gl.getUniformLocation(this.program, "u_matrix");
            this.gl.uniformMatrix4fv(matrixLocation, false,
                obj.transform.getMatrix(this.activeCamera.cameraMatrix, this.activeCamera.projectionMatrix));

            // Передача матрицы нормалей.
            let nMatrixLocation = this.gl.getUniformLocation(this.program, "u_normal_matrix");
            this.gl.uniformMatrix3fv(nMatrixLocation, false, obj.transform.getNormalMatrix());

            // Передача направления освещения.
            let lDirectionLocation =
                this.gl.getUniformLocation(this.program, "u_light_direction");
            this.gl.uniform3fv(lDirectionLocation, Algebra.normalize(this.light.lightDirection));

            // Передача флага использования света.
            let useLightLocation =
                this.gl.getUniformLocation(this.program, "u_use_light");
            this.gl.uniform1i(useLightLocation, Number(!!this.light));

            // Передача цвета фонового освещения.
            let fColorLocation =
                this.gl.getUniformLocation(this.program, "u_fon_light_color");
            this.gl.uniform3fv(fColorLocation, this.light.fonLightColor);

            // Передача цвета направленного освещения.
            let dColorLocation =
                this.gl.getUniformLocation(this.program, "u_directed_light_color");
            this.gl.uniform3fv(dColorLocation, this.light.directedLightColor);

            if (obj.shape.indices) {
                // Передаем индексы поверхностей фигуры.
                this.fillIndexAttribute(obj.shape.indices);

                // Отрисовка сцены.
                let primitiveType = this.gl.TRIANGLES; // рисовать триугольники.
                let offset = 0; // начинать с начала буферов
                let type = this.gl.UNSIGNED_SHORT;
                let count = obj.shape.indices.length; // количество триугольников передаваемых для отрисовки.
                this.gl.drawElements(primitiveType, count, type, offset);

            } else {
                // Отрисовка сцены.
                let primitiveType = this.gl.TRIANGLES; // рисовать триугольники.
                let offset = 0; // начинать с начала буферов
                let count = obj.shape.vertices.length / 3; // количество триугольников передаваемых для отрисовки.
                this.gl.drawArrays(primitiveType, offset, count);
            }

        }
    }

    /**
     * Создание и компиляция шейдера.
     *
     * @param type Тип шейдера.
     * @param source {String} Код шейдера.
     * @returns {WebGLShader} Шейдер.
     */
    createShader(type, source) {
        // Создание шейдера
        let shader = this.gl.createShader(type);

        // Устанавливаем шейдеру его программный код
        this.gl.shaderSource(shader, source);

        // Компилируем шейдер
        this.gl.compileShader(shader);

        // В случае успешной компиляции возвращаем шейдер
        let success = this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS);
        if (success) {
            return shader;
        }

        // В случае ошибки - сообщаем о ней
        console.log(this.gl.getShaderInfoLog(shader));
        this.gl.deleteShader(shader);
    }

    /**
     * Собираем программу для видеокарты из двух шейдеров.
     *
     * @param vertexShader {WebGLShader} Вершинный шейдер.
     * @param fragmentShader {WebGLShader} Фрагментный шейдер.
     * @returns {WebGLProgram} Программа для видеокарты.
     */
    createProgram(vertexShader, fragmentShader) {
        // Создаем программую
        let program = this.gl.createProgram();

        // Закрепляем за ней шейдеры.
        this.gl.attachShader(program, vertexShader);
        this.gl.attachShader(program, fragmentShader);

        // Указываем, что именно это программу надо выполнять в текущем графическом контексте.
        this.gl.linkProgram(program);

        // В случае успеха линковки - вернуть программу.
        let success = this.gl.getProgramParameter(program, this.gl.LINK_STATUS);
        if (success) {
            return program;
        }

        // В случае ошибки - вывести информацию о ней.
        console.log(this.gl.getProgramInfoLog(program));
        this.gl.deleteProgram(program);
    }

    /**
     * Заполняет атрибут и буфер даннми.
     *
     * @param program {WebGLProgram} Текущая программа для видеокарты.
     * @param name {String} Наименование атрибута в шейдере.
     * @param data Массив данных для передачи, приведенный к нужному типу.
     * @param size {Number} Количество компонент массива на итерацию.
     * @param type Тип массива данных.
     * @param normalize {Boolean} Нуждаются ли данные в нормализации.
     * @param stride {Number} Дополнительное перемещение по данным относительно итерации.
     * @param buf_offset {Number} Элемент массива, с которого начнется первая итерация.
     */
    fillAttribute(program, name, data, size, type, normalize, stride, buf_offset) {
        // Инициализируем атрибут и буфер.
        let attributeLocation = this.gl.getAttribLocation(program, name);
        let buffer = this.gl.createBuffer();

        // Привязываем атрибут и буфер.
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
        this.gl.enableVertexAttribArray(attributeLocation);

        // Передаем данные в атрибут и в буфер.
        this.gl.bufferData(this.gl.ARRAY_BUFFER, data, this.gl.STATIC_DRAW);
        this.gl.vertexAttribPointer(
            attributeLocation, size, type, normalize, stride, buf_offset);
    }

    /**
     * Заполняет атрибут индексов.
     * @param indices {number[]} Данные для передачи
     */
    fillIndexAttribute(indices) {
        // Инициализируем буфер.
        let indexBuffer = this.gl.createBuffer();
        // Привязываем буфер.
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        // Передаем данные в буфер.
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), this.gl.STATIC_DRAW);
    }
}