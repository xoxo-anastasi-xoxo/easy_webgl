/**
 * Тег my-camera. Определяет камеру в нашей сцене.
 */
class Camera {
    /**
     * Создает экземпляр Camera.
     * @constructor
     * @this  {Camera}
     *
     * @param cameraElement Ссылка на DOM-элемент, который иллюстрирует этот объект.
     * @param scene {Scene} Трехмерная сцена, в которой определен объект.
     */
    constructor(cameraElement, scene) {
        // Определим все неодходимые поля.
        /**
         * Ссылка на DOM-элемент, который иллюстрирует этот объект.
         */
        this.cameraElement = cameraElement;
        /**
         * Ссылка на трехмерную сцену, которой принадлежит камера.
         * @type {Scene}
         */
        this.scene = scene;

        /**
         * Отношение ширины окна отрисовки к высоте.
         * @type {number}
         */
        this.aspect = this.scene.gl.canvas.clientWidth / this.scene.gl.canvas.clientHeight;
        /**
         * Угол отображения области видимости в радианах.
         * @type {number}
         */
        this.fieldOfViewDegrees = 60;
        /**
         * Модуль самого дальнего индекса, видимого камере, по Z.
         * @type {number}
         */
        this.zFar = 2000;
        /**
         * Модуль ближайшего индекса, видимого камере, по Z.
         * @type {number}
         */
        this.zNear = 1;
        /**
         * Углы поворота камеры в градусах.
         * @type {number[]}
         */
        this.cameraRotation = [0, 0, 0];
        /**
         * Позиция камеры в мире.
         * @type {number[]}
         */
        this.cameraPosition = [0, 0, 0];
        /**
         * Тип навигации по трехмерной сцене.
         * @type {string}
         */
        this.navigationType = "";

        /**
         * Матрица камеры.
         * @type {number[]}
         */
        this.cameraMatrix = Algebra.identity();
        /**
         * Матрица, формирующая перспективу.
         * @type {number[]}
         */
        this.projectionMatrix = undefined;

        // Запустим инициализацию полей атрибутами.
        this.init();
    }

    /**
     * Инициализирует данные для шедеров, используя атрибуты тега my-camera.
     *
     * Определяет парамтры фрустума:
     *      - атрибут "view-angle" - число - угол фрустума в градусах - по умолчанию 60;
     *      - атрибут "z-far" - число - максимальное видимое значение координат по оси z - по умолчанию 2000;
     *      - атрибут "z-near" - число - минимальное видимое значение координат по оси z - по умолчанию 1.
     * И параметры камеры:
     *      - атрибут "camera-rotation" - массив - углы вращения по осям x,y,z для камеры - по умолчанию "0 0 0";
     *      - атрибут "camera-position" - массив - начальная позиция камеры - по умолчанию "0 0 0".
     * А так же "navigation-type", принимающий одно из двух значений: object или camera.
     * По умолчанию навигация по сцене не производится.
     *
     */
    init() {
        // Получаем из атрибутов данные или оставляем их значения по умолчанию.
        if (this.cameraElement.attributes["view-angle"])
            this.fieldOfViewDegrees = parseFloat(this.cameraElement.attributes["view-angle"].value);
        if (this.cameraElement.attributes["z-far"])
            this.zFar = parseFloat(this.cameraElement.attributes["z-far"].value);
        if (this.cameraElement.attributes["z-near"])
            this.zNear = parseFloat(this.cameraElement.attributes["z-near"].value);
        if (this.cameraElement.attributes["camera-rotation"])
            this.cameraRotation =
               this.cameraElement.attributes["camera-rotation"].value.split(" ").map(value => Utils.getRadians(parseFloat(value)));
        if (this.cameraElement.attributes["camera-position"])
            this.cameraPosition = this.cameraElement.attributes["camera-position"].value.split(" ").map(value => parseFloat(value));
        if (this.cameraElement.attributes["navigation-type"])
            this.navigationType = this.cameraElement.attributes["navigation-type"].value;


        // Выполняем проверку полученных данных.
        Utils.checkNumberAttribute(this.fieldOfViewDegrees, "my-camera", "view-angle");
        Utils.checkNumberAttribute(this.zFar, "my-camera", "z-far");
        Utils.checkNumberAttribute(this.zNear, "my-camera", "z-near");
        Utils.checkArrayAttribute(this.cameraRotation, "my-camera", "camera-rotation");
        Utils.checkArrayAttribute(this.cameraPosition, "my-camera", "camera-position");

        // Определяем способ навигации по сцене.
        this.defineNavigationType();

        // Задаем позицию камеры.
        this.setCameraParams();
    }


    /**
     * Пересчитывает матрицу камеры в случае изменения параметров.
     */
    setCameraParams() {
        // Задаем перспективу.
        this.projectionMatrix = Algebra.perspective(Utils.getRadians(this.fieldOfViewDegrees), this.aspect, this.zNear, this.zFar);

        // "Перносим" камеру на нужную позицию
        this.cameraMatrix = Algebra.identity();
        this.cameraMatrix = Algebra.translate(this.cameraMatrix, this.cameraPosition[0], this.cameraPosition[1], this.cameraPosition[2]);
        this.cameraMatrix = Algebra.zRotate(this.cameraMatrix, this.cameraRotation[2]);
        this.cameraMatrix = Algebra.yRotate(this.cameraMatrix, this.cameraRotation[1]);
        this.cameraMatrix = Algebra.xRotate(this.cameraMatrix, this.cameraRotation[0]);
        this.cameraMatrix = Algebra.inverse(this.cameraMatrix);
    }

    /**
     * По атрибуту navigation-type тега my-camera задает тип навигации по трехмерной сцене.
     */
    defineNavigationType() {
        function getShift(shift) {
            let rot = Algebra.identity();
            rot = Algebra.yRotate(rot, this.cameraRotation[1]);
            rot = Algebra.xRotate(rot, this.cameraRotation[0]);
            rot = Algebra.inverse(rot);
            return Algebra.multiply(shift, rot);
        }

        let shift;

        if (this.navigationType === "object") {
            // Добавление вращения и приближения объектов в сцене.
            document.addEventListener("keydown", (event) => {
                switch (event.keyCode) {
                    case 39:
                        // Поворот по оси Y впаво
                        for (let obj of scene.objects)
                            obj.transform.rotation[1] += Utils.getRadians(5);
                        scene.drawScene();
                        break;
                    case 37:
                        // Поворот по оси Y влево
                        for (let obj of scene.objects)
                            obj.transform.rotation[1] -= Utils.getRadians(5);
                        scene.drawScene();
                        break;
                    case 38:
                        // Поворот по оси X вверх
                        for (let obj of scene.objects)
                            obj.transform.rotation[0] -= Utils.getRadians(5);
                        scene.drawScene();
                        break;
                    case 40:
                        // Поворот по оси X вниз
                        for (let obj of scene.objects)
                            obj.transform.rotation[0] += Utils.getRadians(5);
                        scene.drawScene();
                        break;
                    case 34:
                        // Поворот по оси Z против часовой
                        for (let obj of scene.objects)
                            obj.transform.rotation[2] += Utils.getRadians(5);
                        scene.drawScene();
                        break;
                    case 33:
                        // Поворот по оси Z по часовой
                        for (let obj of scene.objects)
                            obj.transform.rotation[2] -= Utils.getRadians(5);
                        scene.drawScene();
                        break;
                    case 36:
                        // Home: приближение
                        shift = getShift.call(scene.activeCamera,[0, 0, -1, 0]);
                        scene.activeCamera.cameraPosition[0] += shift[0];
                        scene.activeCamera.cameraPosition[1] += shift[1];
                        scene.activeCamera.cameraPosition[2] += shift[2];
                        scene.activeCamera.setCameraParams();
                        scene.drawScene();
                        break;
                    case 35:
                        // End: отдаление
                        shift = getShift.call(scene.activeCamera,[0, 0, 1, 0]);
                        scene.activeCamera.cameraPosition[0] += shift[0];
                        scene.activeCamera.cameraPosition[1] += shift[1];
                        scene.activeCamera.cameraPosition[2] += shift[2];
                        scene.activeCamera.setCameraParams();
                        scene.drawScene();
                        break;
                }
            });
        } else if (this.navigationType === "camera") {
            // Добавление бродящего передвижения к сцене.
            document.addEventListener("keydown", (event) => {
                if (event.shiftKey) {
                    switch (event.keyCode) {
                        case 39:
                            scene.activeCamera.cameraRotation[1] -= Utils.getRadians(1);
                            scene.activeCamera.setCameraParams();
                            scene.drawScene();
                            break;
                        case 37:
                            scene.activeCamera.cameraRotation[1] += Utils.getRadians(1);
                            scene.activeCamera.setCameraParams();
                            scene.drawScene();
                            break;
                        case 38:
                            scene.activeCamera.cameraRotation[0] += Utils.getRadians(1);
                            scene.activeCamera.setCameraParams();
                            scene.drawScene();
                            break;
                        case 40:
                            scene.activeCamera.cameraRotation[0] -= Utils.getRadians(1);
                            scene.activeCamera.setCameraParams();
                            scene.drawScene();
                            break;
                        case 34:
                            scene.activeCamera.cameraRotation[2] -= Utils.getRadians(1);
                            scene.activeCamera.setCameraParams();
                            scene.drawScene();
                            break;
                        case 33:
                            scene.activeCamera.cameraRotation[2] += Utils.getRadians(1);
                            scene.activeCamera.setCameraParams();
                            scene.drawScene();
                            break;
                    }
                } else {
                    switch (event.keyCode) {
                        case 39:
                            shift = getShift.call(scene.activeCamera,[1, 0, 0, 0]);
                            scene.activeCamera.cameraPosition[0] += shift[0];
                            scene.activeCamera.cameraPosition[1] += shift[1];
                            scene.activeCamera.cameraPosition[2] += shift[2];
                            scene.activeCamera.setCameraParams();
                            scene.drawScene();
                            break;
                        case 37:
                            shift = getShift.call(scene.activeCamera,[-1, 0, 0, 0]);
                            scene.activeCamera.cameraPosition[0] += shift[0];
                            scene.activeCamera.cameraPosition[1] += shift[1];
                            scene.activeCamera.cameraPosition[2] += shift[2];
                            scene.activeCamera.setCameraParams();
                            scene.drawScene();
                            break;
                        case 38:
                            shift = getShift.call(scene.activeCamera,[0, 1, 0, 0]);
                            scene.activeCamera.cameraPosition[0] += shift[0];
                            scene.activeCamera.cameraPosition[1] += shift[1];
                            scene.activeCamera.cameraPosition[2] += shift[2];
                            scene.activeCamera.setCameraParams();
                            scene.drawScene();
                            break;
                        case 40:
                            shift = getShift.call(scene.activeCamera,[0, -1, 0, 0]);
                            scene.activeCamera.cameraPosition[0] += shift[0];
                            scene.activeCamera.cameraPosition[1] += shift[1];
                            scene.activeCamera.cameraPosition[2] += shift[2];
                            scene.activeCamera.setCameraParams();
                            scene.drawScene();
                            break;
                        case 35:
                            shift = getShift.call(scene.activeCamera,[0, 0, 1, 0]);
                            scene.activeCamera.cameraPosition[0] += shift[0];
                            scene.activeCamera.cameraPosition[1] += shift[1];
                            scene.activeCamera.cameraPosition[2] += shift[2];
                            scene.activeCamera.setCameraParams();
                            scene.drawScene();
                            break;
                        case 36:
                            shift = getShift.call(scene.activeCamera,[0, 0, -1, 0]);
                            scene.activeCamera.cameraPosition[0] += shift[0];
                            scene.activeCamera.cameraPosition[1] += shift[1];
                            scene.activeCamera.cameraPosition[2] += shift[2];
                            scene.activeCamera.setCameraParams();
                            scene.drawScene();
                    }
                }
            });
        }
    }
}