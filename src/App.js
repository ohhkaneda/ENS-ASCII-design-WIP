// Threejs example: threejs.org/examples/?q=asc#webgl_effects_ascii

import { useEffect, useRef, useState, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, PresentationControls, useCursor, useGLTF } from '@react-three/drei'
import { AsciiEffect } from 'three-stdlib'

export default function App() {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
      <color attach="background" args={['black']} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      <pointLight position={[-10, -10, -10]} />
      <PresentationControls
        global
        config={{ mass: 2, tension: 500 }}
        snap={{ mass: 4, tension: 1900 }}
        rotation={[-4.21, 0, -0.1]}
        polar={[-Math.PI / 1, Math.PI / 3]}
        azimuth={[-Math.PI / 1.03, Math.PI / 1.05]}>
        <ENS rotation={[-Math.PI / 0.1, 0, 0]} position={[-0.1, -5, 1.9]} scale={0.25} />
      </PresentationControls>
      <OrbitControls />
      <AsciiRenderer invert />
    </Canvas>
  )
}

function ENS(props) {
  const ref = useRef()
  const { nodes, materials } = useGLTF('/ENS.glb')
  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    ref.current.rotation.x = -Math.PI / 1.75 + Math.cos(t / 4) / 8
    ref.current.rotation.y = Math.sin(t / 4) / 8
    ref.current.rotation.z = (1 + Math.sin(t / 1.5)) / 20
    ref.current.position.y = (1 + Math.sin(t / 1.5)) / 10
  })
  return (
    <group ref={ref} {...props} dispose={null}>
      <mesh
        geometry={nodes.Curve001.geometry}
        material={materials['SVGMat.003']}
        position={[-6.58, 0.51, -1.26]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={76.66}
      />
      <mesh
        geometry={nodes.Curve002.geometry}
        material={materials['SVGMat.001']}
        position={[-6.58, 0.51, -1.26]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={76.66}
      />
      <mesh
        geometry={nodes.Curve003.geometry}
        material={materials['SVGMat.004']}
        position={[-6.58, 0.51, -1.26]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={76.66}
      />
      <mesh
        geometry={nodes.Curve004.geometry}
        material={materials['SVGMat.002']}
        position={[-6.6, 0.51, -1.3]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={76.66}></mesh>
    </group>
  )
}

function Torusknot(props) {
  const ref = useRef()
  const [clicked, click] = useState(false)
  const [hovered, hover] = useState(false)
  useCursor(hovered)
  useFrame((state, delta) => (ref.current.rotation.x = ref.current.rotation.y += delta / 2))
  return (
    <mesh
      {...props}
      ref={ref}
      scale={clicked ? 1.5 : 1.25}
      onClick={() => click(!clicked)}
      onPointerOver={() => hover(true)}
      onPointerOut={() => hover(false)}>
      <torusKnotGeometry args={[1, 0.2, 128, 32]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  )
}

function AsciiRenderer({ renderIndex = 1, characters = ' .:-+-%', ...options }) {
  // Reactive state
  const { size, gl, scene, camera } = useThree()

  // Create effect
  const effect = useMemo(() => {
    const effect = new AsciiEffect(gl, characters, options)
    effect.domElement.style.position = 'absolute'
    effect.domElement.style.top = '0px'
    effect.domElement.style.left = '0px'
    effect.domElement.style.color = 'white'
    effect.domElement.style.backgroundColor = 'black'
    effect.domElement.style.pointerEvents = 'none'
    return effect
  }, [characters, options.invert])

  // Append on mount, remove on unmount
  useEffect(() => {
    gl.domElement.parentNode.appendChild(effect.domElement)
    return () => gl.domElement.parentNode.removeChild(effect.domElement)
  }, [effect])

  // Set size
  useEffect(() => {
    effect.setSize(size.width, size.height)
  }, [effect, size])

  // Take over render-loop (that is what the index is for)
  useFrame((state) => {
    effect.render(scene, camera)
  }, renderIndex)

  // This component returns nothing, it has no view, it is a purely logical
}
