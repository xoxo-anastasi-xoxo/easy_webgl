// Регистрация кастомных элементов.
registerAll();

// Загрузка данных для отрисовки сцены.
initScene();

// Запуск первоначальной прорисовки сцены.
drawScene();

// Добавление простого передвижения к сцене.
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
                cameraPosition[0] += 3;
                setCameraParams();
                drawScene();
                break;
            case 37:
                cameraPosition[0] -= 3;
                setCameraParams();
                drawScene();
                console.log("стрелка влево");
                break;
            case 38:
                cameraPosition[2] -= (zFar - zNear) / 400;
                setCameraParams();
                drawScene();
                break;
            case 40:
                cameraPosition[2] += (zFar - zNear) / 400;
                setCameraParams();
                drawScene();
                break;
        }
    }
});