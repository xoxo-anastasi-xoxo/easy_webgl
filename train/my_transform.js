let groups = [];

/**
 * Регистрирует кастомный элемент my-transform.
 */
function registerTransform() {
    let myTransformProto = Object.create(HTMLElement.prototype);
    document.registerElement("my-transform", {
        prototype: myTransformProto
    });
}

/**
 * Инициализирует данные для шедеров, используя атрибуты тега my-transform.
 */
function initTransform() {
    // По порядку инициализируем данными все группы фигур.
    for (let group of scene.getElementsByTagName("my-transform")) {

        // Получаем из атрибутов данные или задаем их по умолчанию.
        let translation = group.attributes["translation"] ?
            group.attributes["translation"].value.split(" ").map(value => parseFloat(value)) : [0, 0, 0];
        let anglesInDegrees = group.attributes["rotation"] ?
            group.attributes["rotation"].value.split(" ").map(value => parseFloat(value)) : [0, 0, 0];
        let scale = group.attributes["scale"] ?
            group.attributes["scale"].value.split(" ").map(value => parseFloat(value)) : [1, 1, 1];

        // Выполняем проверку полученных данных.
        checkArrayAttribute(translation, "my-transform", "translation");
        checkArrayAttribute(anglesInDegrees, "my-transform", "rotation");
        checkArrayAttribute(scale, "my-transform", "scale");

        // Создаем группу фигур с текущими параметрами.
        groups.push({
            translation,
            anglesInDegrees,
            scale,
            anglesInRadians: () => anglesInDegrees.map(value => value * Math.PI / 180),
            positions: [],
            colors: [],
            normals: [],
            getMatrix: function () {
                let matrix = m4.translation(this.translation[0],  this.translation[1],  this.translation[2]);
                matrix = m4.xRotate(matrix, this.anglesInRadians()[0]);
                matrix = m4.yRotate(matrix, this.anglesInRadians()[1]);
                matrix = m4.zRotate(matrix, this.anglesInRadians()[2]);
                matrix = m4.scale(matrix, this.scale[0],  this.scale[1],  this.scale[2]);
                matrix = m4.multiply(matrix, cameraMatrix);
                matrix = m4.multiply(projectionMatrix, matrix);

                return matrix;
            },
            getNormalMatrix: function () {
                let matrix = m4.translation(this.translation[0],  this.translation[1],  this.translation[2]);
                matrix = m4.xRotate(matrix, this.anglesInRadians()[0]);
                matrix = m4.yRotate(matrix, this.anglesInRadians()[1]);
                matrix = m4.zRotate(matrix, this.anglesInRadians()[2]);
                matrix = m4.scale(matrix, this.scale[0],  this.scale[1],  this.scale[2]);
                matrix = m4.multiply(matrix, cameraMatrix);

                return matrix;
            }
        });

        // Добавляем данные каждой фигуры из группы.
        for (let child of group.children) {
            initShape(child);
        }
    }
}