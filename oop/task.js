onmessage = function(e) {
    importScripts('OBJLoader.js', 'Algebra.js');

    let modelSource;
    function getXmlHttp() {
        let xmlhttp;
        try {
            xmlhttp = new ActiveXObject('Msxml2.XMLHTTP');
        } catch (e) {
            try {
                xmlhttp = new ActiveXObject('Microsoft.XMLHTTP');
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
        xmlhttp.open('GET', e.data, false);
        xmlhttp.send(null);
        if (xmlhttp.status === 200) {
            modelSource = xmlhttp.responseText;
        }
    })();

    // Предварительная подготовка данных
    if (!modelSource)
        throw new Error('Неверно указано имя .obj файла!');
    let info = new OBJLoader();
    info.parse(modelSource);
    let vertices = info.vertices;
    let normals = info.normals;
    let indices = info.indices;
    postMessage({
        vertices,
        normals,
        indices
    });
}