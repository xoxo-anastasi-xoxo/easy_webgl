/**
 * Тег my-color. Определяет цвет однотонной фигуры.
 */
class Color {
    /**
     * Инициализирует данные для шедеров, используя атрибуты тега my-color.
     * Задает цвет, необходимый для отрисовки текущей фигуры.
     *
     * Получает атрибут "color" - массив - rgb-цвет (значения в пределах 0..255) - по умолчанию Белый
     *
     * @param color Ссылка на элемент, с которым мы в данный момент работаем.
     * @param vertexCount {Number} Количество вершин фигуры, которуб необходимо залить цветом.
     */
    constructor(color, vertexCount) {
        this.colors = [];

        // Получаем из атрибута данные или задаем их по умолчанию.
        let currentColor = color.attributes["color"] ?
            color.attributes["color"].value.split(" ").map(value => parseInt(value)) : [255, 255, 255];

        // Выполняем проверку полученных данных.
        Utils.checkArrayAttribute(currentColor, "my-color", "color");

        // Задаем цвет для текущей фигуры.
        for (let i = 0; i < vertexCount; ++i) {
            this.colors.push(currentColor[0], currentColor[1], currentColor[2]);
        }
    }
}