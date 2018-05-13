/**
 * Тег my-appearance. Определяет внешний вид фигуры.
 */
class Appearance {
    /**
     * Инициализирует фрагментный шейдер, используя данные из атрибутов тега my-appearance.
     * Запускает инициализацию тега, описывающего внешний вид текущей формы.
     *
     * @param appearance Ссылка на элемент, с которым мы в данный момент работаем.
     * @param {Number} vertexCount Количество вершин, которые необходимо покрасить.
     */
    static init(appearance, vertexCount) {
        // Определяем, какой материал получен и запускаем его инициализацию.
        let material;
        if (material = appearance.getElementsByTagName("my-color")[0])
            return new Color(material, vertexCount);
        else
            throw new Error("Отсутствует тег, задающий внешний вид формы! В тег my-appearance необходимо добавить тег my-color.");
    }
}