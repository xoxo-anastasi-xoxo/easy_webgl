let world = {
    fragmentShaderSource: " // фрагментные шейдеры не имеют точности по умолчанию, поэтому нам необходимо её\n" +
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
    "  }",
    fragmentShader: undefined,
    vertexShaderSource: "attribute vec4 a_position;\n" +
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
    "    }",
    vertexShader: undefined,
    program: undefined,
    groups: [],
    fieldOfViewDegrees: undefined,
    zNear: undefined,
    zFar: undefined,
    cameraYAngleDegrees: undefined,
    cameraPosition: undefined,
    cameraMatrix: undefined,
    projectionMatrix: undefined,
    aspect: undefined,
    cameraXAngleDegrees: undefined,
    isLightUsed: undefined,
    fonLightColor: undefined,
    directedLightColor: undefined,
    lightDirection: undefined,
    scene: undefined,
    gl: undefined,
};
// Регистрация кастомных элементов.
registerAll();

// Загрузка данных для отрисовки сцены.
initScene();

// Запуск первоначальной прорисовки сцены.
drawScene();

// Добавление простого передвижения к сцене.
document.addEventListener("keydown", (event) => {
    if (event.shiftKey) {
        switch (event.keyCode) {
            case 39:
                world.cameraYAngleDegrees += 5;
                setCameraParams();
                drawScene();
                break;
            case 37:
                world.cameraYAngleDegrees -= 5;
                setCameraParams();
                drawScene();
                break;
            case 38:
                world.cameraXAngleDegrees += 5;
                setCameraParams();
                drawScene();
                break;
            case 40:
                world.cameraXAngleDegrees -= 5;
                setCameraParams();
                drawScene();
                break;
        }
    } else {
        switch (event.keyCode) {
            case 39:
                world.cameraPosition[0] += 3;
                setCameraParams();
                drawScene();
                break;
            case 37:
                world.cameraPosition[0] -= 3;
                setCameraParams();
                drawScene();
                break;
            case 38:
                world.cameraPosition[2] -= (world.zFar - world.zNear) / 400;
                setCameraParams();
                drawScene();
                break;
            case 40:
                world.cameraPosition[2] += (world.zFar - world.zNear) / 400;
                setCameraParams();
                drawScene();
                break;
        }
    }
});