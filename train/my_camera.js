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
 * А так же "navigation-type", принимающий одно из двух значений: object или camera.
 * По умолчанию навигация по сцене не производится.
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
    world.cameraYAngleDegrees = camera.attributes["camera-y-angle"] ?
        parseFloat(camera.attributes["camera-y-angle"].value) : 0;
    world.cameraPosition = camera.attributes["camera-position"] ?
        camera.attributes["camera-position"].value.split(" ").map(value => parseFloat(value)) : [0, 0, 0];
    world.cameraXAngleDegrees = camera.attributes["camera-x-angle"] ?
        parseFloat(camera.attributes["camera-x-angle"].value) : 0;
    world.navigationType = camera.attributes["navigation-type"] ?
        camera.attributes["navigation-type"].value : null;


    // Выполняем проверку полученных данных.
    checkNumberAttribute(world.fieldOfViewDegrees, "my-camera", "view-angle");
    checkNumberAttribute(world.zFar, "my-camera", "z-far");
    checkNumberAttribute(world.zNear, "my-camera", "z-near");
    checkNumberAttribute(world.cameraYAngleDegrees, "my-camera", "camera-y-angle");
    checkNumberAttribute(world.cameraXAngleDegrees, "my-camera", "camera-x-angle");
    checkArrayAttribute(world.cameraPosition, "my-camera", "camera-position");

    // Определяем способ навигации по сцене.
    function getShift(shift) {
        let rot = m4.identity();
        rot = m4.yRotate(rot, getRadians(world.cameraYAngleDegrees));
        rot = m4.xRotate(rot, getRadians(world.cameraXAngleDegrees));
        rot = m4.inverse(rot);
        return m4.multiply(shift, rot);
    }
    let shift;

    if (world.navigationType === "object") {
        // Добавление вращения и приближения объектов в сцене.
        document.addEventListener("keydown", (event) => {


            switch (event.keyCode) {
                case 39:
                    for (let fig of world.groups) {
                        fig.anglesInDegrees[1] += 5;
                    }
                    drawScene();
                    break;
                case 37:
                    for (let fig of world.groups) {
                        fig.anglesInDegrees[1] -= 5;
                    }
                    drawScene();
                    break;
                case 38:
                    for (let fig of world.groups) {
                        fig.anglesInDegrees[0] -= 5;
                    }
                    drawScene();
                    break;
                case 40:
                    for (let fig of world.groups) {
                        fig.anglesInDegrees[0] += 5;
                    }
                    drawScene();
                    break;
                case 33:
                    // pageup
                    shift = getShift([0, 0, (world.zFar - world.zNear) / 400, 0]);
                    world.cameraPosition[0] += shift[0];
                    world.cameraPosition[1] += shift[1];
                    world.cameraPosition[2] += shift[2];

                    setCameraParams();
                    drawScene();
                    break;
                case 34:
                    // pagedown
                    shift = getShift([0, 0, -(world.zFar - world.zNear) / 400, 0]);
                    world.cameraPosition[0] += shift[0];
                    world.cameraPosition[1] += shift[1];
                    world.cameraPosition[2] += shift[2];

                    setCameraParams();
                    drawScene();
                    break;
            }

        });
    } else if (world.navigationType === "camera") {
        // Добавление бродящего передвижения к сцене.
        document.addEventListener("keydown", (event) => {
            console.log(world.groups);
            if (event.shiftKey) {
                switch (event.keyCode) {
                    case 39:
                        world.cameraYAngleDegrees -= 1;
                        setCameraParams();
                        drawScene();
                        break;
                    case 37:
                        world.cameraYAngleDegrees += 1;
                        setCameraParams();
                        drawScene();
                        break;
                    case 38:
                        world.cameraXAngleDegrees += 1;
                        setCameraParams();
                        drawScene();
                        break;
                    case 40:
                        world.cameraXAngleDegrees -= 1;
                        setCameraParams();
                        drawScene();
                        break;
                }
            } else {
                switch (event.keyCode) {
                    case 39:
                        shift = getShift([3, 0, 0, 0]);
                        world.cameraPosition[0] += shift[0];
                        world.cameraPosition[1] += shift[1];
                        world.cameraPosition[2] += shift[2];
                        setCameraParams();
                        drawScene();
                        break;
                    case 37:
                        shift = getShift([-3, 0, 0, 0]);
                        world.cameraPosition[0] += shift[0];
                        world.cameraPosition[1] += shift[1];
                        world.cameraPosition[2] += shift[2];
                        setCameraParams();
                        drawScene();
                        break;
                    case 38:
                        shift = getShift([0, 0, -(world.zFar - world.zNear) / 400, 0]);
                        world.cameraPosition[0] += shift[0];
                        world.cameraPosition[1] += shift[1];
                        world.cameraPosition[2] += shift[2];
                        setCameraParams();

                        drawScene();
                        break;
                    case 40:
                        shift = getShift([0, 0, (world.zFar - world.zNear) / 400, 0]);
                        world.cameraPosition[0] += shift[0];
                        world.cameraPosition[1] += shift[1];
                        world.cameraPosition[2] += shift[2];

                        setCameraParams();
                        drawScene();
                        break;
                    case 33:
                        // pageup
                        shift = getShift([0, 3, 0, 0]);
                        world.cameraPosition[0] += shift[0];
                        world.cameraPosition[1] += shift[1];
                        world.cameraPosition[2] += shift[2];

                        setCameraParams();
                        drawScene();
                        break;
                    case 34:
                        // pagedown
                        shift = getShift([0, -3, 0, 0]);
                        world.cameraPosition[0] += shift[0];
                        world.cameraPosition[1] += shift[1];
                        world.cameraPosition[2] += shift[2];

                        setCameraParams();
                        drawScene();
                        break;
                }
            }
        });
    }

    // Задаем позицию камеры.
    setCameraParams();
}

/**
 * Пересчитывает матрицу камеры в случае изменения параметров.
 */
function setCameraParams() {
    // Задаем перспективу.
    world.projectionMatrix = m4.perspective(getRadians(world.fieldOfViewDegrees), world.aspect, world.zNear, world.zFar);

    // "Перносим" камеру на нужную позицию
    world.cameraMatrix = m4.identity();
    world.cameraMatrix = m4.translate(world.cameraMatrix, world.cameraPosition[0], world.cameraPosition[1], world.cameraPosition[2]);
    world.cameraMatrix = m4.yRotate(world.cameraMatrix, getRadians(world.cameraYAngleDegrees));
    world.cameraMatrix = m4.xRotate(world.cameraMatrix, getRadians(world.cameraXAngleDegrees));
    world.cameraMatrix = m4.inverse(world.cameraMatrix);

    // let translationMatrix = m4.translation(cameraTranslation[0],cameraTranslation[1],cameraTranslation[2]);
    // translationMatrix = m4.inverse(translationMatrix);
    //
    // let rotationMatrix = m4.xRotation(getRadians(cameraRotation[0]));
    // rotationMatrix = m4.yRotate(rotationMatrix, getRadians(cameraRotation[1]));
    // rotationMatrix = m4.zRotate(rotationMatrix, getRadians(cameraRotation[2]));
    // rotationMatrix = m4.inverse(rotationMatrix);
    //
    //
    // world.cameraMatrix = m4.multiply(world.cameraMatrix, translationMatrix);
    // world.cameraMatrix = m4.multiply(rotationMatrix, world.cameraMatrix);

}