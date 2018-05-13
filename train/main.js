// Глобальный объект, олицетворяющий наш 3D мир.
let world = {
    fragmentShaderSource:
    "  precision mediump float;\
    \
      varying vec4 v_color;\
     varying vec3 v_light;\
    \
    uniform vec3 u_reverseLightDirection;\
    \
      void main() {\
       gl_FragColor = vec4(v_color.rgb * v_light, v_color.a);\
      }",
    fragmentShader: undefined,
    vertexShaderSource: "attribute vec4 a_position;\
       attribute vec4 a_color;\
       attribute vec3 a_normal;\
    \
       uniform mat4 u_matrix;\
       uniform mat3 u_normal_matrix;\
       uniform vec3 u_fon_light_color;\
       uniform vec3 u_light_direction;\
       uniform vec3 u_directed_light_color;\
       uniform int u_use_light;\
    \
       varying vec4 v_color;\
       varying vec3 v_light;\
    \
       void main() {\
         gl_Position = u_matrix * a_position;\
    \
         v_color = a_color;\
    \
         if (u_use_light == 0) {\
           v_light = vec3(1,1,1);\
         } else {\
           vec3 transformedNormal = u_normal_matrix * a_normal;\
    \
           float directed_light_weight = max(dot(transformedNormal, u_light_direction), 0.0);\
    \
           v_light = u_fon_light_color + u_directed_light_color * directed_light_weight;\
    }\
        }",
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
    navigationType:undefined
};

// Регистрация кастомных элементов.
registerAll();

// Загрузка данных для отрисовки сцены.
initScene();

// Запуск первоначальной прорисовки сцены.
drawScene();