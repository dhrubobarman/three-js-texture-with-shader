import * as THREE from "three";
import {
  addPass,
  useCamera,
  useGui,
  useRenderSize,
  useScene,
  useTick,
} from "./render/init.js";
// import postprocessing passes
import { SavePass } from "three/examples/jsm/postprocessing/SavePass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { BlendShader } from "three/examples/jsm/shaders/BlendShader.js";
import { CopyShader } from "three/examples/jsm/shaders/CopyShader.js";
import image from "@/assets/profile_p.jpg";

import vertexShader from "@/shaders/vertex.glsl?raw";
import fragmentShader from "@/shaders/fragment.glsl?raw";

const startApp = () => {
  const scene = useScene();
  const camera = useCamera();
  const gui = useGui();
  const { width, height } = useRenderSize();

  // settings
  const MOTION_BLUR_AMOUNT = 0.725;

  // lighting
  const dirLight = new THREE.DirectionalLight("#ffffff", 0.75);
  dirLight.position.set(5, 5, 5);

  const ambientLight = new THREE.AmbientLight("#ffffff", 0.2);
  scene.add(dirLight, ambientLight);

  // meshes
  const geometry = new THREE.PlaneGeometry(1, 1);
  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    side: THREE.DoubleSide,
  });

  material.uniforms.uRadius = { value: 0.8 };
  material.uniforms.uTime = { value: 0 };
  material.uniforms.uTexture = { value: new THREE.TextureLoader().load(image) };

  const ico = new THREE.Mesh(geometry, material);
  scene.add(ico);

  // GUI
  const cameraFolder = gui.addFolder("Camera");
  cameraFolder.add(camera.position, "z", 0, 10);
  cameraFolder.open();
  gui.add(material.uniforms.uRadius, "value", 0, 1, 0.01);

  // postprocessing
  const renderTargetParameters = {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    stencilBuffer: false,
  };

  // save pass
  const savePass = new SavePass(
    new THREE.WebGLRenderTarget(width, height, renderTargetParameters)
  );

  // blend pass
  const blendPass = new ShaderPass(BlendShader, "tDiffuse1");
  blendPass.uniforms["tDiffuse2"].value = savePass.renderTarget.texture;
  blendPass.uniforms["mixRatio"].value = MOTION_BLUR_AMOUNT;

  // output pass
  const outputPass = new ShaderPass(CopyShader);
  outputPass.renderToScreen = true;

  // adding passes to composer
  addPass(blendPass);
  addPass(savePass);
  addPass(outputPass);

  useTick(({ timestamp, timeDiff }) => {});
};

export default startApp;
