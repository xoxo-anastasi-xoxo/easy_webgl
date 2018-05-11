/**
 * Регистрирует кастомный элемент my-indexed-face-set.
 */
function registerIndexedFaceSet() {
    let myIndexedFaceSetProto = Object.create(HTMLElement.prototype);
    document.registerElement("my-indexed-face-set", {
        prototype: myIndexedFaceSetProto
    });
}

/**
 * Инициализирует данные для шедеров, используя атрибуты тега my-indexed-face-set.
 * Задает вершины и нормали, необходимые для отрисовки произвольной фигры на основе треугольников.
 *
 * Получает одномерный массив координат вершин фигуры в атрибуте positions
 * и одномерный массив координат нормалей в атрибуте normals.
 *
 * @param figure {HTMLElement} Ссылка на элемент, с которым мы в данный момент работаем.
 * @returns {number} Количество вершин данной фигуры.
 */
function initIndexedFaceSet(figure) {
    // Получаем из атрибута размеры фигры.
    let positions, normals;
    let modelSource, info;

    if (figure.attributes["model"]) {
        function getXmlHttp() {
            let xmlhttp;
            try {
                xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
            } catch (e) {
                try {
                    xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
                } catch (E) {
                    xmlhttp = false;
                }
            }
            if (!xmlhttp && typeof XMLHttpRequest !== 'undefined') {
                xmlhttp = new XMLHttpRequest();
            }
            return xmlhttp;
        }

        (function () {
            let xmlhttp = getXmlHttp();
            xmlhttp.open('GET', (figure.attributes["model"]).value, false);
            xmlhttp.send(null);
            if (xmlhttp.status === 200) {
                modelSource = xmlhttp.responseText;
                console.log(modelSource[0]);
            }
        })();
        // Предварительная подготовка данных
        // let now = new Date();
        // while (Number(now) + 100 !== new Date) {
        //
        // }
        if (!modelSource)
            throw new Error("Неверно указано имя .obj файла!");
        info = new Mesh(modelSource);
        positions = info.vertices;
        normals = info.vertexNormals;

        let indices = info.indices;
        world.groups[world.groups.length - 1].indices = [...indices];

    } else {
        if (figure.attributes["positions"])
            positions = my_indexed_figure[(figure.attributes["positions"]).value];
        else
            throw new Error("В теге my-indexed-face-set отсутствует атрибут positions!");

        if (figure.attributes["normals"])
            normals = my_indexed_figure[(figure.attributes["normals"]).value];
        else
            throw new Error("В теге my-indexed-face-set отсутствует атрибут normals!");

    }

    // Передаем данные в сцену.
    world.groups[world.groups.length - 1].positions = [...world.groups[world.groups.length - 1].positions, ...positions];
    world.groups[world.groups.length - 1].normals = [...world.groups[world.groups.length - 1].normals, ...normals];

    return (positions.length / 3);
}