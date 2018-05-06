// Регистрация кастомных элементов
registerScene();
registerCamera();
registerTransform();
registerShape();
registerCube();
registerAppearance();
registerColor();
registerDirectedLight();

// Инициализация данными
initScene();

drawScene();

document.addEventListener("keydown", (event) => {
    if (event.shiftKey) {
        switch (event.keyCode) {
            case 39:
                cameraYAngleDegrees += 5;
                setCameraParams();
                drawScene();
                break;
            case 37:
                cameraYAngleDegrees -= 5;
                setCameraParams();
                drawScene();
                break;
            case 38:
                cameraXAngleDegrees += 5;
                setCameraParams();
                drawScene();
                break;
            case 40:
                cameraXAngleDegrees -= 5;
                setCameraParams();
                drawScene();
                break;
        }
    } else {
        switch (event.keyCode) {
            case 39:
                cameraPosition[0] += 5;
                setCameraParams();
                drawScene();
                console.log("стрелка вправо");
                break;
            case 37:
                cameraPosition[0] -= 5;
                setCameraParams();
                drawScene();
                console.log("стрелка влево");
                break;
            case 38:
                cameraPosition[2] -= (zFar - zNear) / 100;
                setCameraParams();
                drawScene();
                console.log("стрелка вверх");
                break;
            case 40:
                cameraPosition[2] += (zFar - zNear) / 100;
                setCameraParams();
                drawScene();
                console.log("стрелка вниз");
                break;
        }
    }
});