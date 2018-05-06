function registerCube() {
    let myCubeProto = Object.create(HTMLElement.prototype);
    document.registerElement("my-cube", {
        prototype: myCubeProto
    });
}

function initCube(cube) {
    // достать атрибуты
    let size = cube.attributes["size"] ?
        cube.attributes["size"].value.split(" ").map(value => parseFloat(value)) : [10, 10, 10];

    console.log(size);

    // построить позишнс
    let x = size[0] / 2;
    let y = size[1] / 2;
    let z = size[2] / 2;

    let positions = [
        // передняя
        -x, y, z,
        -x, -y, z,
        x, -y, z,
        -x, y, z,
        x, -y, z,
        x, y, z,

        // правая
        x, y, z,
        x, -y, z,
        x, -y, -z,
        x, y, z,
        x, -y, -z,
        x, y, -z,

        // задняя
        x, y, -z,
        x, -y, -z,
        -x, -y, -z,
        x, y, -z,
        -x, -y, -z,
        -x, y, -z,

        // левая
        -x, y, -z,
        -x, -y, -z,
        -x, -y, z,
        -x, y, -z,
        -x, -y, z,
        -x, y, z,

        // верхняя
        -x, y, -z,
        -x, y, z,
        x, y, z,
        -x, y, -z,
        x, y, z,
        x, y, -z,

        // нижняя
        -x, -y, -z,
        x, -y, z,
        -x, -y, z,
        -x, -y, -z,
        x, -y, -z,
        x, -y, z,
    ];

    let normals = [
        // передняя
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,

        // правая
        1, 0, 0,
        1, 0, 0,
        1, 0, 0,
        1, 0, 0,
        1, 0, 0,
        1, 0, 0,

        // задняя
        0, 0, -1,
        0, 0, -1,
        0, 0, -1,
        0, 0, -1,
        0, 0, -1,
        0, 0, -1,

        // левая
        -1, 0, 0,
        -1, 0, 0,
        -1, 0, 0,
        -1, 0, 0,
        -1, 0, 0,
        -1, 0, 0,

        // верхняя
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,

        // нижняя
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
    ];

    // запихнуть позишнс в групс
    groups[groups.length - 1].positions = [...groups[groups.length - 1].positions, ...positions];
    groups[groups.length - 1].normals = [...groups[groups.length - 1].normals, ...normals];

    return positions.length / 3;
}