function loadGLTF(filePath, fx) {
    let imp = {};
    // Instantiate a loader
    var loader = new THREE.GLTFLoader();

    // Load a glTF resource
    loader.load(
        // resource URL
        filePath,
        // called when the resource is loaded
        function (gltf) {
            imp.model = gltf.scene;
            imp.animations = gltf.animations;
            fx(imp.model, imp.animations);
            // gltf.animations; // Array<THREE.AnimationClip>
            // gltf.scene; // THREE.Scene
            // gltf.scenes; // Array<THREE.Scene>
            // gltf.cameras; // Array<THREE.Camera>
            // gltf.asset; // Object

        },
        // called when loading is in progresses
        function (xhr) {

            console.log((xhr.loaded / xhr.total * 100) + '% loaded');

        },
        // called when loading has errors
        function (error) {
            console.log('An error happened');
        }
    );
}

module.exports.loadGLTF = loadGLTF;
// 'media/Chappies/Lvl0/ChappieLvl0_ThreeJS.gltf'