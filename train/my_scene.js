let scene, gl;

/**
 * Регистрирует кастомный элемент my-scene.
 */
function registerScene() {
    let mySceneProto = Object.create(HTMLCanvasElement.prototype);
    document.registerElement("my-scene", {
        prototype: mySceneProto,
        extends: 'canvas'
    });
}

/**
 * Инициализирует данные для шедеров, используя атрибуты тега my-scene.
 * Проверяет наличие обязательных тегов.
 * Запускает инициализацию Камеры, Света и всех фигур сцены.
 */
function initScene() {
    // Получаем ссылку на сцену.
    scene = document.getElementById("scene");
    scene.width = scene.width || "0";
    scene.height = scene.height || "0";

    // Задаем для нее графический контекст.
    gl = scene.getContext("webgl");
    if (!gl)
        throw new Error("В данном браузере недоступен WebGL");

    // Проверяем на наличие камеры.
    if (!scene.getElementsByTagName("my-camera").length)
        throw new Error("Отсутствует дочерний элемент - my-camera");

    // Подготовим пространство для отрисовки
    gl.enable(gl.CULL_FACE); // разрешим отрисовку только лицевых треугольников
    gl.enable(gl.DEPTH_TEST); // включим проверку z-индекса

    // Запускаем инициализацию дерева элемнтов.
    initCamera(scene);
    initTransform(scene);
    initDirectedLight(scene);
}

/**
 * Подгоняем размер canvas под экран
 */
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