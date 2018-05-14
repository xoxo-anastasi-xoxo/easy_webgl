class Transform {
    // получает элемент трансформ и оболочку сцены
    constructor(transformElement, scene, info = {translation: [0, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1]}) {
        this.transformElement = transformElement;
        this.scene = scene;
        this.translation = info.translation;
        this.rotation = info.rotation;
        this.scale = info.scale;

        this.init();
    }

    init() {
        // Получаем из атрибутов данные или задаем их по умолчанию.
        let translation =  this.transformElement.attributes["translation"] ?
            this.transformElement.attributes["translation"].value.split(" ").map(value => parseFloat(value)) : [0, 0, 0];
        let anglesInDegrees =  this.transformElement.attributes["rotation"] ?
            this.transformElement.attributes["rotation"].value.split(" ").map(value => parseFloat(value)) : [0, 0, 0];
        let scale = this.transformElement.attributes["scale"] ?
            this.transformElement.attributes["scale"].value.split(" ").map(value => parseFloat(value)) : [1, 1, 1];

        // Выполняем проверку полученных данных.
        Utils.checkArrayAttribute(translation, "my-transform", "translation");
        Utils.checkArrayAttribute(anglesInDegrees, "my-transform", "rotation");
        Utils.checkArrayAttribute(scale, "my-transform", "scale");

        // Дополняем наши внутренние свойства.
        this.translation[0] += translation[0];
        this.translation[1] += translation[1];
        this.translation[2] += translation[2];

        this.rotation[0] += Utils.getRadians(anglesInDegrees[0]);
        this.rotation[1] += Utils.getRadians(anglesInDegrees[1]);
        this.rotation[2] += Utils.getRadians(anglesInDegrees[2]);

        this.scale[0] += scale[0];
        this.scale[1] += scale[1];
        this.scale[2] += scale[2];

        // Создаем фигур с текущими параметрами.
        for (let trans of this.transformElement.getElementsByTagName("my-transform")) {
            new Transform(trans, this.scene);
        }

        for (let shape of this.transformElement.getElementsByTagName("my-shape")) {
            Shape.init(shape, this, this.scene);
        }
    }

    getMatrix(cameraMatrix, projectionMatrix) {
        let matrix = cameraMatrix;
        matrix = Algebra.translate(matrix, this.translation[0], this.translation[1], this.translation[2]);
        matrix = Algebra.xRotate(matrix, this.rotation[0]);
        matrix = Algebra.yRotate(matrix, this.rotation[1]);
        matrix = Algebra.zRotate(matrix, this.rotation[2]);
        matrix = Algebra.scale(matrix, this.scale[0], this.scale[1], this.scale[2]);
        matrix = Algebra.multiply(projectionMatrix, matrix);

        return matrix;
    }

    getNormalMatrix() {
        let matrix = Algebra.identity();
        matrix = Algebra.translate(matrix, this.translation[0], this.translation[1], this.translation[2]);
        matrix = Algebra.xRotate(matrix, this.rotation[0]);
        matrix = Algebra.yRotate(matrix, this.rotation[1]);
        matrix = Algebra.zRotate(matrix, this.rotation[2]);
        matrix = Algebra.normalFromMat4(matrix);

        return matrix;
    }
}