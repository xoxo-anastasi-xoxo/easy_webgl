// Подключаем возможность работы
let fs = require("fs");

//
let fileContent = fs.readFileSync("input.txt", "utf8");
let arr = fileContent.split("v ");
let arr2 = arr[arr.length - 1].split("f ");
// координаты в числах в массивах по 3
let coordinates = arr.map((value) => value.split(" "));

coordinates[coordinates.length - 1].length = 3;
coordinates.splice(0, 1);

for (let i = 0; i < coordinates.length; ++i) {
    for (let j = 0; j < coordinates[i].length; ++j)
        coordinates[i][j] = parseFloat(coordinates[i][j]);
}


// Теперь преобразуем номера используемых вершин
arr2.splice(0,1);
let order = arr2.map((value) => value.split(" "));

for (let i = 0; i < order.length; ++i) {
    for (let j = 0; j < order[i].length; ++j)
        order[i][j] = parseInt(order[i][j]);
}

console.log(order[1]);

for (let el of order[0]) {

}
