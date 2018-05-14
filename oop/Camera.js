class Camera {
    constructor(cameraElement, scene) {
        this.cameraElement = cameraElement;
        this.scene = scene;

        this.aspect = this.scene.gl.canvas.clientWidth / this.scene.gl.canvas.clientHeight;
        this.fieldOfViewDegrees = 60;
        this.zFar = 2000;
        this.zNear = 1;
        this.cameraRotation = [0, 0, 0];
        this.cameraPosition = [0, 0, 0];
        this.navigationType = null;

        this.cameraMatrix = Algebra.identity();
        this.projectionMatrix = undefined;

        this.init();
    }

    init() {
        // Получаем из атрибутов данные или задаем их по умолчанию.
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
                console.log(scene.objects);
                switch (event.keyCode) {
                    case 39:
                        for (let obj of scene.objects) {
                            obj.transform.rotation[1] += Utils.getRadians(5);
                        }
                        scene.drawScene();
                        break;
                    case 37:
                        for (let obj of scene.objects) {
                            obj.transform.rotation[1] -= Utils.getRadians(5);
                        }
                        scene.drawScene();
                        break;
                    case 38:
                        for (let obj of scene.objects) {
                            obj.transform.rotation[0] -= Utils.getRadians(5);
                        }
                        scene.drawScene();
                        break;
                    case 40:
                        for (let obj of scene.objects) {
                            obj.transform.rotation[0] += Utils.getRadians(5);
                        }
                        scene.drawScene();
                        break;
                    case 33:
                        // pageup
                        shift = getShift.apply(this,[0, 0, (this.zFar - this.zNear) / 400, 0]);
                        this.cameraPosition[0] += shift[0];
                        this.cameraPosition[1] += shift[1];
                        this.cameraPosition[2] += shift[2];

                        this.setCameraParams();
                        this.scene.drawScene();
                        break;
                    case 34:
                        // pagedown
                        shift = getShift.apply(this,[0, 0, -(this.zFar - this.zNear) / 400, 0]);
                        this.cameraPosition[0] += shift[0];
                        this.cameraPosition[1] += shift[1];
                        this.cameraPosition[2] += shift[2];

                        this.setCameraParams();
                        this.scene.drawScene();
                        break;
                }

            });
        } else if (world.navigationType === "camera") {
            // Добавление бродящего передвижения к сцене.
            document.addEventListener("keydown", (event) => {
                if (event.shiftKey) {
                    switch (event.keyCode) {
                        case 39:
                            this.cameraRotation[1] -= 1;
                            this.setCameraParams();
                            this.scene.drawScene();
                            break;
                        case 37:
                            this.cameraRotation[1] += 1;
                            this.setCameraParams();
                            this.scene.drawScene();
                            break;
                        case 38:
                            this.cameraRotation[0] += 1;
                            this.setCameraParams();
                            this.scene.drawScene();
                            break;
                        case 40:
                            this.cameraRotation[0] -= 1;
                            this.setCameraParams();
                            this.scene.drawScene();
                            break;
                    }
                } else {
                    switch (event.keyCode) {
                        case 39:
                            shift = getShift.apply(this,[3, 0, 0, 0]);
                            this.cameraPosition[0] += shift[0];
                            this.cameraPosition[1] += shift[1];
                            this.cameraPosition[2] += shift[2];
                            this.setCameraParams();
                            this.scene.drawScene();
                            break;
                        case 37:
                            shift = getShift.apply(this,[-3, 0, 0, 0]);
                            this.cameraPosition[0] += shift[0];
                            this.cameraPosition[1] += shift[1];
                            this.cameraPosition[2] += shift[2];
                            this.setCameraParams();
                            this.scene.drawScene();
                            break;
                        case 38:
                            shift = getShift.apply(this,[0, 0, -(this.zFar - this.zNear) / 400, 0]);
                            this.cameraPosition[0] += shift[0];
                            this.cameraPosition[1] += shift[1];
                            this.cameraPosition[2] += shift[2];
                            this.setCameraParams();
                            this.scene.drawScene();
                            break;
                        case 40:
                            shift = getShift.apply(this,[0, 0, (this.zFar - this.zNear) / 400, 0]);
                            this.cameraPosition[0] += shift[0];
                            this.cameraPosition[1] += shift[1];
                            this.cameraPosition[2] += shift[2];
                            this.setCameraParams();
                            this.scene.drawScene();
                            break;
                        case 33:
                            // pageup
                            shift = getShift.apply(this,[0, 3, 0, 0]);
                            this.cameraPosition[0] += shift[0];
                            this.cameraPosition[1] += shift[1];
                            this.cameraPosition[2] += shift[2];
                            this.setCameraParams();
                            this.scene.drawScene();
                            break;
                        case 34:
                            // pagedown
                            shift = getShift.apply(this,[0, -3, 0, 0]);
                            this.cameraPosition[0] += shift[0];
                            this.cameraPosition[1] += shift[1];
                            this.cameraPosition[2] += shift[2];
                            this.setCameraParams();
                            this.scene.drawScene();
                            break;
                    }
                }
            });
        }

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
}