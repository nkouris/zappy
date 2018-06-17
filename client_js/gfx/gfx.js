let modelImport = require("./importModels");
let viewport, camera, scene, renderer, model, controls;
let gfxConfig = {
    mapWidth: 0,
    mapHeight: 0,
    timeInterval: 0,
    teams: {},
    players: {}
}
function addPlanetLandSphere() {
    var geometry = new THREE.SphereGeometry((gfxConfig.modelWidth * (gfxConfig.greaterDim * 7 / 5) * 2) / (2 * Math.PI) + 0.5, 32, 32)
    var material = new THREE.MeshPhongMaterial({
        color: "#89FA05",
        alphaTest: 0.5
    })
    var earthMesh = new THREE.Mesh(geometry, material)
    scene.add(earthMesh)
}

function setPositionOnGrid(model, x, y) {
    let vector = new THREE.Vector3();
    let phiCoords;
    if (model.name == "Scene")
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
    addPlanetLandSphere();
    for (let i = 1; i <= (gfxConfig.mapWidth); i++) {
        for (let j = 1; j <= gfxConfig.mapHeight; j++) {
            modelCopy = model.clone();
            setPositionOnGrid(modelCopy, i, j);
            scene.add(modelCopy);
        }
    }
}
function addSkyBox() {
    /*
        ** SET UP SKYBOX (CUBE INSIDE BACKGROUND)
        */
    var imagePrefix = "media/images/sky-";
    var directions = ["xpos", "xneg", "ypos", "yneg", "zpos", "zneg"];
    var imageSuffix = ".png";
    var skyGeometry = new THREE.BoxGeometry(10000, 10000, 10000);

    var materialArray = [];
    for (var i = 0; i < 6; i++)
        materialArray.push(new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture(imagePrefix + directions[i] + imageSuffix),
            side: THREE.BackSide
        }));
    var skyMaterial = new THREE.MeshFaceMaterial(materialArray);
    var skyBox = new THREE.Mesh(skyGeometry, skyMaterial);
    scene.add(skyBox);
}
function loadAllModels(fx) {
    viewport = document.getElementById('gameViewport');
    viewport.width = window.innerWidth;
    viewport.height = window.innerHeight;
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(viewport.width, viewport.height);
    viewport.appendChild(renderer.domElement);
    camera = new THREE.PerspectiveCamera(45, viewport.width / viewport.height, 1, 10000);
    camera.position.set(0, 5, 1.5).setLength(100);
    module.exports.scene = scene = new THREE.Scene;
    scene.background = new THREE.Color(0xffffff);
    clock = new THREE.Clock();
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0, 0);
    let loadingManger = new THREE.LoadingManager(function () {
        scene.add(model);
    })
    let loader = new THREE.ColladaLoader(loadingManger);
    addSkyBox();
    loader.load('./media/grassBlock.dae', function (collada) {
        model = collada.scene;
        console.log(model);
        model.position.set(0, 0, 0);
        let basicChappie = modelImport.loadGLTF('./media/Chappies/Lvl0/ChappieLvl0_ThreeJS.gltf', function (modelChap, animations) {
            gfxConfig.modelChap = modelChap;
            scene.add(gfxConfig.modelChap);
            fx();
        });
    });
}
function init() {
    setupSphericalGrid(model.children[1]);
    setPositionOnGrid(gfxConfig.modelChap, 1, 1);
    //
    // lights
    var light = new THREE.DirectionalLight(0xffffff);
    light.intensity = 0.2;
    light.position.set(5, 5, 5);
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

function drawPlayers() {
    let player = null;
    for (let playerid in gfxConfig.players) {
        player = gfxConfig.players[playerid];
        player.moveTowardLoc(gfxConfig.delta, gfxConfig.timeInterval);
        setPositionOnGrid(player.model, player.loc.x + 1, player.loc.y + 1);
    }
}

function onWindowResize() {
    camera.aspect = viewport.width / viewport.height;
    camera.updateProjectionMatrix();
    renderer.setSize(viewport.width, viewport.height);
}
prevTime = performance.now();
function animate() {
    gfxConfig.delta = (performance.now() - prevTime) / 1000;
    prevTime = performance.now();
    requestAnimationFrame(animate);
    render();
}

let x = 1, y = 1;
function render() {
    var delta = clock.getDelta();
    // if (model !== undefined) {
    //     model.rotation.z += delta * 0.5;
    // }
    drawPlayers();
    // if (gfxConfig.modelChap != undefined) {
    //     setPositionOnGrid(gfxConfig.modelChap, x, y);
    //     gfxConfig.modelChap.children[0].rotation.z += 0.1;
    // }
    // y += 0.1;
    renderer.render(scene, camera);
}
module.exports.init = init;
module.exports.animate = animate;
module.exports.config = gfxConfig;
module.exports.loadify = loadAllModels;
module.exports.setPositionOnGrid = setPositionOnGrid;