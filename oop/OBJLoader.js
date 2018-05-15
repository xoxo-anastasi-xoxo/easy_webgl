/**
 * Парсер файлов формата .obj.
 */
class OBJLoader {
    /**
     * Создает экземпляр OBJLoader.
     * @constructor
     * @this  {OBJLoader}
     */
    constructor() {
        // Данные необходимые к загрузке.
        /**
         * Массив вершин загружаемой модели.
         * @type {number[]}
         */
        this.vertices = [];
        /**
         * Массив нормалей загружаемой модели.
         * @type {number[]}
         */
        this.normals = [];
        /**
         * Массив индексов поверхностей загружаемой модели.
         * @type {number[]}
         */
        this.indices = [];
    }

    /**
     *  По заданным индексам поверхностей и вершинам формирует массив нормалей.
     */
    calculateNormals() {
        // Если необходимые исходные данные не определены - не делать ничего.
        if (!(this.vertices.length && this.indices.length))
            return;

        // Число нормалей эквивалентно числу вершин в фигуре.
        this.normals = new Array(this.vertices.length);
        // Идем по массиву поверхностей и для вершин каждой поверхности считаем нормаль.
        for (let i = 0; i < this.indices.length; i += 3) {
            // Определим два вектора, принадлежащих поверхности.
            let v1 = [
                this.vertices[this.indices[i + 2] * 3] - this.vertices[this.indices[i + 1] * 3],
                this.vertices[this.indices[i + 2] * 3 + 1] - this.vertices[this.indices[i + 1] * 3 + 1],
                this.vertices[this.indices[i + 2] * 3 + 2] - this.vertices[this.indices[i + 1] * 3 + 2]
            ];
            let v2 = [
                this.vertices[this.indices[i] * 3] - this.vertices[this.indices[i + 1] * 3],
                this.vertices[this.indices[i] * 3 + 1] - this.vertices[this.indices[i + 1] * 3 + 1],
                this.vertices[this.indices[i] * 3 + 2] - this.vertices[this.indices[i + 1] * 3 + 2]
            ];
            // Найдем их векторное произведение.
            let result = [
                v1[1] * v2[2] - v1[2] * v2[1],
                v1[2] * v2[0] - v1[0] * v2[2],
                v1[0] * v2[1] - v1[1] * v2[0]
            ];
            // Нормализуем полученный вектор.
            result = Algebra.normalize(result);

            // Заполним нужные элементы массива нормалей результатом.
            this.normals[this.indices[i] * 3] = result[0];
            this.normals[this.indices[i] * 3 + 1] = result[1];
            this.normals[this.indices[i] * 3 + 2] = result[2];

            this.normals[this.indices[i + 1] * 3] = result[0];
            this.normals[this.indices[i + 1] * 3 + 1] = result[1];
            this.normals[this.indices[i + 1] * 3 + 2] = result[2];

            this.normals[this.indices[i + 2] * 3] = result[0];
            this.normals[this.indices[i + 2] * 3 + 1] = result[1];
            this.normals[this.indices[i + 2] * 3 + 2] = result[2];
        }
    }

    /**
     * Преобразует текстовое представление .obj файла в массив вершин, нормалей и индексов.
     * @param objectData {string} Текстовое представление .obj файла.
     */
    parse(objectData) {
        let self = this;
        /*
        .obj формат содержит три типа важных нам строк:
          * 'v': строка определяющая вершину (имеет вид "v 1.23 4.5 6" или "v 1.23 4.5 6 7");
          * 'vn': строка определяющая нормаль (имеет вид "vn 0.001 -0.001 0.99");
          * 'f': строка определяющая поверхность.
                 Может принимать один из следующих видов:
            f 16/92/11 14/101/22 1/69/1 - даны и вершина, и текстура, и нормаль
            f 16//11 14//22 1//1 - даны вершина и нормаль
            f 16/92 14/101 1/69 - даны вершина и текстура
            f 16 14 1 - дана только вершина

            На выходе:
            Массив индексов поверхностей будет содержать данные о том, какую точку и нормаль использовать.
            Массив индексов - это плоский массив, где каждые три элемента образуют треугольник.
            К примеру: треугольник, которому в массиве индексов соответствуют числа 3, 5, 15 - это
            треугольник которому для отрисовки нобходимо взять вершины под индексами 3, 5, 15 и нормали
            под теми же номерами.
       */

        // Временный пул всех данных.
        const verticesList = [];
        const normalsList = [];
        const unpacked = {};

        // Итоговые массивы данных.
        unpacked.verts = [];
        unpacked.norms = [];
        unpacked.indices = [];
        // Ассоциативный массив для переиспользования пар вершина нормаль.
        unpacked.heshes = {};

        // Регулярные выражения для определения типа строки.
        const VERTEX_RE = /^v\s/;
        const NORMAL_RE = /^vn\s/;
        const FACE_RE = /^f\s/;
        const WHITESPACE_RE = /\s+/;
        const all_meaning_re = [VERTEX_RE, NORMAL_RE, FACE_RE];

        // Массив строк нашей модели.
        const lines = objectData.split("\n");

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();

            // Отбрасываем все неподходящие строки.
            if (!line || line.startsWith("#") || !all_meaning_re.some((re) => re.test(line))) {
                continue;
            }

            // Делим строку по пробелу и получаем массив необходимых нам значений
            const elements = line.split(WHITESPACE_RE);
            elements.shift();

            if (VERTEX_RE.test(line)) {
                // Обрабатываем вершину.
                elements.length = 3; // т.к. иногда вершина может содержать дополнительную, ненужную нам информацию.
                verticesList.push(...(elements).map(value => parseFloat(value)));
            } else if (NORMAL_RE.test(line)) {
                // Обрабатываем нормаль.
                normalsList.push(...(elements).map(value => parseFloat(value)));
            } else if (FACE_RE.test(line)) {
                // Обрабатываем поверхность.
                let current;

                let newElements = [];

                // Если поверхность не треугольник,
                // то предтавляем ее как массив треугольников, добавляя недостающие вершины.
                for (let k = 2; k < elements.length; ++k) {
                    newElements.push(elements[0], elements[k-1], elements[k]);
                }

                for (let j = 0; j < newElements.length; ++j) {

                    let data = newElements[j].split('/');

                    if (data.length > 2) {
                        let hash = data[0] + "/" + data[2];
                        if (unpacked.heshes[hash]) {
                            current = unpacked.heshes[hash];
                        } else {
                            current = parseInt(unpacked.verts.length / 3);

                            unpacked.verts.push(
                                verticesList[(parseInt(data[0]) - 1) * 3],
                                verticesList[(parseInt(data[0]) - 1) * 3 + 1],
                                verticesList[(parseInt(data[0]) - 1) * 3 + 2]
                            );

                            unpacked.norms.push(
                                normalsList[(parseInt(data[2]) - 1) * 3],
                                normalsList[(parseInt(data[2]) - 1) * 3 + 1],
                                normalsList[(parseInt(data[2]) - 1) * 3 + 2]
                            );

                            unpacked.heshes[hash] = current;
                        }
                    } else {
                        current = parseInt(unpacked.verts.length / 3);

                        unpacked.verts.push(
                            verticesList[(parseInt(data[0]) - 1) * 3],
                            verticesList[(parseInt(data[0]) - 1) * 3 + 1],
                            verticesList[(parseInt(data[0]) - 1) * 3 + 2]
                        );
                    }
                    unpacked.indices.push(current);
                }
            }
        }

        self.vertices = unpacked.verts;
        self.normals = unpacked.norms;
        self.indices = unpacked.indices;

        // Если в нашей модели были поверхности, не содержащие информации о нормалях, -
        // пересчитаем все нормали.
        if (self.vertices.length !== self.normals.length)
            this.calculateNormals(self.vertices, self.indices);
    }
}