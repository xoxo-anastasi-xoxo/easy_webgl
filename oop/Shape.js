class Shape {
    /**
     * Инициализирует вершинный шейдер, используя данные из атрибутов тега my-shapeElement.
     *
     * @param shapeElement Ссылка на элемент, с которым мы в данный момент работаем.
     */
    static init(shapeElement, transform, scene) {

        // Инициализируем форму фигуры.
        let indexedFaceSetElement = shapeElement.getElementsByTagName("my-indexed-face-set")[0];
        let boxElement = shapeElement.getElementsByTagName("my-box")[0];
        let appearanceElement = shapeElement.getElementsByTagName("my-appearance")[0];

        if (!appearanceElement)
            throw new Error("Отсутствует обязательный тег my-appearance!");

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