const gfx = require("./gfx");
var selectedObject;
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
let pclickedObj = {
    tile: null,
    chappie: null
};
function onclick(event) {
    event.preventDefault();

    mouse.x = (event.clientX / gfx.renderer.domElement.clientWidth) * 2 - 1;
    mouse.y = - (event.clientY / gfx.renderer.domElement.clientHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, gfx.camera);
    var intersects = raycaster.intersectObjects(gfx.scene.children, true); //array
    if (intersects.length > 0) {
        selectedObject = intersects[0];
        console.log(selectedObject);
        if (selectedObject.object.callback != undefined) {
            if(selectedObject.object.name == "tile"){
                if (pclickedObj.tile != undefined)
                    pclickedObj.tile.material.color.setHex("0xFFFFFF");
                pclickedObj.tile = selectedObject.object;
            }else if(selectedObject.object.name == "chappie"){
                if (pclickedObj.chappie != undefined){
                    pclickedObj.chappie.parent.children[0].material.color.setHex(gfx.config.teams[gfx.config.players[pclickedObj.chappie.playerId].team]);
                    pclickedObj.chappie.parent.children[1].material.color.setHex(gfx.config.teams[gfx.config.players[pclickedObj.chappie.playerId].team]);
                    pclickedObj.chappie.parent.children[0].material.wireframe = false;
                    pclickedObj.chappie.parent.children[1].material.wireframe = false;
                }
                pclickedObj.chappie = selectedObject.object;
            }
            selectedObject.object.callback();
            module.exports.pclickedObj = pclickedObj;
        }
    }
}

module.exports.onclick = onclick;