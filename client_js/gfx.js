let modelImport = require("./importModels");
let viewport, camera, scene, renderer, model, controls;
let gfxConfig = {
    mapWidth: 10,
    mapHeight: 20,
}

function setPositionOnGrid(model, x, y) {
    let vector = new THREE.Vector3();
    let phiCoords;
    if (model == gfxConfig.modelChap)
        phiCoords = new THREE.Spherical((gfxConfig.modelWidth * (gfxConfig.greaterDim * 7 / 5) * 2) / (2 * Math.PI) + 0.9, (x + (1 / 5 * gfxConfig.mapWidth)) * (gfxConfig.onedegHorz / 2), y * (gfxConfig.onedegVert));
    else
        phiCoords = new THREE.Spherical((gfxConfig.modelWidth * (gfxConfig.greaterDim * 7 / 5) * 2) / (2 * Math.PI), (x + (1 / 5 * gfxConfig.mapWidth)) * (gfxConfig.onedegHorz / 2), y * (gfxConfig.onedegVert));
    model.position.setFromSpherical(phiCoords);
    // }
    if (model == gfxConfig.modelChap) {
        vector.copy(model.position).multiplyScalar(2);
        model.lookAt(vector);
    }
    else {
        vector.copy(model.position).multiplyScalar(2);
        model.lookAt(vector);
    }
}

function combineMeshes(child1, child2) {
    let ret_scene = new THREE.Scene;
    let mesh = new THREE.Mesh(child1.geometry, child1.material);
    let mesh2 = new THREE.Mesh(child2.geometry, child2.material);
    mesh.position.copy(child1.position);
    mesh2.position.copy(child2.position);
    mesh.scale.copy(child1.scale);
    mesh2.scale.copy(child2.scale);
    ret_scene.add(mesh);
    ret_scene.add(mesh2);
    return ret_scene;
}
// Setup Spherical Grid
function setupSphericalGrid(model) {
    let modelCopy = null;
    model = new THREE.Mesh(model.geometry, model.material);
    model.geometry.computeBoundingBox();
    let boundingBox = model.geometry.boundingBox;
    gfxConfig.modelWidth = boundingBox.max.x - boundingBox.min.x;
    gfxConfig.greaterDim = Math.max(gfxConfig.mapWidth, gfxConfig.mapHeight);
    gfxConfig.onedegVert = (2 * Math.PI) / (gfxConfig.mapHeight);
    gfxConfig.onedegHorz = (2 * Math.PI) / (gfxConfig.mapWidth * 7 / 5);
    for (let i = 1; i <= (gfxConfig.mapWidth); i++) {
        for (let j = 1; j <= gfxConfig.mapHeight; j++) {
            modelCopy = model.clone();
            setPositionOnGrid(modelCopy, i, j);
            scene.add(modelCopy);
        }
    }
}
//
function init() {
    viewport = document.getElementById('gameViewport');
    viewport.width = window.innerWidth;
    viewport.height = window.innerHeight;
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(viewport.width, viewport.height);
    viewport.appendChild(renderer.domElement);
    camera = new THREE.PerspectiveCamera(45, viewport.width / viewport.height, 1, 10000);
    camera.position.set(0, 5, 1.5).setLength(100);
    scene = new THREE.Scene;
    scene.background = new THREE.Color(0xffffff);
    clock = new THREE.Clock();
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0, 0);
    let loadingManger = new THREE.LoadingManager(function () {
        scene.add(model);
    })
    let loader = new THREE.ColladaLoader(loadingManger);
    loader.load('./media/grassBlock.dae', function (collada) {
        model = collada.scene;
        console.log(model);
        model.position.set(0, 0, 0);
        setupSphericalGrid(model.children[1]);
        let basicChappie = modelImport.loadGLTF('./media/Chappies/Lvl0/ChappieLvl0_ThreeJS.gltf', function (modelChap, animations) {
            scene.add(modelChap);
            console.log(modelChap);
            modelChap.rotation.set(0, 0, 0);
            modelChap.updateMatrix();
            gfxConfig.modelChap = modelChap;
            console.log(gfxConfig.modelChap);
            setPositionOnGrid(gfxConfig.modelChap, 5, 5);
            scene.add(gfxConfig.modelChap);
            console.log(animations);
        });
    });


    //
    // lights
    var light = new THREE.DirectionalLight(0xffffff);
    light.position.set(1, 1, 1);
    scene.add(light);
    var light = new THREE.DirectionalLight(0x002288);
    light.position.set(-1, -1, -1);
    scene.add(light);
    var light = new THREE.AmbientLight(0x222222);
    scene.add(light);
    //
    var worldAxis = new THREE.AxesHelper(20);
    scene.add(worldAxis);
    window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
    camera.aspect = viewport.width / viewport.height;
    camera.updateProjectionMatrix();
    renderer.setSize(viewport.width, viewport.height);
}

function animate() {
    requestAnimationFrame(animate);
    render();
}

let x = 1, y = 5;
function render() {
    var delta = clock.getDelta();
    // if (model !== undefined) {
    //     model.rotation.z += delta * 0.5;
    // }
    if (gfxConfig.modelChap != undefined){
        setPositionOnGrid(gfxConfig.modelChap, x, y);
        gfxConfig.modelChap.children[0].rotation.z += 0.1;
    }
    x += 0.1;
    renderer.render(scene, camera);
}

init();
animate();

module.exports.init = init;
module.exports.animate = animate;