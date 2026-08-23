"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import * as THREE from "three";

const CAMERA_DIRECTION = new THREE.Vector3(0, 1.1, 6.4).normalize();
const MOON_ORBIT_RADIUS = 3.18;
const SCENE_BOUNDING_RADIUS = MOON_ORBIT_RADIUS + 0.17;
const RING_WORST_VERTICAL_EXTENT = 2.95;

function CameraRig() {
  const camera = useThree((state) => state.camera);
  const size = useThree((state) => state.size);

  useEffect(() => {
    const perspective = camera as THREE.PerspectiveCamera;
    if (!perspective.isPerspectiveCamera) return;

    const aspect = Math.max(size.width / Math.max(size.height, 1), 0.5);
    const verticalHalf = THREE.MathUtils.degToRad(perspective.fov) / 2;
    const horizontalHalf = Math.atan(Math.tan(verticalHalf) * aspect);
    const distance = Math.max(
      SCENE_BOUNDING_RADIUS / Math.sin(horizontalHalf),
      RING_WORST_VERTICAL_EXTENT / Math.sin(verticalHalf),
    );

    perspective.position.copy(CAMERA_DIRECTION).multiplyScalar(distance);
    perspective.lookAt(0, 0, 0);
    perspective.updateProjectionMatrix();
  }, [camera, size]);

  return null;
}

const NOISE_GLSL = /* glsl */ `
float hash(vec3 p) {
  return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453);
}
float noise(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(mix(hash(i), hash(i + vec3(1.0, 0.0, 0.0)), f.x),
        mix(hash(i + vec3(0.0, 1.0, 0.0)), hash(i + vec3(1.0, 1.0, 0.0)), f.x), f.y),
    mix(mix(hash(i + vec3(0.0, 0.0, 1.0)), hash(i + vec3(1.0, 0.0, 1.0)), f.x),
        mix(hash(i + vec3(0.0, 1.0, 1.0)), hash(i + vec3(1.0, 1.0, 1.0)), f.x), f.y),
    f.z);
}
`;

const PLANET_VERTEX = /* glsl */ `
varying vec3 vNormalView;
varying vec3 vPositionView;
void main() {
  vNormalView = normalize(normalMatrix * normal);
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  vPositionView = mvPosition.xyz;
  gl_Position = projectionMatrix * mvPosition;
}
`;

const PLANET_FRAGMENT = /* glsl */ `
uniform float uTime;
varying vec3 vNormalView;
varying vec3 vPositionView;
${NOISE_GLSL}
void main() {
  vec3 n = normalize(vNormalView);
  float swirl = noise(n * 3.0 + vec3(uTime * 0.03, uTime * 0.015, 0.0));
  float bands = 0.5 + 0.5 * sin(n.y * 21.0 + swirl * 2.2);

  vec3 deep = vec3(0.015, 0.050, 0.190);
  vec3 mid = vec3(0.060, 0.220, 0.510);
  vec3 bright = vec3(0.390, 0.720, 1.000);
  vec3 color = mix(deep, mid, bands);
  color = mix(color, bright, smoothstep(0.78, 1.0, bands) * 0.32);

  vec3 lightDir = normalize(vec3(0.65, 0.55, 0.75));
  float diffuse = max(dot(n, lightDir), 0.0);
  color *= 0.30 + diffuse * 0.85;

  float fresnel = pow(1.0 - abs(dot(n, normalize(-vPositionView))), 2.6);
  color += vec3(0.42, 0.72, 1.0) * fresnel * 0.55;

  gl_FragColor = vec4(color, 1.0);
}
`;

const ATMOSPHERE_FRAGMENT = /* glsl */ `
varying vec3 vNormalView;
varying vec3 vPositionView;
void main() {
  float fresnel = pow(1.0 - abs(dot(normalize(vNormalView), normalize(-vPositionView))), 3.2);
  gl_FragColor = vec4(vec3(0.35, 0.66, 1.0) * fresnel, fresnel * 0.9);
}
`;

const RING_VERTEX = /* glsl */ `
varying vec3 vLocalPosition;
void main() {
  vLocalPosition = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const RING_FRAGMENT = /* glsl */ `
varying vec3 vLocalPosition;
${NOISE_GLSL}
void main() {
  float radius = length(vLocalPosition.xy);
  float t = (radius - 1.70) / (2.90 - 1.70);
  float grain = noise(vec3(radius * 8.0, 0.0, 3.7)) * 0.6 + noise(vec3(radius * 24.0, 5.0, 1.3)) * 0.4;
  float edge = smoothstep(0.0, 0.09, t) * (1.0 - smoothstep(0.82, 1.0, t));
  float gap = smoothstep(0.015, 0.11, abs(t - 0.56));
  float alpha = edge * gap * (0.30 + 0.70 * grain);
  vec3 color = mix(vec3(0.52, 0.70, 0.94), vec3(0.88, 0.95, 1.0), grain);
  gl_FragColor = vec4(color, alpha);
}
`;

type SaturnProps = {
  animate: boolean;
};

function Saturn({ animate }: SaturnProps) {
  const spinGroup = useRef<THREE.Group>(null);
  const moonPivot = useRef<THREE.Group>(null);
  const planetMaterial = useRef<THREE.ShaderMaterial>(null);
  const ringMaterial = useRef<THREE.ShaderMaterial>(null);
  const { gl } = useThree();
  const dragState = useRef({
    dragging: false,
    lastX: 0,
    lastY: 0,
    vx: 0,
    vy: 0,
    rx: 0.16,
    ry: -0.35,
  });

  const planetUniforms = useMemo(() => ({ uTime: { value: 0 } }), []);
  const ringUniforms = useMemo(() => ({ uTime: { value: 0 } }), []);

  useEffect(() => {
    const element = gl.domElement;
    const state = dragState.current;

    const onPointerDown = (event: PointerEvent) => {
      state.dragging = true;
      state.lastX = event.clientX;
      state.lastY = event.clientY;
      state.vx = 0;
      state.vy = 0;
      element.setPointerCapture(event.pointerId);
    };
    const onPointerMove = (event: PointerEvent) => {
      if (!state.dragging) return;
      const dx = event.clientX - state.lastX;
      const dy = event.clientY - state.lastY;
      state.vy = dx * 0.0045;
      state.vx = dy * 0.0035;
      state.ry += state.vy;
      state.rx = THREE.MathUtils.clamp(state.rx + state.vx, -0.75, 0.75);
      state.lastX = event.clientX;
      state.lastY = event.clientY;
    };
    const endDrag = () => {
      state.dragging = false;
    };

    element.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", endDrag);
    window.addEventListener("pointercancel", endDrag);
    return () => {
      element.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", endDrag);
      window.removeEventListener("pointercancel", endDrag);
    };
  }, [gl]);

  useFrame((state, delta) => {
    const step = Math.min(delta, 0.05);
    if (planetMaterial.current) planetMaterial.current.uniforms.uTime.value = state.clock.elapsedTime;
    if (ringMaterial.current) ringMaterial.current.uniforms.uTime.value = state.clock.elapsedTime;

    const spin = spinGroup.current;
    if (spin) {
      const s = dragState.current;
      if (!s.dragging) {
        s.vy *= 0.94;
        s.vx *= 0.94;
        s.ry += s.vy + (animate ? step * 0.14 : 0);
        s.rx = THREE.MathUtils.clamp(s.rx + s.vx, -0.75, 0.75);
      }
      spin.rotation.set(s.rx, s.ry, 0);
    }

    if (moonPivot.current && animate) moonPivot.current.rotation.y += step * 0.5;
  });


  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight position={[4, 5, 6]} intensity={1.4} />

      <group ref={spinGroup}>
        <group rotation={[0.44, 0, -0.16]}>
          <mesh>
            <sphereGeometry args={[1.28, 96, 96]} />
            <shaderMaterial
              ref={planetMaterial}
              vertexShader={PLANET_VERTEX}
              fragmentShader={PLANET_FRAGMENT}
              uniforms={planetUniforms}
            />
          </mesh>

          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[1.7, 2.9, 160, 1]} />
            <shaderMaterial
              ref={ringMaterial}
              vertexShader={RING_VERTEX}
              fragmentShader={RING_FRAGMENT}
              uniforms={ringUniforms}
              transparent
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </mesh>

          <mesh scale={1.24}>
            <sphereGeometry args={[1.28, 64, 64]} />
            <shaderMaterial
              vertexShader={PLANET_VERTEX}
              fragmentShader={ATMOSPHERE_FRAGMENT}
              transparent
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        </group>

        <group ref={moonPivot} rotation={[0.3, 0, 0]}>
          <mesh position={[MOON_ORBIT_RADIUS, 0.35, 0]}>
            <sphereGeometry args={[0.13, 32, 32]} />
            <meshStandardMaterial color="#cfe4ff" roughness={0.9} metalness={0.05} />
          </mesh>
        </group>
      </group>

      <Stars radius={70} depth={35} count={1600} factor={3.2} saturation={0} fade speed={animate ? 0.6 : 0} />
    </>
  );
}

export default function PlanetScene() {
  const animate = useMemo(
    () =>
      typeof window !== "undefined" &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    [],
  );

  return (
    <div className="hero-planet__canvas" style={{ touchAction: "pan-y" }}>
      <Canvas
        role="img"
        aria-label="Interactive rotating ringed planet with an orbiting moon"
        camera={{ fov: 38, position: [0, 1.56, 9.05] }}
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true }}
      >
        <CameraRig />
        <Saturn animate={animate} />
      </Canvas>
    </div>
  );
}

