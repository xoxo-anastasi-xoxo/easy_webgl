let fragmentShaderSource = " // фрагментные шейдеры не имеют точности по умолчанию, поэтому нам необходимо её\n" +
    "  // указать. mediump подойдёт для большинства случаев. Он означает \"средняя точность\"\n" +
    "  precision mediump float;\n" +
    "\n" +
    "  varying vec4 v_color;\n" +
    "  varying vec3 v_light;\n" +
    "\n" +
    "uniform vec3 u_reverseLightDirection;\n" +
    "\n" +
    "  void main() {\n" +
    "   gl_FragColor = vec4(v_color.rgb * v_light, v_color.a);\n" +
    "  }";
let fragmentShader;

/**
 * Регистрирует кастомный элемент my-appearance.
 */
function registerAppearance() {
    let myAppearanceProto = Object.create(HTMLElement.prototype);
    document.registerElement("my-appearance", {
        prototype: myAppearanceProto
    });
}

/**
 * Регистрирует кастомный элемент my-appearance.
 *
 * @param {HTMLElement} appearance Ссылка на элемент, с которым мы в данный момент работаем.
 * @param {Number} vertexCount Количество вершин, которые необходимо покрасить.
 */
function initAppearance(appearance, vertexCount) {
    // Определяем, какой материал получен.
    let material;
    if (material = appearance.getElementsByTagName("my-color")[0])
        initColor(material, vertexCount);
    else if (material = appearance.getElementsByTagName("my-texture")[0])
        initTexture(material, vertexCount);
    else
        throw new Error("Отсутствует тег, задающий внешний вид формы! В тег my-appearance необходимо добавить тег my-color или my-texture.");

    // Создаем фрагментный шейдер.
    fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
}