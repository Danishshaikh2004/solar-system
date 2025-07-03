const canvas = document.getElementById('solarCanvas');
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 30, 50);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFF00 });
const sun = new THREE.Mesh(new THREE.SphereGeometry(4, 32, 32), sunMaterial);
scene.add(sun);

const ambient = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambient);

const pointLight = new THREE.PointLight(0xffffff, 2, 200);
pointLight.position.set(0, 0, 0);
scene.add(pointLight);

const planetData = [
  { name: "Mercury", color: 0xaaaaaa, size: 0.5, distance: 8, speed: 0.02 },
  { name: "Venus", color: 0xffcc99, size: 0.9, distance: 11, speed: 0.015 },
  { name: "Earth", color: 0x3399ff, size: 1, distance: 14, speed: 0.012 },
  { name: "Mars", color: 0xff3300, size: 0.8, distance: 17, speed: 0.009 },
  { name: "Jupiter", color: 0xffcc66, size: 2.2, distance: 21, speed: 0.006 },
  { name: "Saturn", color: 0xffff99, size: 2, distance: 25, speed: 0.004 },
  { name: "Uranus", color: 0x66ffff, size: 1.5, distance: 29, speed: 0.003 },
  { name: "Neptune", color: 0x3366ff, size: 1.4, distance: 33, speed: 0.002 }
];

const planets = [];

planetData.forEach(data => {

  const geometry = new THREE.SphereGeometry(data.size, 32, 32);
  const material = new THREE.MeshStandardMaterial({ color: data.color });
  const mesh = new THREE.Mesh(geometry, material);

  mesh.userData = {
    distance: data.distance,
    angle: Math.random() * Math.PI * 2,
    speed: data.speed
  };

  scene.add(mesh);
  planets.push({ name: data.name, mesh });

  const orbitPoints = [];
  for (let i = 0; i <= 360; i++) {
    const angle = (i * Math.PI) / 180;
    const x = Math.cos(angle) * data.distance;
    const z = Math.sin(angle) * data.distance;
    orbitPoints.push(new THREE.Vector3(x, 0, z));
  }

  const orbitGeometry = new THREE.BufferGeometry().setFromPoints(orbitPoints);
  const orbitMaterial = new THREE.LineBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.2
  });

  const orbitLine = new THREE.LineLoop(orbitGeometry, orbitMaterial);
  scene.add(orbitLine);

  const slidersDiv = document.getElementById('sliders');
  const label = document.createElement('label');
  label.textContent = `${data.name} speed`;
  const input = document.createElement('input');
  input.type = 'range';
  input.min = 0.001;
  input.max = 0.05;
  input.step = 0.001;
  input.value = data.speed;
  input.addEventListener('input', () => {
    mesh.userData.speed = parseFloat(input.value);
  });

  slidersDiv.appendChild(label);
  slidersDiv.appendChild(input);
});

let paused = false;
document.getElementById('pauseBtn').addEventListener('click', () => {
  paused = !paused;
  document.getElementById('pauseBtn').textContent = paused ? "Resume" : "Pause";
});

window.addEventListener('resize', () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
});

function animate() {
  requestAnimationFrame(animate);

  if (!paused) {
    planets.forEach(p => {
      const mesh = p.mesh;
      mesh.userData.angle += mesh.userData.speed;

      const x = Math.cos(mesh.userData.angle) * mesh.userData.distance;
      const z = Math.sin(mesh.userData.angle) * mesh.userData.distance;
      mesh.position.set(x, 0, z);
    });
  }

  renderer.render(scene, camera);
}

animate();
