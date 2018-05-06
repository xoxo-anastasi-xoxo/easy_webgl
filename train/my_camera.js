let fieldOfViewDegrees, zNear, zFar, cameraYAngleDegrees;
let cameraPosition;
let cameraMatrix, projectionMatrix;
let aspect;
let cameraXAngleDegrees;

/**
 * Регистрируем кастомный элемент my-camera.
 */
function registerCamera() {
    let myCameraProto = Object.create(HTMLElement.prototype);
    document.registerElement("my-camera", {
        prototype: myCameraProto
    });
}

/**
 * Инициализирует данные для шедеров, используя атрибуты тега my-camera.
 *
 * Определяет парамтры фрустума:
 *      - атрибут "view-angle" - число - угол фрустума в градусах - по умолчанию 60;
 *      - атрибут "z-far" - число - максимальное видимое значение координат по оси z - по умолчанию 2000;
 *      - атрибут "z-near" - число - минимальное видимое значение координат по оси z - по умолчанию 1.
 * И параметры камеры:
 *      - атрибут "camera-angle" - число - угол вращения по оси y для камеры - по умолчанию 0;
 *      - атрибут "camera-position" - массив - начальная позиция камеры - по умолчанию "0 0 0".
 *
 * @param scene {HTMLElement} Текущая сцена.
 */
function initCamera(scene) {
    aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    let camera = scene.getElementsByTagName("my-camera")[0];

    // Получаем из атрибутов данные или задаем их по умолчанию.
    fieldOfViewDegrees = camera.attributes["view-angle"] ?
        parseFloat(camera.attributes["view-angle"].value) : 60;
    zFar = camera.attributes["z-far"] ?
        parseFloat(camera.attributes["z-far"].value) : 2000;
    zNear = camera.attributes["z-near"] ?
        parseFloat(camera.attributes["z-near"].value) : 1;
    cameraYAngleDegrees = camera.attributes["camera-angle"] ?
        parseFloat(camera.attributes["camera-angle"].value) : 0;
    cameraPosition = camera.attributes["camera-position"] ?
        camera.attributes["camera-position"].value.split(" ").map(value => parseFloat(value)) : [0, 0, 0];
    cameraXAngleDegrees = 0;

    // Выполняем проверку полученных данных.
    checkNumberAttribute(fieldOfViewDegrees, "my-camera", "view-angle");
    checkNumberAttribute(zFar, "my-camera", "z-far");
    checkNumberAttribute(zNear, "my-camera", "z-near");
    checkNumberAttribute(cameraYAngleDegrees, "my-camera", "camera-angle");
    checkArrayAttribute(cameraPosition, "my-camera", "camera-position");

    // Задаем позицию камеры и параметры фрустума.
    setCameraParams();
}

/**
 * Пересчитывает матрицу проекции и матрицу камеры в случае изменения параметров.
 */
function setCameraParams() {
    // Задаем перспективу.
    projectionMatrix = m4.perspective(getRadians(fieldOfViewDegrees), aspect, zNear, zFar);

    // "Перносим" камеру на нужную позицию
    cameraMatrix = m4.yRotation(getRadians(-cameraYAngleDegrees));
    cameraMatrix = m4.xRotate(cameraMatrix, getRadians(-cameraXAngleDegrees));
    cameraMatrix = m4.translate(cameraMatrix, -cameraPosition[0], -cameraPosition[1], -cameraPosition[2]);
}