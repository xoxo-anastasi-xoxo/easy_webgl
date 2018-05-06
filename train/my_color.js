function registerColor() {
    let myColorProto = Object.create(HTMLElement.prototype);
    document.registerElement("my-color", {
        prototype: myColorProto
    });
}

function initColor(color, vertexCount) {
    // вынуть цвет
    let currentColor = color.attributes["color"] ?
        color.attributes["color"].value.split(" ").map(value => parseInt(value)) : [0, 0, 0];
    // заполнить массив
    let colors = [];

    for (let i = 0; i < vertexCount; ++i) {
        colors = [...colors, ...currentColor];
    }

    groups[groups.length - 1].colors = [...groups[groups.length - 1].colors, ...colors];
}