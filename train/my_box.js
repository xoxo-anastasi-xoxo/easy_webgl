/**
 * Регистрирует кастомный элемент my-box.
 */
function registerBox() {
    let myCubeProto = Object.create(HTMLElement.prototype);
    document.registerElement("my-cube", {
        prototype: myCubeProto
    });
}

/**
 * Инициализирует данные для шедеров, используя атрибуты тега my-box.
 * Задает вершины и нормали, необходимые для отрисовки прямоугольного параллелепипеда.
 *
 * Из атрибута size вида массив получаются размеры параллелепипеда по соответствующим сторонам.
 * По умолчанию size="10 10 10".
 * Центр прямоугольного параллепипеда совпадает с началом координат.
 *
 * @param cube {HTMLElement} Ссылка на элемент, с которым мы в данный момент работаем.
 * @returns {number} Количество вершин данной фигуры.
 */
function initBox(cube) {
    // Получаем из атрибута размеры фигры или задаем их по умолчанию.
    let size = cube.attributes["size"] ?
        cube.attributes["size"].value.split(" ").map(value => parseFloat(value)) : [10, 10, 10];

    // Выполняем проверку полученных данных.
    checkArrayAttribute(size, "my-cube", "size");

    // Задаем координаты нашей фигуры.
    let x = size[0] / 2;
    let y = size[1] / 2;
    let z = size[2] / 2;

    let positions = [
        // передняя
        -x, y, z,
        -x, -y, z,
        x, -y, z,
        -x, y, z,
        x, -y, z,
        x, y, z,

        // правая
        x, y, z,
        x, -y, z,
        x, -y, -z,
        x, y, z,
        x, -y, -z,
        x, y, -z,

        // задняя
        x, y, -z,
        x, -y, -z,
        -x, -y, -z,
        x, y, -z,
        -x, -y, -z,
        -x, y, -z,

        // левая
        -x, y, -z,
        -x, -y, -z,
        -x, -y, z,
        -x, y, -z,
        -x, -y, z,
        -x, y, z,

        // верхняя
        -x, y, -z,
        -x, y, z,
        x, y, z,
        -x, y, -z,
        x, y, z,
        x, y, -z,

        // нижняя
        -x, -y, -z,
        x, -y, z,
        -x, -y, z,
        -x, -y, -z,
        x, -y, -z,
        x, -y, z,
    ];

    // Задаем нормали для нашей фигуры.
    let normals = [
        // передняя
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,

        // правая
        1, 0, 0,
        1, 0, 0,
        1, 0, 0,
        1, 0, 0,
        1, 0, 0,
        1, 0, 0,

        // задняя
        0, 0, -1,
        0, 0, -1,
        0, 0, -1,
        0, 0, -1,
        0, 0, -1,
        0, 0, -1,

        // левая
        -1, 0, 0,
        -1, 0, 0,
        -1, 0, 0,
        -1, 0, 0,
        -1, 0, 0,
        -1, 0, 0,

        // верхняя
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,

        // нижняя
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
    ];

    // Передаем данные в сцену.
    world.groups[world.groups.length - 1].positions = [...world.groups[world.groups.length - 1].positions, ...positions];
    world.groups[world.groups.length - 1].normals = [...world.groups[world.groups.length - 1].normals, ...normals];

    return positions.length / 3;
}