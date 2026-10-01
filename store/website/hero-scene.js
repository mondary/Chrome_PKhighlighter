import * as THREE from './vendor/three.module.min.js';

// One ribbon of highlighter ink behind the real screenshot. No text is rendered in WebGL.
export function mount(host) {
  if (document.documentElement.dataset.motion === 'off') return;
  const renderer = new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});
  const canvas = renderer.domElement;
  canvas.className = 'hero-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  host.appendChild(canvas);
  document.documentElement.dataset.webgl = 'ready';
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, 1, .1, 30);
  camera.position.z = 9;
  scene.add(new THREE.HemisphereLight(0xffffff, 0x6d7958, 2.7));
  const light = new THREE.DirectionalLight(0xffffff, 3);
  light.position.set(-3, 5, 5);
  scene.add(light);
  const points = [];
  for (let i = 0; i <= 96; i++) {
    const t = i / 96;
    points.push(new THREE.Vector3(-5.7 + 11.4 * t, 1.95 + .55 * Math.sin(t * Math.PI * 2.1), Math.sin(t * Math.PI * 2) * .7));
  }
  const curve = new THREE.CatmullRomCurve3(points);
  const vertices = [], indices = [];
  for (let i = 0; i <= 128; i++) {
    const t = i / 128;
    const p = curve.getPoint(t);
    const twist = Math.sin(t * Math.PI * 3) * .85;
    for (const side of [-1, 1]) vertices.push(p.x, p.y + side * .14 * Math.cos(twist), p.z + side * .14 * Math.sin(twist));
    if (i < 128) { const n = i * 2; indices.push(n,n+1,n+2,n+1,n+3,n+2); }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  const material = new THREE.MeshStandardMaterial({color:0xc5dc7b,roughness:.6,metalness:.02,side:THREE.DoubleSide});
  const ribbon = new THREE.Mesh(geometry,material);
  scene.add(ribbon);
  let frame = 0, visible = false, pointer = 0;
  const reduced = () => document.documentElement.dataset.motion === 'off' || matchMedia('(max-width:767px)').matches;
  function draw(time) {
    frame = 0;
    if (!visible || document.hidden || reduced()) return;
    ribbon.rotation.z = Math.sin(time / 6000) * .02 + pointer * .012;
    ribbon.rotation.y = Math.sin(time / 8000) * .1;
    renderer.render(scene,camera);
    frame = requestAnimationFrame(draw);
  }
  function sync() {
    cancelAnimationFrame(frame);
    frame = 0;
    if (visible && !document.hidden && !reduced()) frame = requestAnimationFrame(draw);
  }
  const resize = new ResizeObserver(() => {
    const {width,height} = host.getBoundingClientRect();
    renderer.setSize(width,height,false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    sync();
  });
  resize.observe(host);
  const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
  observer.observe(host);
  const move = e => { pointer = (e.clientX - host.getBoundingClientRect().left) / host.clientWidth - .5; };
  host.addEventListener('pointermove', move, {passive:true});
  document.addEventListener('visibilitychange',sync);
  document.addEventListener('pkh:motion',sync);
  canvas.addEventListener('webglcontextlost', e => {e.preventDefault();visible=false;sync();canvas.hidden=true;document.documentElement.dataset.webgl='lost';});
  window.addEventListener('pagehide', () => {
    cancelAnimationFrame(frame); observer.disconnect(); resize.disconnect();
    document.removeEventListener('visibilitychange',sync);
    document.removeEventListener('pkh:motion',sync);
    host.removeEventListener('pointermove',move);
    geometry.dispose();material.dispose();renderer.dispose();canvas.remove();
  }, {once:true});
}
