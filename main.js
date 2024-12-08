import * as THREE from "three";
import gsap from "gsap";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import GUI from "lil-gui";

//Checking for OrbitControls if the library is installed...
console.log(OrbitControls);

//Checking for GUI if the library is installed...
const gui = new GUI();
console.log(gui);

//Checking for GSAP if the library is installed...
console.log(gsap);

const world = {
  plane: {
    width: 10,
    height: 10,
    widthSegments: 10,
    heightSegments: 10,
  },
};
gui.add(world.plane, "width", 1, 20).onChange(generatePlane);
gui.add(world.plane, "height", 1, 20).onChange(generatePlane);
gui.add(world.plane, "widthSegments", 1, 20).onChange(generatePlane);
gui.add(world.plane, "heightSegments", 1, 20).onChange(generatePlane);

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
  const { array } = planeMesh.geometry.attributes.position;
  for (let a = 0; a < array.length; a += 3) {
    const x = array[a];
    const y = array[a + 1];
    const z = array[a + 2];

    array[a + 2] = z + Math.random();
  }

  
  const colors = [];
  for (let x = 0; x < planeMesh.geometry.attributes.position.count; x++) {
    colors.push(0, 0.19, 0.4);
  }

  planeMesh.geometry.setAttribute(
    "color",
    new THREE.BufferAttribute(new Float32Array(colors), 3)
  );
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

// const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
// const boxMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
// const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
// scene.add(boxMesh);

camera.position.z = 5;

const planeGeometry = new THREE.PlaneGeometry(5, 5, 10, 10);
const planeMaterial = new THREE.MeshPhongMaterial({
  side: THREE.DoubleSide,
  flatShading: true, //True or false value, not THREE.FlatShading....
  vertexColors: true,
});
const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(planeMesh);

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 0, 1);
scene.add(light);

const backLight = new THREE.DirectionalLight(0xffffff, 1);
scene.add(backLight);
backLight.position.set(0, 0, -1);

const { array } = planeMesh.geometry.attributes.position;

for (let a = 0; a < array.length; a += 3) {
  const x = array[a];
  const y = array[a + 1];
  const z = array[a + 2];

  array[a] = x + (Math.random() - 0.5);
  array[a + 1] = y + (Math.random() - 0.5);
  array[a + 2] = z + Math.random();
}

planeMesh.geometry.attributes.position.originalPosition =
    planeMesh.geometry.attributes.position.array;

const colors = [];
for (let x = 0; x < planeMesh.geometry.attributes.position.count; x++) {
  colors.push(0, 0.19, 0.4);
}

planeMesh.geometry.setAttribute(
  "color",
  new THREE.BufferAttribute(new Float32Array(colors), 3)
);
// console.log(planeMesh.geometry.attributes);

new OrbitControls(camera, renderer.domElement);

const mouse = {
  x: undefined,
  y: undefined,
};

let frame = 0;

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  raycasting.setFromCamera(mouse, camera);

  const { array, originalPosition } = planeMesh.geometry.attributes.position;

  for (let x = 0; x < array.length; x += 3) {
    array[x] = originalPosition[x] + Math.cos(frame);
  }

  planeMesh.geometry.attributes.position.needsUpdate = true;

  const intersects = raycasting.intersectObject(planeMesh);

  if (intersects.length > 0) {
    console.log(intersects[0].face); //Lists the raycasting attributes....many of them.

    //deconstructor
    const { color } = intersects[0].object.geometry.attributes;

    //Vertex 1
    color.setX(intersects[0].face.a, 0.1);
    color.setY(intersects[0].face.a, 0.5);
    color.setZ(intersects[0].face.a, 1);

    //Vertex 2
    color.setX(intersects[0].face.b, 0.1);
    color.setY(intersects[0].face.b, 0.5);
    color.setZ(intersects[0].face.b, 1);

    //Vertex 3
    color.setX(intersects[0].face.c, 0.1);
    color.setY(intersects[0].face.c, 0.5);
    color.setZ(intersects[0].face.c, 1);
    color.needsUpdate = true;

    const initialColor = {
      r: 0,
      g: 0.19,
      b: 0.4,
    };
    const hoverColor = {
      r: 0.1,
      g: 0.5,
      b: 1,
    };

    gsap.to(hoverColor, {
      r: initialColor.r,
      g: initialColor.g,
      b: initialColor.b,
      onUpdate: () => {
        color.setX(intersects[0].face.a, hoverColor.r);
        color.setY(intersects[0].face.a, hoverColor.g);
        color.setZ(intersects[0].face.a, hoverColor.b);

        //Vertex 2
        color.setX(intersects[0].face.b, hoverColor.r);
        color.setY(intersects[0].face.b, hoverColor.g);
        color.setZ(intersects[0].face.b, hoverColor.b);

        //Vertex 3
        color.setX(intersects[0].face.c, hoverColor.r);
        color.setY(intersects[0].face.c, hoverColor.g);
        color.setZ(intersects[0].face.c, hoverColor.b);
        color.needsUpdate = true;
      },
    });
  }
  // console.log(intersects);
  // planeMesh.rotation.y += 0.001;

  // boxMesh.rotation.y += 0.001;
  // boxMesh.rotation.z += 0.001;
}

animate();

addEventListener("mousemove", (event) => {
  mouse.x = (event.clientX / innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / innerHeight) * 2 + 1;
});
