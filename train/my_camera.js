let fieldOfViewDegrees, zNear, zFar, cameraYAngleDegrees;
let cameraPosition;
let cameraMatrix, projectionMatrix;
let aspect;
let cameraXAngleDegrees;

function getRadians(angle) {
    return angle * Math.PI / 180;
}

function registerCamera() {
    let myCameraProto = Object.create(HTMLElement.prototype);
    document.registerElement("my-camera", {
        prototype: myCameraProto
    });
}

function initCamera(scene) {
    aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    let camera = scene.getElementsByTagName("my-camera")[0];

    // Достанем данные из атрибутов
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
    setCameraParams();
}

function setCameraParams() {
    projectionMatrix = m4.perspective(getRadians(fieldOfViewDegrees), aspect, zNear, zFar);

    cameraMatrix = m4.yRotation(getRadians(-cameraYAngleDegrees));
    cameraMatrix = m4.xRotate(cameraMatrix, getRadians(-cameraXAngleDegrees));
    cameraMatrix = m4.translate(cameraMatrix, -cameraPosition[0], -cameraPosition[1], -cameraPosition[2]);
}