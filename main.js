import * as THREE from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import GUI from "lil-gui";

console.log(OrbitControls);

const gui = new GUI();
console.log(gui);

const world = {
  plane: {
    width: 10,
    height: 10,
    widthSegments: 10,
    heightSegments: 10
  },
};
gui.add(world.plane, "width", 1, 20).onChange(
  generatePlane);
gui.add(world.plane, "height", 1, 20).onChange(
  generatePlane
);
gui.add(world.plane, "widthSegments", 1, 20).onChange(
  generatePlane);
gui.add(world.plane, "heightSegments", 1, 20).onChange(
  generatePlane);


//function that keeps the set values of each object attribute of the plane.
function generatePlane() {
  planeMesh.geometry.dispose();
  planeMesh.geometry = new THREE.PlaneGeometry(
    world.plane.width,
    world.plane.height,
    world.plane.widthSegments,
    world.plane.heightSegments
  );

  //Creates points on the plane
  const { array } = planeMesh.geometry.attributes.position
  for (let a = 0; a < array.length; a += 3) {
    const x = array[a];
    const y = array[a + 1];
    const z = array[a + 2];

    array[a + 2] = z + Math.random();
  }
}

//Basic setup of three js scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
//Ensures that the coordinate plane is displaying the correct coordinates....
const raycasting = new THREE.Raycaster();

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(devicePixelRatio);
document.body.appendChild(renderer.domElement);

const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const boxMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
scene.add(boxMesh);

camera.position.z = 5;

const planeGeometry = new THREE.PlaneGeometry(5, 5, 10, 10);
const planeMaterial = new THREE.MeshPhongMaterial({
  side: THREE.DoubleSide,
  flatShading: true, //True or false value, not THREE.FlatShading....
  vertexColors: true
})
const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(planeMesh);

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 0, 1);
scene.add(light);


const backLight = new THREE.DirectionalLight(0xffffff, 1);
scene.add(backLight);
backLight.position.set(0, 0, -1);

const {array} = planeMesh.geometry.attributes.position;

for ( let a = 0; a < array.length; a += 3){
  const x = array[a];
  const y = array[a + 1];
  const z = array[a + 2];

  array[a + 2] = z + Math.random();

}

const colors = [];
for(let x = 0; x < planeMesh.geometry.attributes.position.count; x++) {
  colors.push(1, 0, 0);
}

planeMesh.geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3));
console.log(planeMesh.geometry.attributes);


new OrbitControls(camera, renderer.domElement);

const mouse = {
  x: undefined,
  y: undefined
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  raycasting.setFromCamera(mouse, camera);
  const intersects = raycasting.intersectObject(planeMesh);

  if (intersects.length > 0) {
    console.log(intersects[0].face); //Lists the raycasting attributes....many of them.

    //deconstructor
    const {color} = intersects[0].object.geometry.attributes;

    //Vertex 1
    color.setX(intersects[0].face.a, 0);
    color.setY(intersects[0].face.a, 0);
    color.setZ(intersects[0].face.a, 1);

    //Vertex 2
    color.setX(intersects[0].face.b, 0);
    color.setY(intersects[0].face.b, 0);
    color.setZ(intersects[0].face.b, 1);

    //Vertex 3
    color.setX(intersects[0].face.c, 0);
    color.setY(intersects[0].face.c, 0);
    color.setZ(intersects[0].face.c, 1);
    color.needsUpdate = true;
  }
  // console.log(intersects);
  // planeMesh.rotation.y += 0.001;

  // boxMesh.rotation.y += 0.001;
  // boxMesh.rotation.z += 0.001;
}

animate();

addEventListener('mousemove', (event) => {
  mouse.x = (event.clientX / innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / innerHeight) * 2 + 1;
})
