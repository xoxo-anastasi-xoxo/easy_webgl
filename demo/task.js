// Функция, которую Worker запустит, получив сообщение.
onmessage = function (e) {
    // Подключим недостающие модули
    importScripts("../src/easy_webgl.js");

    // Переменная для хранения текста .obj файла.
    let modelSource;

    // Вспомогательная функция, определяющая способ загрузки файла.
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

    // Запрос на синхронное считывание информации из файла.
    (function () {
        let xmlhttp = getXmlHttp();
        xmlhttp.open('GET', e.data, false);
        xmlhttp.send(null);
        if (xmlhttp.status === 200) {
            modelSource = xmlhttp.responseText;
        }
    })();

    // Парсинг модели.
    if (!modelSource)
        throw new Error('Неверно указано имя .obj файла!');
    let info = new OBJLoader();
    info.parse(modelSource);
    let vertices = info.vertices;
    let normals = info.normals;
    let indices = info.indices;

    // Отправка загруженных данных обратно в программу.
    postMessage({
        vertices,
        normals,
        indices
    });
};