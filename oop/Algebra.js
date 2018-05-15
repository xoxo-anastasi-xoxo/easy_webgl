/**
 * Класс вспомогательных алгебраических функций, совершающий операции над матрицами 4*4 и векторами 3.
 */
class Algebra {
    /**
     * Создает матрицу переноса.
     * @param tx {number} Перенос по оси X.
     * @param ty {number} Перенос по оси Y.
     * @param tz {number} Перенос по оси Z.
     * @returns {number[]} Матрица переноса.
     */
    static translation(tx, ty, tz) {
        return [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            tx, ty, tz, 1,
        ];
    }

    /**
     * Создает матрицу поворота по оси X.
     * @param angleInRadians {number} Угол поворота в радианах по оси X.
     * @returns {number[]} Матрица поворота.
     */
    static xRotation(angleInRadians) {
        let c = Math.cos(angleInRadians);
        let s = Math.sin(angleInRadians);

        return [
            1, 0, 0, 0,
            0, c, s, 0,
            0, -s, c, 0,
            0, 0, 0, 1,
        ];
    }

    /**
     * Создает матрицу поворота по оси Y.
     * @param angleInRadians {number} Угол поворота в радианах по оси Y.
     * @returns {number[]} Матрица поворота.
     */
    static yRotation(angleInRadians) {
        let c = Math.cos(angleInRadians);
        let s = Math.sin(angleInRadians);

        return [
            c, 0, -s, 0,
            0, 1, 0, 0,
            s, 0, c, 0,
            0, 0, 0, 1,
        ];
    }

    /**
     * Создает матрицу поворота по оси Z.
     * @param angleInRadians {number} Угол поворота в радианах по оси Z.
     * @returns {number[]} Матрица поворота.
     */
    static zRotation(angleInRadians) {
        let c = Math.cos(angleInRadians);
        let s = Math.sin(angleInRadians);

        return [
            c, s, 0, 0,
            -s, c, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1,
        ];
    }

    /**
     * Создает матрицу масштабирования.
     * @param sx {number} Масштаб по оси X.
     * @param sy {number} Масштаб по оси Y.
     * @param sz {number} Масштаб по оси Z.
     * @returns {number[]} Матрица масштабирования.
     */
    static scaling(sx, sy, sz) {
        return [
            sx, 0, 0, 0,
            0, sy, 0, 0,
            0, 0, sz, 0,
            0, 0, 0, 1,
        ];
    }

    /**
     * Выполняет перенос матрицы на заданные значения.
     * @param m {number[]} Исходная матрица
     * @param tx {number} Перенос по оси X.
     * @param ty {number} Перенос по оси Y.
     * @param tz {number} Перенос по оси Z.
     * @returns {number[]} Результирующая матрица.
     */
    static translate(m, tx, ty, tz) {
        return Algebra.multiply(m, Algebra.translation(tx, ty, tz));
    }

    /**
     * Выполняет поворот матрицы по оси X.
     * @param m {number[]} Исходная матрица.
     * @param angleInRadians {number} Угол поворота по оси X в радианах.
     * @returns {number[]} Результирующая матрица.
     */
    static xRotate(m, angleInRadians) {
        return Algebra.multiply(m, Algebra.xRotation(angleInRadians));
    }

    /**
     * Выполняет поворот матрицы по оси Y.
     * @param m {number[]} Исходная матрица.
     * @param angleInRadians {number} Угол поворота по оси Y в радианах.
     * @returns {number[]} Результирующая матрица.
     */
    static yRotate(m, angleInRadians) {
        return Algebra.multiply(m, Algebra.yRotation(angleInRadians));
    }

    /**
     * Выполняет поворот матрицы по оси Z.
     * @param m {number[]} Исходная матрица.
     * @param angleInRadians {number} Угол поворота по оси Z в радианах.
     * @returns {number[]} Результирующая матрица.
     */
    static zRotate(m, angleInRadians) {
        return Algebra.multiply(m, Algebra.zRotation(angleInRadians));
    }

    /**
     * Выполняет масшабирование матрицы на заданные параметры.
     * @param m {number[]} Исходная матрица
     * @param sx {number} Масштабирование по оси X.
     * @param sy {number} Масштабирование по оси Y.
     * @param sz {number} Масштабирование по оси Z.
     * @returns {number[]} Результирующая матрица.
     */
    static scale(m, sx, sy, sz) {
        return Algebra.multiply(m, Algebra.scaling(sx, sy, sz));
    }

    /**
     * Создает матрицу перспективы по заданным параметрам.
     * @param fieldOfViewInRadians {number} Угол отображения области видимости в радианах.
     * @param aspect {number} Отношение ширины сцены к высоте.
     * @param near {number} Наименьший индекс, видимый камере, по Z.
     * @param far {number} Наибольший индекс, видимый камере, по Z.
     * @returns {number[]} Матрица перспективы.
     */
    static perspective(fieldOfViewInRadians, aspect, near, far) {
        let f = Math.tan(Math.PI * 0.5 - 0.5 * fieldOfViewInRadians);
        let rangeInv = 1.0 / (near - far);

        return [
            f / aspect, 0, 0, 0,
            0, f, 0, 0,
            0, 0, (near + far) * rangeInv, -1,
            0, 0, near * far * rangeInv * 2, 0
        ];
    }

    /**
     * Перемножает две матрицы в обратном порядке.
     * @param b {number[]} Матрица-правый множитель.
     * @param a {number[]} Матрица-левый множитель.
     * @returns {number[]} Результат матричного умножения.
     */
    static multiply(b, a) {
        let result = [];

        for (let i = 0; i < a.length / 4; i++) {
            let row = [];
            for (let j = 0; j < (b.length / 4); j++) {
                let sum = 0;
                for (let t = 0; t < 4; t++)
                    sum += a[4 * i + t] * b[(b.length / 4) * t + j];
                row.push(sum);
            }
            result = [...result, ...row];
        }

        return result;
    }

    /**
     * Создает единичную матрицу.
     * @returns {number[]} Единичная матрица.
     */
    static identity() {
        return [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ];
    }

    /**
     * Создает обратную матрицу.
     * @param m {number[]} Исходная матрица.
     * @returns {number[]} Матрица обратная исходной.
     */
    static inverse(m) {
        let m00 = m[0 * 4 + 0];
        let m01 = m[0 * 4 + 1];
        let m02 = m[0 * 4 + 2];
        let m03 = m[0 * 4 + 3];
        let m10 = m[1 * 4 + 0];
        let m11 = m[1 * 4 + 1];
        let m12 = m[1 * 4 + 2];
        let m13 = m[1 * 4 + 3];
        let m20 = m[2 * 4 + 0];
        let m21 = m[2 * 4 + 1];
        let m22 = m[2 * 4 + 2];
        let m23 = m[2 * 4 + 3];
        let m30 = m[3 * 4 + 0];
        let m31 = m[3 * 4 + 1];
        let m32 = m[3 * 4 + 2];
        let m33 = m[3 * 4 + 3];
        let tmp_0 = m22 * m33;
        let tmp_1 = m32 * m23;
        let tmp_2 = m12 * m33;
        let tmp_3 = m32 * m13;
        let tmp_4 = m12 * m23;
        let tmp_5 = m22 * m13;
        let tmp_6 = m02 * m33;
        let tmp_7 = m32 * m03;
        let tmp_8 = m02 * m23;
        let tmp_9 = m22 * m03;
        let tmp_10 = m02 * m13;
        let tmp_11 = m12 * m03;
        let tmp_12 = m20 * m31;
        let tmp_13 = m30 * m21;
        let tmp_14 = m10 * m31;
        let tmp_15 = m30 * m11;
        let tmp_16 = m10 * m21;
        let tmp_17 = m20 * m11;
        let tmp_18 = m00 * m31;
        let tmp_19 = m30 * m01;
        let tmp_20 = m00 * m21;
        let tmp_21 = m20 * m01;
        let tmp_22 = m00 * m11;
        let tmp_23 = m10 * m01;

        let t0 = (tmp_0 * m11 + tmp_3 * m21 + tmp_4 * m31) -
            (tmp_1 * m11 + tmp_2 * m21 + tmp_5 * m31);
        let t1 = (tmp_1 * m01 + tmp_6 * m21 + tmp_9 * m31) -
            (tmp_0 * m01 + tmp_7 * m21 + tmp_8 * m31);
        let t2 = (tmp_2 * m01 + tmp_7 * m11 + tmp_10 * m31) -
            (tmp_3 * m01 + tmp_6 * m11 + tmp_11 * m31);
        let t3 = (tmp_5 * m01 + tmp_8 * m11 + tmp_11 * m21) -
            (tmp_4 * m01 + tmp_9 * m11 + tmp_10 * m21);

        let d = 1.0 / (m00 * t0 + m10 * t1 + m20 * t2 + m30 * t3);

        return [
            d * t0,
            d * t1,
            d * t2,
            d * t3,
            d * ((tmp_1 * m10 + tmp_2 * m20 + tmp_5 * m30) -
                (tmp_0 * m10 + tmp_3 * m20 + tmp_4 * m30)),
            d * ((tmp_0 * m00 + tmp_7 * m20 + tmp_8 * m30) -
                (tmp_1 * m00 + tmp_6 * m20 + tmp_9 * m30)),
            d * ((tmp_3 * m00 + tmp_6 * m10 + tmp_11 * m30) -
                (tmp_2 * m00 + tmp_7 * m10 + tmp_10 * m30)),
            d * ((tmp_4 * m00 + tmp_9 * m10 + tmp_10 * m20) -
                (tmp_5 * m00 + tmp_8 * m10 + tmp_11 * m20)),
            d * ((tmp_12 * m13 + tmp_15 * m23 + tmp_16 * m33) -
                (tmp_13 * m13 + tmp_14 * m23 + tmp_17 * m33)),
            d * ((tmp_13 * m03 + tmp_18 * m23 + tmp_21 * m33) -
                (tmp_12 * m03 + tmp_19 * m23 + tmp_20 * m33)),
            d * ((tmp_14 * m03 + tmp_19 * m13 + tmp_22 * m33) -
                (tmp_15 * m03 + tmp_18 * m13 + tmp_23 * m33)),
            d * ((tmp_17 * m03 + tmp_20 * m13 + tmp_23 * m23) -
                (tmp_16 * m03 + tmp_21 * m13 + tmp_22 * m23)),
            d * ((tmp_14 * m22 + tmp_17 * m32 + tmp_13 * m12) -
                (tmp_16 * m32 + tmp_12 * m12 + tmp_15 * m22)),
            d * ((tmp_20 * m32 + tmp_12 * m02 + tmp_19 * m22) -
                (tmp_18 * m22 + tmp_21 * m32 + tmp_13 * m02)),
            d * ((tmp_18 * m12 + tmp_23 * m32 + tmp_15 * m02) -
                (tmp_22 * m32 + tmp_14 * m02 + tmp_19 * m12)),
            d * ((tmp_22 * m22 + tmp_16 * m02 + tmp_21 * m12) -
                (tmp_20 * m12 + tmp_23 * m22 + tmp_17 * m02))
        ];
    }

    /**
     * Преобразует матрицу вида(4*4) в нормальную матрицу(3*3).
     *
     * @param a {number[]} Исходная матрица вида.
     * @returns {number[]} Нормальная матрица для исходной.
     */
    static normalFromMat4(a) {
        let out = [
            0, 0, 0,
            0, 0, 0,
            0, 0, 0
        ];

        let a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
        let a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
        let a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
        let a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

        let b00 = a00 * a11 - a01 * a10;
        let b01 = a00 * a12 - a02 * a10;
        let b02 = a00 * a13 - a03 * a10;
        let b03 = a01 * a12 - a02 * a11;
        let b04 = a01 * a13 - a03 * a11;
        let b05 = a02 * a13 - a03 * a12;
        let b06 = a20 * a31 - a21 * a30;
        let b07 = a20 * a32 - a22 * a30;
        let b08 = a20 * a33 - a23 * a30;
        let b09 = a21 * a32 - a22 * a31;
        let b10 = a21 * a33 - a23 * a31;
        let b11 = a22 * a33 - a23 * a32;

        // Подсчет детерминанта
        let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

        if (!det) {
            return null;
        }
        det = 1.0 / det;

        out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
        out[1] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
        out[2] = (a10 * b10 - a11 * b08 + a13 * b06) * det;

        out[3] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
        out[4] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
        out[5] = (a01 * b08 - a00 * b10 - a03 * b06) * det;

        out[6] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
        out[7] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
        out[8] = (a30 * b04 - a31 * b02 + a33 * b00) * det;

        return out;
    }

    /**
     * Нормирует исходный вектор.
     * @param v {number[]} Исходный вектор.
     * @returns {number[]} Нормированный вектор.
     */
    static normalize(v) {
        let length = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
        // Проверяем, что мы не делим на 0.
        if (length > 0.00001) {
            return [v[0] / length, v[1] / length, v[2] / length];
        } else {
            return [0, 0, 0];
        }
    }
}