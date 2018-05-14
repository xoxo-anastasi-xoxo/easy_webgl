/**
 * Тег my-shape. Определяет геометрию.
 */
class Shape {
    /**
     * Запускает асинхронную инициализацию дочерних элементов.
     *
     * @param shapeElement Ссылка на DOM-элемент, который иллюстрирует этот объект.
     * @param transform {Transform} Данные о положении фигуры в пространстве сцены.
     * @param scene {Scene} Трехмерная сцена, в которой определен объект.
     */
    static init(shapeElement, transform, scene) {
        // Инициализируем форму фигуры и ее внешний вид.
        let indexedFaceSetElement = shapeElement.getElementsByTagName("my-indexed-face-set")[0];
        let boxElement = shapeElement.getElementsByTagName("my-box")[0];
        let appearanceElement = shapeElement.getElementsByTagName("my-appearance")[0];

        // Проверяем наличие обязательного элемента.
        if (!appearanceElement)
            throw new Error("Отсутствует обязательный тег my-appearance!");

        // Формируем колбек для асинхронной загрузки.
        function func(shape) {
            let promise = new Promise(function (resolve, reject) {
                resolve({
                    transform,
                    shape,
                    appearance: Appearance.init(appearanceElement, shape.vertices.length / 3)
                })
            });

            promise.then(value => {
                scene.addObject(value)
            })
        }

        // Запускаем асинхронную загрузку найденного дочернего элемента.
        let promise;
        if (indexedFaceSetElement)
            promise = new Promise(function () {
                new IndexedFaceSet(indexedFaceSetElement, func);
            });
        else if (boxElement)
            promise = new Promise(function () {
                    new Box(boxElement, func);
            });
        else
            throw new Error("Отсутствует тег, задающий форму");

        promise.then();
    }
}