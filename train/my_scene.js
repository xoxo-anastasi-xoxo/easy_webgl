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
    world.scene = document.getElementById("scene");
    world.scene.width = world.scene.width || "0";
    world.scene.height = world.scene.height || "0";

    // Задаем для нее графический контекст.
    world.gl = world.scene.getContext("webgl");
    if (!world.gl)
        throw new Error("В данном браузере недоступен WebGL");

    // Проверяем на наличие камеры.
    if (!world.scene.getElementsByTagName("my-camera").length)
        throw new Error("Отсутствует дочерний элемент - my-camera");

    // Подготовим пространство для отрисовки
    world.gl.enable(world.gl.CULL_FACE); // разрешим отрисовку только лицевых треугольников
    world.gl.enable(world.gl.DEPTH_TEST); // включим проверку z-индекса

    // Запускаем инициализацию дерева элемнтов.
    initCamera(world.scene);
    initTransform(world.scene);
    initDirectedLight(world.scene);
}

/**
 * Подгоняем размер canvas под экран
 */
function resizeScene() {
    // получаем размер HTML-элемента canvas
    let displayWidth = world.scene.clientWidth;
    let displayHeight = world.scene.clientHeight;

    // проверяем, отличается ли размер canvas
    if (world.scene.width !== displayWidth ||
        world.scene.height !== displayHeight) {

        // подгоняем размер буфера отрисовки под размер HTML-элемента
        world.scene.width = displayWidth;
        world.scene.height = displayHeight;
    }
}