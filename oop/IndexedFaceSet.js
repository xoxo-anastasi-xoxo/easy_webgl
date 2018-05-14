class IndexedFaceSet {
    constructor(indexedFaceSetElement, func) {
        this.src = "";
        this.indexedFaceSetElement = indexedFaceSetElement;

        this.init();


        console.log(typeof(Worker), typeof(Blob));
        if (typeof(Worker) !== "undefined" && typeof(Blob) !== "undefined") {
            //Браузер пользователя имеет поддержку web worker
            let blobCode = "onmessage = function(e) {\
            \
            importScripts('OBJLoader.js', 'Algebra.js');\
            \
            let modelSource;\
            function getXmlHttp() {\
                            let xmlhttp;\
                            try {\
                                xmlhttp = new ActiveXObject('Msxml2.XMLHTTP');\
                            } catch (e) {\
                                try {\
                                    xmlhttp = new ActiveXObject('Microsoft.XMLHTTP');\
                                } catch (E) {\
                                    xmlhttp = false;\
                                }\
                            }\
                            if (!xmlhttp && typeof XMLHttpRequest !== 'undefined') {\
                                xmlhttp = new XMLHttpRequest();\
                            }\
                            return xmlhttp;\
                        }\
                \
                        (function () {\
                            let xmlhttp = getXmlHttp();\
                            xmlhttp.open('GET', e.data, false);\
                            xmlhttp.send(null);\
                            if (xmlhttp.status === 200) {\
                                modelSource = xmlhttp.responseText;\
                            }\
                        })();\
                        \
                        // Предварительная подготовка данных\
                        if (!modelSource)\
                            throw new Error('Неверно указано имя .obj файла!');\
                        let info = new OBJLoader();\
                        info.parse(modelSource);\
                        let vertices = info.vertices;\
                        let normals = info.normals;\
                        let indices = info.indices;\
                            postMessage({\
                            vertices,\
                            normals,\
                            indices\
                            });\
                            }";

            blobCode = "onmessage = function(e) {" +
                "postMessage({[],[],[]});" +
                "}";

            let blobUrl = new Blob ([blobCode], {type: 'application/javascript'});

            let worker = new Worker(URL.createObjectURL(blobUrl));
            // let worker = new Worker("task.js");
            worker.onmessage = function (e) {
                func(e.data);
            };

            worker.postMessage(this.src); // Start the worker.
        }
        else {
            //Браузер пользователя не поддерживает web worker
            {
                let modelSource;
                let src = this.src;
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
                    xmlhttp.open('GET', src, false);
                    xmlhttp.send(null);
                    if (xmlhttp.status === 200) {
                        modelSource = xmlhttp.responseText;
                    }
                })();

                // Предварительная подготовка данных
                if (!modelSource)
                    throw new Error("Неверно указано имя .obj файла!");
                let info = new OBJLoader();
                info.parse(modelSource);
                let vertices = info.vertices;
                let normals = info.normals;
                let indices = info.indices;

                func({
                    vertices,
                    normals,
                    indices
                });
            }
        }

    }

    init() {
        if (this.indexedFaceSetElement.attributes["model"])
            this.src = this.indexedFaceSetElement.attributes["model"].value;
        else
            throw new Error("Отсутствует путь к 3D модели, ожидаемый в теге my-indexed-face-set!");
    }
}