import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { useRef, useState, useMemo } from 'react';

// Import shaders
import holographicVertexShader from './HolographicCard/shaders/holographic.vert?raw';
import holographicFragmentShader from './HolographicCard/shaders/holographic.frag?raw';

// Import effects
import { CardAura } from './CardAura';
import { CardParticles } from './CardParticles';

interface CardProps {
    frontImg: string;
    backImg: string;
    maskImg?: string;
    foilImg?: string;
    glowRadius?: number;
    glowIntensity?: number;
    tiltIntensity?: number;
    position?: [number, number, number]; // 3D position in space
    enableAura?: boolean;
    enableParticles?: boolean;
    auraColor1?: string;
    auraColor2?: string;
    particleColor?: string;
    particleCount?: number;
    cardWidth?: number; // Custom card width
    cardHeight?: number; // Custom card height
}

function Card({
    frontImg,
    backImg,
    maskImg,
    foilImg,
    glowRadius = 0.8,
    glowIntensity = 0.8,
    tiltIntensity = 0.15,
    position = [0, 0, 0],
    enableAura = false,
    enableParticles = false,
    auraColor1 = '#FFD700',
    auraColor2 = '#FF1493',
    particleColor = '#FFD700',
    particleCount = 50,
    cardWidth: customCardWidth,
    cardHeight: customCardHeight
}: CardProps) {
    // Load textures
    const texturesToLoad = [frontImg, backImg];
    if (maskImg) texturesToLoad.push(maskImg);
    if (foilImg) texturesToLoad.push(foilImg);

    const loadedTextures = useTexture(texturesToLoad);

    const frontTexture = loadedTextures[0];
    const backTexture = loadedTextures[1];
    const maskTexture = maskImg ? loadedTextures[2] : null;
    const foilTexture = (maskImg && foilImg) ? loadedTextures[3] : (foilImg ? loadedTextures[2] : null);

    // Card dimensions - use custom dimensions or defaults (Pokemon card proportions)
    const cardWidth = customCardWidth ?? 2;
    const cardHeight = customCardHeight ?? 2.8;

    // Refs for shader material, mesh, and group
    const shaderMaterialRef = useRef<THREE.ShaderMaterial>(null);
    const meshRef = useRef<THREE.Mesh>(null);
    const groupRef = useRef<THREE.Group>(null);

    // Mouse tracking state
    const [hoverOpacity, setHoverOpacity] = useState(1); // Start at 1 for debugging
    const [targetRotation, setTargetRotation] = useState({ x: 0, y: 0 });

    // Create shader uniforms
    const uniforms = useMemo(() => ({
        uFrontTexture: { value: frontTexture },
        uFoilTexture: { value: foilTexture || frontTexture },
        uMaskTexture: { value: maskTexture || frontTexture },
        uPointer: { value: new THREE.Vector2(0.5, 0.5) },
        uTilt: { value: new THREE.Vector2(0, 0) },
        uHoverOpacity: { value: 0 },
        uTime: { value: 0 },
        uGlowRadius: { value: glowRadius },
        uGlowIntensity: { value: glowIntensity },
    }), [frontTexture, foilTexture, maskTexture, glowRadius, glowIntensity]);

    // Target rotation for smooth interpolation
    const currentRotation = useRef({ x: 0, y: 0 });

    // Mouse move handler
    const handlePointerMove = (event: any) => {
        // In React Three Fiber, the event already has UV coordinates!
        if (event.uv && shaderMaterialRef.current) {
            const uv = event.uv;

            // Calculate tilt based on pointer position relative to center
            const tiltX = (uv.x - 0.5) * 2; // -1 to 1
            const tiltY = (uv.y - 0.5) * 2; // -1 to 1

            // Update shader uniforms directly
            shaderMaterialRef.current.uniforms.uPointer.value.set(uv.x, uv.y);
            shaderMaterialRef.current.uniforms.uTilt.value.set(tiltX, tiltY);

            // Calculate target rotation for 3D tilt
            // Rotate on X-axis based on vertical position (inverted for natural feel)
            // Rotate on Y-axis based on horizontal position
            setTargetRotation({
                x: -tiltY * tiltIntensity, // Negative for natural tilt direction
                y: tiltX * tiltIntensity
            });
        }
    };
    const handlePointerEnter = () => {
        console.log('Pointer ENTERED - activating holographic effect');
        setHoverOpacity(1);
    };

    const handlePointerLeave = () => {
        console.log('Pointer LEFT - deactivating holographic effect');
        setHoverOpacity(0);
    };

    // Animation loop
    useFrame((state) => {
        if (shaderMaterialRef.current) {
            // Smooth transition for hover opacity
            const currentOpacity = shaderMaterialRef.current.uniforms.uHoverOpacity.value;
            const targetOpacity = hoverOpacity;
            shaderMaterialRef.current.uniforms.uHoverOpacity.value = THREE.MathUtils.lerp(
                currentOpacity,
                targetOpacity,
                0.1
            );

            // Update time uniform
            shaderMaterialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
        }

        // Smooth rotation animation
        if (groupRef.current) {
            // Lerp current rotation toward target rotation for smooth movement
            currentRotation.current.x = THREE.MathUtils.lerp(
                currentRotation.current.x,
                targetRotation.x,
                0.1
            );
            currentRotation.current.y = THREE.MathUtils.lerp(
                currentRotation.current.y,
                targetRotation.y,
                0.1
            );

            // Apply rotation to the group
            groupRef.current.rotation.x = currentRotation.current.x;
            groupRef.current.rotation.y = currentRotation.current.y;
        }
    });

    return (
        <group ref={groupRef} position={position}>
            {/* Aura effect */}
            {enableAura && (
                <CardAura
                    cardWidth={cardWidth}
                    cardHeight={cardHeight}
                    color1={auraColor1}
                    color2={auraColor2}
                    intensity={1.5}
                />
            )}

            {/* Particle effects */}
            {enableParticles && (
                <CardParticles
                    cardWidth={cardWidth}
                    cardHeight={cardHeight}
                    count={particleCount}
                    color={particleColor}
                    size={0.04} // Smaller particles for sparkle effect
                    speed={1.0}
                />
            )}

            {/* Front face with holographic shader */}
            {maskTexture && foilTexture ? (
                <mesh
                    ref={meshRef}
                    position={[0, 0, 0.01]}
                    onPointerMove={handlePointerMove}
                    onPointerEnter={handlePointerEnter}
                    onPointerLeave={handlePointerLeave}
                >
                    <planeGeometry args={[cardWidth, cardHeight]} />
                    <shaderMaterial
                        ref={shaderMaterialRef}
                        vertexShader={holographicVertexShader}
                        fragmentShader={holographicFragmentShader}
                        uniforms={uniforms}
                        transparent={false}
                        side={THREE.FrontSide}
                    />
                </mesh>
            ) : (
                // Fallback to basic material if no mask/foil
                <mesh position={[0, 0, 0.01]}>
                    <planeGeometry args={[cardWidth, cardHeight]} />
                    <meshBasicMaterial
                        map={frontTexture}
                        side={THREE.FrontSide}
                    />
                </mesh>
            )}

            {/* Back face */}
            <mesh position={[0, 0, -0.01]} rotation={[0, Math.PI, 0]}>
                <planeGeometry args={[cardWidth, cardHeight]} />
                <meshBasicMaterial
                    map={backTexture}
                    side={THREE.FrontSide}
                />
            </mesh>
        </group>
    );
}

interface CardSceneProps {
    cards: Array<{
        frontImg: string;
        backImg: string;
        maskImg?: string;
        foilImg?: string;
        glowRadius?: number;
        glowIntensity?: number;
        tiltIntensity?: number;
        position?: [number, number, number];
        enableAura?: boolean;
        enableParticles?: boolean;
        auraColor1?: string;
        auraColor2?: string;
        particleColor?: string;
        particleCount?: number;
        cardWidth?: number;
        cardHeight?: number;
    }>;
}

export function CardScene({ cards }: CardSceneProps) {
    return (
        <div style={{ width: '100vw', height: '100vh' }}>
            <Canvas
                camera={{ position: [0, 0, 5], fov: 50 }}
                gl={{
                    antialias: true,
                    alpha: true,
                }}
            >
                {/* Lighting */}
                <ambientLight intensity={0.8} />
                <directionalLight position={[5, 5, 5]} intensity={0.5} />

                {/* Render all cards */}
                {cards.map((card, index) => (
                    <Card key={index} {...card} />
                ))}

                {/* Controls for development/testing */}
                <OrbitControls
                    enableZoom={true}
                    enablePan={false}
                    minDistance={3}
                    maxDistance={10}
                />
            </Canvas>
        </div>
    );
}
