/**
 * Регистрируем кастомный элемент my-color.
 */
function registerColor() {
    let myColorProto = Object.create(HTMLElement.prototype);
    document.registerElement("my-color", {
        prototype: myColorProto
    });
}

/**
 * Инициализирует данные для шедеров, используя атрибуты тега my-color.
 * Задает цвет, необходимый для отрисовки текущей фигуры.
 *
 * Получает атрибут "color" - массив - rgb-цвет (значения в пределах 0..255) - по умолчанию Черный
 *
 * @param color {HTMLElement} Ссылка на элемент, с которым мы в данный момент работаем.
 * @param vertexCount {Number} Количество вершин фигуры, которуб необходимо залить цветом.
 */
function initColor(color, vertexCount) {
    // Получаем из атрибута данные или задаем их по умолчанию.
    let currentColor = color.attributes["color"] ?
        color.attributes["color"].value.split(" ").map(value => parseInt(value)) : [0, 0, 0];

    // Выполняем проверку полученных данных.
    checkArrayAttribute(currentColor, "my-color", "color");

    // Задаем цвет для текущей фигуры.
    // Передаем данные в сцену.
    for (let i = 0; i < vertexCount; ++i) {
        world.groups[world.groups.length - 1].colors.push(currentColor[0], currentColor[1], currentColor[2]);
    }
}