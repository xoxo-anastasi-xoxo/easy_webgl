const vertexShaderSource = "attribute vec4 a_position;\n" +
    "   attribute vec4 a_color;\n" +
    "   attribute vec3 a_normal;\n" +
    "\n" +
    "   uniform mat4 u_matrix;\n" +
    "   uniform mat4 u_normal_matrix;\n" +
    "   uniform vec3 u_fon_light_color;\n" +
    "   uniform vec3 u_light_direction;\n" +
    "   uniform vec3 u_directed_light_color;\n" +
    "   uniform int u_use_light;\n" +
    "\n" +
    "   varying vec4 v_color;\n" +
    "   varying vec3 v_light;\n" +
    "\n" +
    "   void main() {\n" +
    "     gl_Position = u_matrix * a_position;\n" +
    "\n" +
    "     v_color = a_color;\n" +
    "\n" +
    "     if (u_use_light == 0) {\n" +
    "       v_light = vec3(1,1,1);\n" +
    "     } else {\n" +
    "       vec3 transformedNormal = mat3(u_normal_matrix) * a_normal;\n" +
    "\n" +
    "       float directed_light_weight = max(dot(transformedNormal, u_light_direction), 0.0);\n" +
    "\n" +
    "       v_light = u_fon_light_color + u_directed_light_color * directed_light_weight;\n" +
    "}\n" +
    "    }";

let vertexShader;
let program;

function registerShape() {
    let myShapeProto = Object.create(HTMLElement.prototype);
    document.registerElement("my-shape", {
        prototype: myShapeProto
    });
}

// инит получает ссылку на ноду my-shape
function initShape(shape) {

    let figure, vertexCount;
    if (figure = shape.getElementsByTagName("my-box")[0])
        vertexCount = initCube(figure);
    // else if (figure = shape.getElementsByTagName("my-indexed-face-set")[0])
    //     vertexCount = initIndexedFaceSet(figure);
    // else if (figure = shape.getElementsByTagName("my-cone")[0])
    //     vertexCount = initCone(figure);
    // else if (figure = shape.getElementsByTagName("my-indexed-face-set")[0])
    //     vertexCount = initSphere(figure);
    else
        throw new Error("Отсутствует тег, задающий форму");

    let appearance = shape.getElementsByTagName("my-appearance")[0];
    if (appearance)
        initAppearance(appearance, vertexCount);
    else
        throw new Error("Отсутствует обязательный тег my-appearance!");


    // Создаем шейдер
    vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    // Создаем программу
    program = createProgram(gl, vertexShader, fragmentShader);
}