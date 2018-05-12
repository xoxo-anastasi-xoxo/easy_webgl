let fragmentShader;

/**
 * Регистрирует кастомный элемент my-appearance.
 */
function registerAppearance() {
    let myAppearanceProto = Object.create(HTMLElement.prototype);
    document.registerElement("my-appearance", {
        prototype: myAppearanceProto
    });
}

/**
 * Инициализирует фрагментный шейдер, используя данные из атрибутов тега my-appearance.
 * Запускает инициализацию тега, описывающего внешний вид текущей формы.
 *
 * @param {HTMLElement} appearance Ссылка на элемент, с которым мы в данный момент работаем.
 * @param {Number} vertexCount Количество вершин, которые необходимо покрасить.
 */
function initAppearance(appearance, vertexCount) {
    console.log("app start")

    // Определяем, какой материал получен и запускаем его инициализацию.
    let material;
    if (material = appearance.getElementsByTagName("my-color")[0])
        initColor(material, vertexCount);
    else if (material = appearance.getElementsByTagName("my-texture")[0])
        initTexture(material, vertexCount);
    else
        throw new Error("Отсутствует тег, задающий внешний вид формы! В тег my-appearance необходимо добавить тег my-color или my-texture.");

    // Создаем фрагментный шейдер.
    world.fragmentShader = createShader(world.gl, world.gl.FRAGMENT_SHADER, world.fragmentShaderSource);
    console.log("app done")

}