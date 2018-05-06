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
    world.aspect = world.gl.canvas.clientWidth / world.gl.canvas.clientHeight;
    let camera = scene.getElementsByTagName("my-camera")[0];

    // Получаем из атрибутов данные или задаем их по умолчанию.
    world.fieldOfViewDegrees = camera.attributes["view-angle"] ?
        parseFloat(camera.attributes["view-angle"].value) : 60;
    world.zFar = camera.attributes["z-far"] ?
        parseFloat(camera.attributes["z-far"].value) : 2000;
    world.zNear = camera.attributes["z-near"] ?
        parseFloat(camera.attributes["z-near"].value) : 1;
    world.cameraYAngleDegrees = camera.attributes["camera-angle"] ?
        parseFloat(camera.attributes["camera-angle"].value) : 0;
    world.cameraPosition = camera.attributes["camera-position"] ?
        camera.attributes["camera-position"].value.split(" ").map(value => parseFloat(value)) : [0, 0, 0];
    world.cameraXAngleDegrees = 0;

    // Выполняем проверку полученных данных.
    checkNumberAttribute(world.fieldOfViewDegrees, "my-camera", "view-angle");
    checkNumberAttribute(world.zFar, "my-camera", "z-far");
    checkNumberAttribute(world.zNear, "my-camera", "z-near");
    checkNumberAttribute(world.cameraYAngleDegrees, "my-camera", "camera-angle");
    checkArrayAttribute(world.cameraPosition, "my-camera", "camera-position");

    // Задаем позицию камеры и параметры фрустума.
    setCameraParams();
}

/**
 * Пересчитывает матрицу проекции и матрицу камеры в случае изменения параметров.
 */
function setCameraParams() {
    // Задаем перспективу.
    world.projectionMatrix = m4.perspective(getRadians(world.fieldOfViewDegrees), world.aspect, world.zNear, world.zFar);

    // "Перносим" камеру на нужную позицию
    world.cameraMatrix = m4.yRotation(getRadians(-world.cameraYAngleDegrees));
    world.cameraMatrix = m4.xRotate(world.cameraMatrix, getRadians(-world.cameraXAngleDegrees));
    world.cameraMatrix = m4.translate(world.cameraMatrix, -world.cameraPosition[0], -world.cameraPosition[1], -world.cameraPosition[2]);
}