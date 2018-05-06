let scene, gl;

function registerScene() {
    let mySceneProto = Object.create(HTMLCanvasElement.prototype);
    document.registerElement("my-scene", {
        prototype: mySceneProto,
        extends: 'canvas'
    });
}

function initScene() {
    scene = document.getElementById("scene");
    scene.width = scene.width || "0";
    scene.height = scene.height || "0";

    gl = scene.getContext("webgl");
    if (!gl)
        throw new Error("В данном браузере недоступен WebGL");
    if (!scene.getElementsByTagName("my-camera").length)
        throw new Error("Отсутствует дочерний элемент - my-camera");

    // Подготовим пространство для отрисовки
    gl.enable(gl.CULL_FACE); // разрешим отрисовку только лицевых треугольников
    gl.enable(gl.DEPTH_TEST); // включим проверку z-индекса

    initCamera(scene);
    initTransform(scene);
    initDirectedLight(scene);
}

function resizeScene() {
    // получаем размер HTML-элемента canvas
    let displayWidth = scene.clientWidth;
    let displayHeight = scene.clientHeight;

    // проверяем, отличается ли размер canvas
    if (scene.width !== displayWidth ||
        scene.height !== displayHeight) {

        // подгоняем размер буфера отрисовки под размер HTML-элемента
        scene.width = displayWidth;
        scene.height = displayHeight;
    }
}