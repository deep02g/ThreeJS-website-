import "./style.css"
import { gsap } from "gsap"
import { Rendering } from "./rendering.js"
import * as THREE from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import { palettes, sinPalettes, demoCustomSinPalette } from "./palettes.js";
import { getPaletteFromParams, mix, setupControls } from "./utils.js";
import  lerpy  from "lerpy"
// Colors 
let paletteKey = getPaletteFromParams("blue")

let palette = palettes[paletteKey]
let sinPalette = demoCustomSinPalette[paletteKey]

class Demo {
  constructor(){
    this.rendering = new Rendering(document.querySelector("#canvas"), palette)
    this.controls = new OrbitControls(this.rendering.camera, this.rendering.canvas)
    
    this.rendering.camera.position.z = 60;
    this.rendering.camera.position.y = 60;
    this.rendering.camera.position.x = 60;

    this.uTime = new THREE.Uniform(0)

    this.scrollProgress = 0;
    this.scrollProgressTarget = 0;
    this.lookTarget = new THREE.Vector3(0, 0, 0);
    this.posRatios = new THREE.Vector3(1, 0.95, 1);

    this.init()
  }
  init(){
    const box = new THREE.PlaneGeometry(100,100, 100, 300)


    let grid = 2;
    let aIndex = new Float32Array(2 * 4);
    let i = 0;
    for (let x = 0; x < grid; x++) {
      aIndex[i]     = 1;
      aIndex[i + 1] = 50;
      aIndex[i + 2] = (Math.floor(x) / 4) * Math.PI * 2;
      aIndex[i + 3] = 0;
      i += 4;
    }

    let instancedBox = new THREE.InstancedBufferGeometry()
    instancedBox.copy(box)
    instancedBox.instanceCount = grid;
    
    instancedBox.setAttribute("aIndex", 
      new THREE.InstancedBufferAttribute( aIndex, 4, false )
    )

    const mat = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      side: THREE.DoubleSide,
      uniforms: {
        uTime: this.uTime,
        uUnroll:         { value: 30 },
        uStartRollAngle: { value: 48 },
        uPitch:          { value: 0.1 },
        uAnglePerUnit:   { value: 0.42 },
        uVisibility:     { value: 1},
        uPalette0:       { value: sinPalette.c0 },
        uPalette1:       { value: sinPalette.c1 },
        uPalette2:       { value: sinPalette.c2 },
        uPalette3:       { value: sinPalette.c3 },
        uBG:             { value: palette.BG},
      }
    })
    const mesh = new THREE.Mesh(instancedBox, mat)
    this.mesh = mesh;

    this.rendering.scene.add(mesh)

    this.addEvents()
  }
  onResize = () => {
    let ratio = Math.max(1, window.innerWidth / window.innerHeight) - 1;

    this.lookTarget.y = ratio * 40;
    this.posRatios.y = 0.95 - ratio * 0.065;
    // this.posRatios.y = 0.95 - ratio * 0.065;
    this.posRatios.x = 1 + ratio * 0.065;
    this.posRatios.z = 1 + ratio * 0.065;

    this.scrollHeight = document.documentElement.scrollHeight;

    this.posRatios.y = 0.95 - ratio * 0.065 + ratio * 0.1;
    this.posRatios.x = 1 + ratio * 0.2;
    this.posRatios.z = 1 + ratio * 0.2;

    let scale = 1 + ratio * 0.1;
    this.mesh.scale.set(scale, scale, scale);
  };
  onScroll = (e) => {
    this.scrollProgressTarget = window.scrollY / (this.scrollHeight - this.rendering.vp.screen.height);
  };
  addEvents(){
    gsap.ticker.add(this.tick)
    this.onResize();
    window.addEventListener('resize', this.onResize)
    window.addEventListener('scroll', this.onScroll)
  }
  tick = (time, delta)=>{
    this.uTime.value += delta;

    this.scrollProgress += lerpy(this.scrollProgress, this.scrollProgressTarget, 0.1, 0.00001);
    let p = mix(55, 60, this.scrollProgress);

    this.rendering.camera.position.z = p * this.posRatios.x;
    this.rendering.camera.position.y = p * this.posRatios.y;
    this.rendering.camera.position.x = p * this.posRatios.z;

    this.rendering.camera.lookAt(this.lookTarget);

    this.mesh.material.uniforms.uUnroll.value = mix(30, 0, this.scrollProgress);

    this.rendering.render()
  }
}

  let vertexShader = glsl`
    attribute vec4 aIndex;
    varying vec2 vUv;
    varying float vPaletteIndex;
    uniform float uPitch;
    uniform float uUnroll;
    uniform float uAnglePerUnit;
    uniform float uStartRollAngle;
    #define PI 3.141592653589793
    
    float arcLengthToAngle(float angle) {
      float radical = sqrt(angle * angle + 1.0);
      return uPitch * 0.5 * (angle * radical + log(angle + radical));
    }

    uniform float uTime;

    mat2 rotate2d(float _angle){
      return mat2(cos(_angle),-sin(_angle),
            sin(_angle),cos(_angle));
    }
    uniform float uVisibility;
    void main() {
      vec3 transformed = position;
      transformed.y += 50.;
      float animationSpace = 20.;
      float  _UnrolledAngle = uUnroll + (animationSpace - uVisibility * animationSpace);
      // + (animationSpace - uVisibility * animationSpace)
// + aIndex.w * 3.
      
      float fromStart = (transformed.y) * uAnglePerUnit ;

      float fromOrigin = uStartRollAngle - fromStart;
      float lengthToHere = arcLengthToAngle(fromOrigin);
      float lengthToStart = arcLengthToAngle(uStartRollAngle);
      float lengthToUnroll = arcLengthToAngle(uStartRollAngle- _UnrolledAngle);

      // v.texcoord.y = lengthToStart - lengthToHere;
      float lengthToSplit = arcLengthToAngle(uStartRollAngle - _UnrolledAngle);

      if (fromStart < _UnrolledAngle ) {
        transformed.y = lengthToSplit - lengthToHere;
        transformed.z = 0.0;
        transformed.z += (sin(uv.x * PI * 21. + uTime * 0.01) * 2. + 2.) 
          * smoothstep(0., -20., transformed.y) * aIndex.x
          * smoothstep(0., 0.1, uv.x) * smoothstep(1., 0.9, uv.x);


      }
      else {
        float radiusAtSplit = uPitch * (uStartRollAngle - _UnrolledAngle);
        float radius = uPitch * fromOrigin;

        float shifted = fromStart - _UnrolledAngle;

        transformed.z = radiusAtSplit - cos(shifted) * radius;
        // transformed.z += 5.;
        transformed.y = sin(shifted) * radius;
      }

      // transformed.y +=  lengthToStart - lengthToSplit ;
      transformed.y += 50. - 1.2;

      transformed.z += aIndex.y;
      transformed.x *= uVisibility;
      transformed.xz = rotate2d(aIndex.z) * transformed.xz;
      transformed.yz = rotate2d(aIndex.w) * transformed.yz;
      vUv = uv;
      vPaletteIndex = 0.;

      gl_Position =  projectionMatrix * modelViewMatrix * vec4(transformed, 1.);
    }

    
  `;
  let fragmentShader = glsl`
    varying vec2 vUv;

float box(in vec2 _st, in vec2 _size){
  _size = vec2(0.5) - _size*0.5;
  vec2 uv = smoothstep(_size,
                      _size+vec2(0.001),
                      _st);
  uv *= smoothstep(_size,
                  _size+vec2(0.001),
                  vec2(1.0)-_st);
  return uv.x*uv.y;
}


uniform vec3 uPalette0;
uniform vec3 uPalette1;
uniform vec3 uPalette2;
uniform vec3 uPalette3;


varying float vPaletteIndex;

vec3 palette( in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d ){
return a + b*cos( 6.28318*(c*t+d) );
}

uniform vec3 uBG;
uniform float uVisibility;
    void main() {
      vec3 color = vec3(0.);

      vec2 grid = fract(vUv * 20.);

      float colorFreq = vPaletteIndex + (1.-vUv.y) * 2. + vUv.x * 0.5 ;
      vec3 paletteCurrent = palette(colorFreq, uPalette0,uPalette1,uPalette2,uPalette3);
      vec3 paletteColor = paletteCurrent;
  
      color = vec3(vUv.y);
      // color = vec3(cross(grid, 0.05));
      color = paletteColor;
      color = mix(uBG, color, uVisibility);
      gl_FragColor = vec4(color, 1.0);
    }
  `;

let demo = new Demo()

setupControls(paletteKey)
