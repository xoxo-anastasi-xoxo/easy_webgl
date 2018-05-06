let isLightUsed;
let fonLightColor, directedLightColor, lightDirection;

function registerDirectedLight() {
    let myDirectedLightProto = Object.create(HTMLElement.prototype);
    document.registerElement("my-directed-light", {
        prototype: myDirectedLightProto
    });
}

function initDirectedLight(scene) {
    let light = scene.getElementsByTagName("my-directed-light")[0];
    isLightUsed = !!light;
    console.log(isLightUsed);

    fonLightColor = [0.15, 0.15, 0.15];
    directedLightColor = [.9, .9, .9];
    lightDirection = [0, 0, -1];

    if (isLightUsed) {
        fonLightColor = light.attributes["fon-light-color"] ?
            light.attributes["fon-light-color"].value.split(" ").map(value => parseFloat(value)).map(value => value / 255) : fonLightColor;
        directedLightColor = light.attributes["directed-light-color"] ?
            light.attributes["directed-light-color"].value.split(" ").map(value => parseFloat(value)).map(value => value / 255) : directedLightColor;
        lightDirection = light.attributes["direction"] ?
            light.attributes["direction"].value.split(" ").map(value => parseFloat(value)) : lightDirection;

        m4.normalize(lightDirection);

        lightDirection[0] *= -1;
        lightDirection[1] *= -1;
        lightDirection[2] *= -1;

        let x = lightDirection[0];
        let y = lightDirection[1];
        let z = lightDirection[2];
        let len = x*x + y*y + z*z;
        if (len > 0) {
            len = 1 / Math.sqrt(len);
            lightDirection[0] = x * len;
            lightDirection[1] = y * len;
            lightDirection[2] = z * len;
        }
    }
}