/**
 * Тег my-color. Определяет цвет однотонной фигуры.
 */
class Color {
    /**
     * Создает экземпляр Color.
     * Получает атрибут "color" - массив - rgb-цвет (значения в пределах 0..255) - по умолчанию белый
     * @constructor
     * @this  {Color}
     *
     * @param colorElement Ссылка на DOM-элемент, который иллюстрирует этот объект.
     * @param vertexCount {number}
     */
    constructor(colorElement, vertexCount) {
        /**
         * Список цветов вершин фигуры.
         * @type {number[]}
         */
        this.colors = [];

        // Получаем из атрибута данные или задаем их по умолчанию.
        let currentColor = colorElement.attributes["color"] ?
            colorElement.attributes["color"].value.split(" ").map(value => parseInt(value)) : [255, 255, 255];

        // Выполняем проверку полученных данных.
        Utils.checkArrayAttribute(currentColor, "my-color", "color");

        // Задаем цвет для текущей фигуры.
        for (let i = 0; i < vertexCount; ++i) {
            this.colors.push(currentColor[0], currentColor[1], currentColor[2]);
        }
    }
}