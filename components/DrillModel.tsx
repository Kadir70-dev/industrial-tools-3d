'use client';
import { Component, Suspense, type ReactNode, useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ContactShadows, Html, OrbitControls, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

type CanvasBoundaryProps = { children: ReactNode; fallback: ReactNode };
class CanvasBoundary extends Component<CanvasBoundaryProps, { failed: boolean }> {
 state = { failed: false };
 static getDerivedStateFromError() { return { failed: true }; }
 render() { return this.state.failed ? this.props.fallback : this.props.children; }
}
function StaticDrill() {
 return <div className="drill-fallback" role="img" aria-label="Static cordless drill illustration"><i className="drill-fallback__body"/><i className="drill-fallback__grip"/><i className="drill-fallback__battery"/><i className="drill-fallback__chuck"/><i className="drill-fallback__bit"/></div>;
}

function CameraMotion({interactive}:{interactive:boolean}) {
 const { camera }=useThree(); const progress=useRef(0); const target=useRef(new THREE.Vector3());
 useEffect(()=>{if(interactive)return; const onScroll=()=>{progress.current=Math.max(0,Math.min(1,window.scrollY/Math.max(window.innerHeight,1)));}; onScroll(); window.addEventListener('scroll',onScroll,{passive:true}); return()=>window.removeEventListener('scroll',onScroll);},[interactive]);
 useFrame(()=>{if(interactive)return; const p=progress.current; camera.position.lerp(target.current.set(3.25+p*.32,2.2+p*.2,4.2-p*.42),.035); camera.lookAt(0,0,0);});
 return null;
}

// Widen the view on narrow canvases so the full drill stays in frame (tablet/mobile).
function Framing({ refAspect=1.15 }:{refAspect?:number}) {
 const { camera, size }=useThree();
 useEffect(()=>{const cam=camera as THREE.PerspectiveCamera; cam.zoom=Math.min(1,(size.width/Math.max(size.height,1))/refAspect); cam.updateProjectionMatrix();},[camera,size.width,size.height,refAspect]);
 return null;
}

// Detail point anchored to the model (local coordinates) so it follows the rotating drill.
export type Hotspot = { id: string; index: string; label: string; detail: string; position: [number, number, number] };
type HotspotProps = { hotspots?: Hotspot[]; activeHotspot?: string; onHotspot?: (id: string) => void };

function Hotspots({ hotspots=[], activeHotspot, onHotspot }: HotspotProps) {
 return <>{hotspots.map(h=><Html key={h.id} position={h.position} occlude zIndexRange={[3,1]}>
  <button className={`hotspot hotspot--tracked${activeHotspot===h.id?' is-active':''}`} onClick={()=>onHotspot?.(h.id)} aria-label={h.label} aria-pressed={activeHotspot===h.id}><i/><span>{activeHotspot===h.id?h.detail:h.index}</span></button>
 </Html>)}</>;
}

function Tool({reducedMotion, ...hotspotProps}:{reducedMotion:boolean} & HotspotProps) {
  const root = useRef<THREE.Group>(null!);
  useFrame((state, delta) => { if (root.current && !reducedMotion) root.current.rotation.y += delta * 0.085; });
  const orange = '#ef6c28'; const graphite = '#252b2d'; const rubber = '#141819'; const metal = '#9ca5a7';
  return <group ref={root} rotation={[0.08, -0.36, -0.04]} scale={1.05}>
    {/* Motor housing: compact two-shell form */}
    <RoundedBox args={[1.45,.92,.82]} radius={.17} smoothness={4} position={[0,.42,0]} castShadow><meshStandardMaterial color={orange} roughness={.34} metalness={.18}/></RoundedBox>
    <RoundedBox args={[.92,.66,.84]} radius={.14} smoothness={4} position={[-.22,.42,0]} castShadow><meshStandardMaterial color={graphite} roughness={.4} metalness={.28}/></RoundedBox>
    <RoundedBox args={[.42,.73,.86]} radius={.11} smoothness={4} position={[.47,.39,0]} castShadow><meshStandardMaterial color={orange} roughness={.32} metalness={.14}/></RoundedBox>
    {/* rear vent slots */}
    {[-.13,-.02,.09,.2].map((y,i)=><mesh key={i} position={[-.74,.43+y,.418]}><boxGeometry args={[.08,.035,.014]}/><meshStandardMaterial color="#080b0c"/></mesh>)}
    {/* top clutch ring and torque selector */}
    <mesh position={[.78,.42,0]} rotation={[0,0,Math.PI/2]}><cylinderGeometry args={[.29,.29,.16,32]}/><meshStandardMaterial color={metal} metalness={.8} roughness={.24}/></mesh>
    <mesh position={[.92,.42,0]} rotation={[0,0,Math.PI/2]}><cylinderGeometry args={[.235,.235,.12,32]}/><meshStandardMaterial color="#252a2b" metalness={.6} roughness={.32}/></mesh>
    <mesh position={[1.09,.42,0]} rotation={[0,0,Math.PI/2]}><cylinderGeometry args={[.17,.2,.22,32]}/><meshStandardMaterial color="#111516" metalness={.45} roughness={.24}/></mesh>
    <mesh position={[1.31,.42,0]} rotation={[0,0,Math.PI/2]}><cylinderGeometry args={[.07,.07,.44,12]}/><meshStandardMaterial color="#bcc4c4" metalness={.9} roughness={.2}/></mesh>
    {/* ergonomic grip angled backward */}
    <group position={[-.02,-.14,0]} rotation={[0,0,-.24]}>
      <RoundedBox args={[.48,1.02,.67]} radius={.17} smoothness={4} position={[0,-.49,0]} castShadow><meshStandardMaterial color={graphite} roughness={.62}/></RoundedBox>
      <RoundedBox args={[.43,.86,.69]} radius={.16} smoothness={4} position={[0,-.5,.015]}><meshStandardMaterial color={rubber} roughness={.87}/></RoundedBox>
      {[-.78,-.61,-.44,-.27,-.1,.07].map((y,i)=><mesh key={i} position={[0,y,.365]}><boxGeometry args={[.28,.025,.013]}/><meshStandardMaterial color="#343b3d" roughness={.82}/></mesh>)}
      <RoundedBox args={[.13,.34,.22]} radius={.05} smoothness={3} position={[.32,.16,0]} rotation={[0,0,.18]}><meshStandardMaterial color="#f6a269" roughness={.3}/></RoundedBox>
      {/* battery pack */}
      <RoundedBox args={[.7,.37,.78]} radius={.12} smoothness={4} position={[0,-1.09,0]} castShadow><meshStandardMaterial color={orange} roughness={.32}/></RoundedBox>
      <RoundedBox args={[.72,.12,.8]} radius={.04} smoothness={3} position={[0,-.89,0]}><meshStandardMaterial color="#171c1e" roughness={.45}/></RoundedBox>
      <mesh position={[0,-1.095,.397]}><boxGeometry args={[.34,.055,.018]}/><meshStandardMaterial color="#222728"/></mesh>
      {[ -.12,-.04,.04,.12].map((x,i)=><mesh key={i} position={[x,-1.095,.41]}><boxGeometry args={[.035,.025,.012]}/><meshStandardMaterial color={i===0?'#8ddb9d':'#53615b'} emissive={i===0?'#31a65b':'#000000'} emissiveIntensity={i===0?.7:0}/></mesh>)}
    </group>
    {/* steel belt clip */}
    <mesh position={[-.48,-.04,.43]} rotation={[0,.08,-.14]}><boxGeometry args={[.06,.42,.05]}/><meshStandardMaterial color="#aeb6b7" metalness={.9} roughness={.22}/></mesh>
    {/* subtle side badge */}
    <RoundedBox args={[.36,.14,.025]} radius={.025} smoothness={2} position={[-.13,.4,.43]}><meshStandardMaterial color="#f4f1eb" roughness={.4}/></RoundedBox>
    <mesh position={[-.13,.4,.448]}><planeGeometry args={[.2,.045]}/><meshBasicMaterial color="#202526"/></mesh>
    <Hotspots {...hotspotProps}/>
  </group>;
}

export function DrillModel({ interactive=false, scale=1, ...hotspotProps }: {interactive?:boolean; scale?:number} & HotspotProps) {
 const [reducedMotion,setReducedMotion]=useState(false);
 // Stop the render loop while the canvas is off screen.
 const wrap=useRef<HTMLDivElement>(null); const [visible,setVisible]=useState(true);
 useEffect(()=>{const el=wrap.current; if(!el||!('IntersectionObserver' in window))return; const io=new IntersectionObserver(([e])=>setVisible(e.isIntersecting),{rootMargin:'120px'}); io.observe(el); return()=>io.disconnect();},[]);
 useEffect(()=>{const media=window.matchMedia('(prefers-reduced-motion: reduce)'); const update=()=>setReducedMotion(media.matches); update(); media.addEventListener('change',update); return()=>media.removeEventListener('change',update);},[]);
 return <div ref={wrap} style={{width:'100%',height:'100%'}}><CanvasBoundary fallback={<StaticDrill/>}><Canvas frameloop={visible?'always':'never'} fallback={<StaticDrill/>} shadows dpr={[1,1.7]} camera={{position:[3.25,2.2,4.2],fov:37}} gl={{antialias:true,alpha:true,powerPreference:'high-performance'}}>
  <CameraMotion interactive={interactive}/><Framing/><ambientLight intensity={.68}/><directionalLight position={[4,6,5]} intensity={3.2} castShadow shadow-mapSize={[1024,1024]}/><spotLight position={[-4,3,-2]} intensity={16} angle={.4} penumbra={1} color="#ef6c28"/>
  <Suspense fallback={null}><group scale={scale}><Tool reducedMotion={reducedMotion} {...hotspotProps}/></group><ContactShadows position={[0,-1.46,0]} opacity={.32} scale={5} blur={2.6} far={3}/></Suspense>
  <OrbitControls makeDefault enablePan={false} enableZoom={interactive} minDistance={2.7} maxDistance={7} minPolarAngle={.55} maxPolarAngle={2.3} autoRotate={!interactive&&!reducedMotion} autoRotateSpeed={.7} enableDamping dampingFactor={.08}/>
 </Canvas></CanvasBoundary></div>;
}
