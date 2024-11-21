import * as THREE from "three";
import GUI from "lil-gui";

const gui = new GUI();
console.log(gui);

const world = {
  plane: {
    width: 10,
    height: 10,
  },
};
gui.add(world.plane, "width", 1, 20).onChange(() => {
  planeMesh.geometry.dispose();
  planeMesh.geometry = new THREE.PlaneGeometry(world.plane.width, 10, 10, 10);
  console.log(planeMesh.geometry);

  const { array } = planeMesh.geometry.attributes.position;

  for (let a = 0; a < array.length; a += 3) {
    const x = array[a];
    const y = array[a + 1];
    const z = array[a + 2];

    array[a + 2] = z + Math.random();
  }
  
});
gui.add(world.plane, "height", 1, 20).onChange(() => {
  planeMesh.geometry.dispose();
  planeMesh.geometry = new THREE.PlaneGeometry(10, world.plane.height, 10, 10);
  console.log(planeMesh.geometry);
});

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const boxMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
scene.add(boxMesh);

camera.position.z = 5;

const planeGeometry = new THREE.PlaneGeometry(5, 5, 10, 10);
const planeMaterial = new THREE.MeshPhongMaterial({
  color: 0xff0000,
  side: THREE.DoubleSide,
  flatShading: THREE.FlatShading,
});
const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(planeMesh);
const light = new THREE.DirectionalLight(0xffffff, 1);
scene.add(light);

light.position.set(0, 0, 1);

// const {array} = planeMesh.geometry.attributes.position;

// for ( let a = 0; a < array.length; a += 3){
//   const x = array[a];
//   const y = array[a + 1];
//   const z = array[a + 2];

//   array[a + 2] = z + Math.random();

// }

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  planeMesh.rotation.y += 0.001;

  boxMesh.rotation.y += 0.001;
  boxMesh.rotation.z += 0.001;
}

animate();
