let viewport, camera, scene, renderer, model, controls;

// Setup Spherical Grid
function setupSphericalGrid(model) {
    let modelCopy = null;
    model = new THREE.Mesh( model.geometry, model.material );
    let vector = new THREE.Vector3();
    model.rotation.x -= Math.PI / 2;
    console.log(model.isMesh);
    console.log("here");
    for (let i = 0; i < 20; i++) {
        for (let j = 0; j < 20; j++) {
            modelCopy = model.clone();
            let phiCoords = new THREE.Spherical(5, i, j);
            modelCopy.position.setFromSpherical(phiCoords);
            vector.copy( modelCopy.position ).multiplyScalar( 2 );
			modelCopy.lookAt( vector );
            scene.add(modelCopy);
        }
    }
}
//
function init() {
    viewport = document.getElementById('gameViewport');
    viewport.width = window.innerWidth;
    viewport.height = window.innerHeight / 2;
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
    });

    //
    // lights
    var light = new THREE.DirectionalLight(0xffffff);
    light.position.set(1, 1, 1);
    scene.add(light);
    var light = new THREE.DirectionalLight(0x002288);
    light.position.set(- 1, - 1, - 1);
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

function render() {
    var delta = clock.getDelta();
    // if (model !== undefined) {
    //     model.rotation.z += delta * 0.5;
    // }
    renderer.render(scene, camera);
}

module.exports.init = init;
module.exports.animate = animate;