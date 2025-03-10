/**
 * Регистрируем кастомный элемент my-directed-light.
 */
function registerDirectedLight() {
    let myDirectedLightProto = Object.create(HTMLElement.prototype);
    document.registerElement("my-directed-light", {
        prototype: myDirectedLightProto
    });
}

/**
 * Инициализирует данные для шедеров, используя атрибуты тега my-directed-light.
 * Определяет есть ли направленное освещение на нашей сцене.
 *
 * Если есть устанавливает параметры этого освещения:
 *      - атрибут "fon-light-color" - массив - rgb-цвет фонового освещения (значения в пределах 0..255)
 *                                  - по умолчанию "38.25 38.25 38.25";
 *      - атрибут "directed-light-color" - массив - rgb-цвет направленного освещения(значения в пределах 0..255)
 *                                  - по умолчанию "229.5 229.5 229.5";
 *      - атрибут "direction" - массив - направление направленного освещения - по умолчанию "0, 0, -1".
 *
 * @param scene {HTMLElement} Текущая сцена.
 */
function initDirectedLight(scene) {
    // Узанем есть ли в текущей сцене направленный свет.
    let light = scene.getElementsByTagName("my-directed-light")[0];
    world.isLightUsed = !!light;

    // Задаем необходимым параметрам значения по умолчанию.
    world.fonLightColor = [0.15, 0.15, 0.15];
    world.directedLightColor = [.9, .9, .9];
    world.lightDirection = [0, 0, -1];

    // Если свет есть меняем данные согласно атрибутам.
    if (world.isLightUsed) {
        world.fonLightColor = light.attributes["fon-light-color"] ?
            light.attributes["fon-light-color"].value.split(" ").map(value => parseFloat(value)).map(value => value / 255)
            : world.fonLightColor;
        world.directedLightColor = light.attributes["directed-light-color"] ?
            light.attributes["directed-light-color"].value.split(" ").map(value => parseFloat(value)).map(value => value / 255)
            :  world.directedLightColor;
        world.lightDirection = light.attributes["direction"] ?
            light.attributes["direction"].value.split(" ").map(value => parseFloat(value)) :  world.lightDirection;

        // Выполняем проверку полученных данных.
        checkArrayAttribute(world.fonLightColor, "my-directed-light", "fon-light-color");
        checkArrayAttribute(world.directedLightColor, "my-directed-light", "directed-light-color");
        checkArrayAttribute(world.lightDirection, "my-directed-light", "direction");

        // Нармализуем вектор направления света.
        world.lightDirection = m4.normalize(world.lightDirection);

        // Получим вектор, обратный вектору направления света.
        world.lightDirection[0] *= -1;
        world.lightDirection[1] *= -1;
        world.lightDirection[2] *= -1;
    }
}