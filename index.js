// Scene and Camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 50;

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Orbital Controls
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.listenToKeyEvents(window); // optional
controls.addEventListener('change', render); // call this only in static scenes (i.e., if there is no animation loop)

// Debugging
const gui = new dat.GUI();
const debug = true;

// Cube Materials
const colours = [0xc41e3a, 0x009e60, 0x0051ba, 0xff5800, 0xffd500, 0xffffff];
const faceMaterials = colours.map(function(c) {
  return new THREE.MeshBasicMaterial({ color: c });
});
const cubeMaterials = new THREE.MeshFaceMaterial(faceMaterials);

// Create  the Rubik's cube
const spacing = 0.1;
const increment = 3 + spacing;
const allCubes = [];

function newCube(x, y, z) {
  const cubeGeometry = new THREE.BoxGeometry(3, 3, 3);
  const cube = new THREE.Mesh(cubeGeometry, cubeMaterials);
  cube.castShadow = true;
  cube.position.set(x, y, z);
  cube.rubikPosition = cube.position.clone();

  scene.add(cube);
  allCubes.push(cube);
}

const positionOffset = (3 - 1) / 2;
for (let i = 0; i < 3; i++) {
  for (let j = 0; j < 3; j++) {
    for (let k = 0; k < 3; k++) {
      const x = (i - positionOffset) * increment;
      const y = (j - positionOffset) * increment;
      const z = (k - positionOffset) * increment;

      newCube(x, y, z);
    }
  }
}
console.log(allCubes);
// Create whole cube group
const wholeCube = new THREE.Group();
for (let i = 0; i <= 26; i++) {
  wholeCube.add(allCubes[i]);
}
scene.add(wholeCube);

// Add cube to debugger
if (debug) {
  const cubeFolder = gui.addFolder('Whole Cube');
  cubeFolder.add(wholeCube.rotation, 'x', 0, Math.PI * 2, 0.01).onChange(render);
  cubeFolder.add(wholeCube.rotation, 'y', 0, Math.PI * 2, 0.01).onChange(render);
  cubeFolder.add(wholeCube.rotation, 'z', 0, Math.PI * 2, 0.01).onChange(render);
  cubeFolder.open();
}

// Make responsive
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  render();
}

window.addEventListener('resize', onWindowResize);

// Render the scene
function render() {
  renderer.render(scene, camera);
}

render();
