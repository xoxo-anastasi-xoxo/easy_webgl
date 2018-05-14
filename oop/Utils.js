/**
 * Класс вспомогательных функций.
 */
class Utils {
    /**
     * Перевод из градусов в радианы.
     *
     * @param angle {number} Угол в градусах.
     * @returns {number} Угол в радианах.
     */
    static getRadians(angle) {
        return angle * Math.PI / 180;
    }

    /**
     * Проверка значения на принадлежность к множеству массивов из трех вещественных чисел.
     * Бросает исключение в случае не принадлежности.
     *
     * @param value Проверяемое значение.
     * @param tagName {string} Имя тега, откуда значение пришло.
     * @param attributeName {string} Имя атрибута, откуда значение пришло.
     */
    static checkArrayAttribute(value, tagName, attributeName) {
        if (value.length !== 3 || !Utils.checkNumber(value[0]) || !Utils.checkNumber(value[1]) || !Utils.checkNumber(value[2]))
            throw new Error("Ошибка при задании атрибута " + attributeName + " тега " + tagName +
                ". Данный атрибут должен принимать значения \"x y z\", где x, y, z - это вещественные числа.");
    }

    /**
     * Проверка значения на принадлежность к вещественным числам.
     * Бросает исключение в случае не принадлежности.
     *
     * @param value Проверяемое значение.
     * @param tagName {string} Имя тега, откуда значение пришло.
     * @param attributeName {string} Имя атрибута, откуда значение пришло.
     */
    static checkNumberAttribute(value, tagName, attributeName) {
        if (!Utils.checkNumber(value))
            throw new Error("Ошибка при задании атрибута " + attributeName + " тега " + tagName +
                ". Данный атрибут должен принимать значения \"x\", где x - это вещественное число.");
    }

    /**
     * Проверка значения на принадлежность к вещественным числам.
     *
     * @param value Проверяемое значение.
     * @returns {boolean} Флаг принадлежности к вещественным числам.
     */
    static checkNumber(value) {
        return !(value !== value || typeof value === "undefined" || (typeof value === "object" && !value));
    }
}