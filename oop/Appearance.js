/**
 * Тег my-appearance. Определяет внешний вид фигуры.
 */
class Appearance {
    /**
     * Запускает инициализацию тега, описывающего цвет текущей формы.
     *
     * @param appearanceElement Ссылка на элемент, с которым мы в данный момент работаем.
     * @param {Number} vertexCount Количество вершин, которые необходимо покрасить.
     */
    static init(appearanceElement, vertexCount) {
        // Определяем, какой материал получен и запускаем его инициализацию.
        let material;
        if (material = appearanceElement.getElementsByTagName("my-color")[0])
            return new Color(material, vertexCount);
        else
            throw new Error("Отсутствует тег, задающий внешний вид формы! В тег my-appearance необходимо добавить тег my-color.");
    }
}