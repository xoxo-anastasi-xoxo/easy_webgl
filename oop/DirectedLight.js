/**
 * Тег my-directed-light. Определяет направленный свет для трехмерной сцены.
 */
class DirectedLight {
    /**
     * Создает экземпляр DirectedLight.
     * @constructor
     * @this  {DirectedLight}
     *
     * @param directedLightElement Ссылка на DOM-элемент, который иллюстрирует этот объект.
     * @param scene {Scene} Трехмерная сцена, в которой определен объект.
     */
    constructor(directedLightElement, scene) {
        // Определим все неодходимые поля.
        /**
         * Ссылка на DOM-элемент, который иллюстрирует этот объект.
         */
        this.directedLightElement = directedLightElement;
        /**
         * Трехмерная сцена, в которой определен объект.
         * @type {Scene}
         */
        this.scene = scene;

        /**
         * Цвет фонового освещения.
         * @type {number[]}
         */
        this.fonLightColor = [100, 100, 100].map(value => value / 255);
        /**
         * Цвет направленного освещения.
         * @type {number[]}
         */
        this.directedLightColor = [200, 200, 200].map(value => value / 255);
        /**
         * Направление света.
         * @type {number[]}
         */
        this.lightDirection = [0, 0, -1];

        // Запустим инициализацию полей атрибутами.
        this.init();
    }

    /**
     * Инициализирует объект, используя данные атрибутов.
     *
     * Если есть устанавливает параметры этого освещения:
     *      - атрибут "fon-light-color" - массив - rgb-цвет фонового освещения (значения в пределах 0..255)
     *                                  - по умолчанию "100 100 100";
     *      - атрибут "directed-light-color" - массив - rgb-цвет направленного освещения(значения в пределах 0..255)
     *                                  - по умолчанию "200 200 200";
     *      - атрибут "direction" - массив - направление направленного освещения - по умолчанию "0, 0, -1".
     */
    init() {
        if (this.directedLightElement.attributes["fon-light-color"])
            this.fonLightColor =
                this.directedLightElement.attributes["fon-light-color"].value.split(" ").map(value => parseFloat(value)).map(value => value / 255);
        if (this.directedLightElement.attributes["directed-light-color"])
            this.directedLightColor =
                this.directedLightElement.attributes["directed-light-color"].value.split(" ").map(value => parseFloat(value)).map(value => value / 255);
        if (this.directedLightElement.attributes["direction"])
            this.lightDirection =
                this.directedLightElement.attributes["direction"].value.split(" ").map(value => parseFloat(value));


        // Выполняем проверку полученных данных.
        Utils.checkArrayAttribute(this.fonLightColor, "my-directed-light", "fon-light-color");
        Utils.checkArrayAttribute(this.directedLightColor, "my-directed-light", "directed-light-color");
        Utils.checkArrayAttribute(this.lightDirection, "my-directed-light", "direction");

        // Нармализуем вектор направления света.
        this.lightDirection = Algebra.normalize(this.lightDirection);

        // Получим вектор, обратный вектору направления света.
        this.lightDirection[0] *= -1;
        this.lightDirection[1] *= -1;
        this.lightDirection[2] *= -1;
    }
}