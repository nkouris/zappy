let board = [[], []];
const colors = ["0xc06c84", "0xfdffab", "0xc51350", "0xffe8d5", "0xff4057", "0x4bc2c5", "0xacbd86"];
let $colorTiles = document.getElementsByClassName("colorTile");
for (let i = 0; i < $colorTiles.length; i++) {
    $colorTiles[i].style.backgroundColor = "#" + colors[i % 7].slice(2);
    $colorTiles[i].children[0].innerHTML = $colorTiles[i].id;
    console.log("#" + colors[i % 7].slice(2));
    console.log($colorTiles);
}

let $quantsSpans = document.getElementsByClassName("quants");
function displayResources(x, y) {
    for (let i = 0; i < $quantsSpans.length; i++)
        $quantsSpans[i].innerHTML = board[x][y].quantities[i];
}
module.exports.colors = colors;
module.exports.board = board;
module.exports.display = displayResources;