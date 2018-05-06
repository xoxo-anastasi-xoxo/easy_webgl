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

function registerAppearance() {
    let myAppearanceProto = Object.create(HTMLElement.prototype);
    document.registerElement("my-appearance", {
        prototype: myAppearanceProto
    });
}

// узнать что за фигура и запушить ее координаты в последний элемент из групс
function initAppearance(appearance, vertexCount) {
    // определить кто внутри и запустить инициализацию
    let material;
    if (material = appearance.getElementsByTagName("my-color")[0])
        initColor(material, vertexCount);
    // else if (material = appearance.getElementsByTagName("my-texture")[0])
    //     initTexture(material, vertexCount);
    else
        throw new Error("Отсутствует тег, задающий внешний вид формы!");

    // Фрашментный шейдер
    fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
}