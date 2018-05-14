/**
 * Тег my-indexed-face-set. Определяет произвольную форму на сцене.
 */
class IndexedFaceSet {
    /**
     * Создает экземпляр IndexedFaceSet.
     * @constructor
     * @this  {IndexedFaceSet}
     *
     * @param indexedFaceSetElement Ссылка на DOM-элемент, который иллюстрирует этот объект.
     * @param func {Function} Функция-колбэк, которая должна оповестить об окончании загрузки данных фигуры.
     */
    constructor(indexedFaceSetElement, func) {
        // Определим все неодходимые поля.
        /**
         * Путь к модели, которую будет отрисовывать данный объект.
         * @type {string}
         */
        this.src = "";
        /**
         * Ссылка на DOM-элемент, который иллюстрирует этот объект.
         */
        this.indexedFaceSetElement = indexedFaceSetElement;

        // Запустим инициализацию полей атрибутами.
        this.init();

        // Запустим асинхронную загрузку полей данного объекта.
        if (typeof(Worker) !== "undefined") {
            //Браузер пользователя имеет поддержку web worker
            let worker = new Worker("task.js");
            worker.onmessage = function (e) {
                func(e.data);
            };
            worker.postMessage(this.src);
        }
        else {
            //Браузер пользователя не поддерживает web worker
            {
                // Переменная для хранения текста .obj файла.
                let modelSource;
                // Переменная для хранения пути к .obj файлу.
                let src = this.src;
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
                    xmlhttp.open('GET', src, false);
                    xmlhttp.send(null);
                    if (xmlhttp.status === 200) {
                        modelSource = xmlhttp.responseText;
                    }
                })();

                // Парсинг файла формата .obj
                if (!modelSource)
                    throw new Error("Неверно указано имя .obj файла!");
                let info = new OBJLoader();
                info.parse(modelSource);
                let vertices = info.vertices;
                let normals = info.normals;
                let indices = info.indices;

                // Вызыв колбэка, оповещающего об окончании загрузки.
                func({
                    vertices,
                    normals,
                    indices
                });
            }
        }

    }

    /**
     * Инициализирует объект, используя данные атрибутов.
     *
     * Получает путь к .obj файлу - модели, которую необходимо отрендерить, через атрибут model.
     */
    init() {
        // Получаем путь к модели, которую необходимо отрендерить, через атрибут model.
        if (this.indexedFaceSetElement.attributes["model"])
            this.src = this.indexedFaceSetElement.attributes["model"].value;
        else
            throw new Error("Отсутствует путь к 3D модели, ожидаемый в теге my-indexed-face-set!");
    }
}