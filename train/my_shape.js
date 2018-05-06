/**
 * Регистрирует кастомный элемент my-shape.
 */
function registerShape() {
    let myShapeProto = Object.create(HTMLElement.prototype);
    document.registerElement("my-shape", {
        prototype: myShapeProto
    });
}

/**
 * Инициализирует вершинный шейдер, используя данные из атрибутов тега my-shape.
 *
 * @param shape {HTMLElement} Ссылка на элемент, с которым мы в данный момент работаем.
 */
function initShape(shape) {
    // Инициализируем форму фигуры.
    let figure, vertexCount;
    if (figure = shape.getElementsByTagName("my-box")[0])
        vertexCount = initBox(figure);
    // else if (figure = shape.getElementsByTagName("my-indexed-face-set")[0])
    //     vertexCount = initIndexedFaceSet(figure);
    // else if (figure = shape.getElementsByTagName("my-cone")[0])
    //     vertexCount = initCone(figure);
    // else if (figure = shape.getElementsByTagName("my-indexed-face-set")[0])
    //     vertexCount = initSphere(figure);
    else
        throw new Error("Отсутствует тег, задающий форму");

    // Инициализируем внешний вид фигуры.
    let appearance = shape.getElementsByTagName("my-appearance")[0];
    if (appearance)
        initAppearance(appearance, vertexCount);
    else
        throw new Error("Отсутствует обязательный тег my-appearance!");

    // Создаем шейдер.
    world.vertexShader = createShader(world.gl, world.gl.VERTEX_SHADER, world.vertexShaderSource);
    // Создаем программу.
    world.program = createProgram(world.gl, world.vertexShader, world.fragmentShader);
}