class DirectedLight {
    constructor(directedLightElement, scene) {
        this.directedLightElement = directedLightElement;
        this.scene = scene;

        // Задаем необходимым параметрам значения по умолчанию.
        this.fonLightColor = [100, 100, 100].map(value => value / 255);
        this.directedLightColor = [200, 200, 200].map(value => value / 255);
        this.lightDirection = [0, 0, -1];

        this.init();
    }

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