class Shape {
    /**
     * Инициализирует вершинный шейдер, используя данные из атрибутов тега my-shapeElement.
     *
     * @param shapeElement Ссылка на элемент, с которым мы в данный момент работаем.
     */
    static init(shapeElement, transform) {
        let promise = new Promise(function (resolve, reject) {
            // Инициализируем форму фигуры.
            let figure;
            if (figure = shapeElement.getElementsByTagName("my-indexed-face-set")[0])
                resolve(new IndexedFaceSet(figure));
            else if (figure = shapeElement.getElementsByTagName("my-box")[0])
                resolve(new Box(figure));
            // else if (figure = shapeElement.getElementsByTagName("my-cone")[0])
            //     vertexCount = initCone(figure);
            // else if (figure = shapeElement.getElementsByTagName("my-indexed-face-set")[0])
            //     vertexCount = initSphere(figure);
            else
                reject(new Error("Отсутствует тег, задающий форму"));
        });

        promise.then((shape) => {
            let vertexCount = shape.vertices.length / 3;

            // Инициализируем внешний вид фигуры.
            if (!(shapeElement.getElementsByTagName("my-appearance")[0]))
                throw new Error("Отсутствует обязательный тег my-appearance!");
            let appearance = Appearance.init(shapeElement.getElementsByTagName("my-appearance")[0], vertexCount);

            return {
                transform,
                shape,
                appearance
            }
        }).then(
            // а тут нам нужна ссылка на сцену
        );
    }
}