import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CardAuraProps {
    cardWidth: number;
    cardHeight: number;
    color1?: string;
    color2?: string;
    intensity?: number;
}

export function CardAura({ cardWidth, cardHeight, color1 = '#FFD700', color2 = '#00FFFF', intensity = 1.0 }: CardAuraProps) {
    const auraRef = useRef<THREE.Mesh>(null);

    // Create custom aura shader for border glow
    const auraUniforms = useMemo(() => ({
        uTime: { value: 0 },
        uColor1: { value: new THREE.Color(color1) },
        uColor2: { value: new THREE.Color(color2) },
        uIntensity: { value: intensity },
        uCardSize: { value: new THREE.Vector2(cardWidth, cardHeight) },
    }), [color1, color2, intensity, cardWidth, cardHeight]);

    const vertexShader = `
        varying vec2 vUv;
        
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `;

    const fragmentShader = `
        uniform float uTime;
        uniform vec3 uColor1;
        uniform vec3 uColor2;
        uniform float uIntensity;
        uniform vec2 uCardSize;
        varying vec2 vUv;
        
        void main() {
            // Convert UV to centered coordinates (-0.5 to 0.5)
            vec2 centered = vUv - 0.5;
            
            // Calculate distance to card boundary
            // The plane is 1.15x the card, so card edges are at ±0.435 (0.5/1.15)
            float cardBoundary = 0.435;
            
            // Smooth distance to rectangle (fixes corner seams)
            vec2 d = abs(centered) - vec2(cardBoundary);
            
            // For points outside: use length of the overshoot vector
            // For points inside: use the max component (negative)
            float distPastEdge = length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
            
            // Create pulsing effect
            float pulse = sin(uTime * 3.0) * 0.15 + 0.85;
            
            // Border glow - bright at card edge, fades outward
            // Smooth gradient with no visible seams
            float borderGlow = 1.0 - smoothstep(0.0, 0.065, distPastEdge);
            borderGlow *= pulse;
            
            // Color cycling along the perimeter
            float angle = atan(centered.y, centered.x);
            float colorMix = (sin(angle * 2.0 + uTime * 2.0) + 1.0) * 0.5;
            vec3 color = mix(uColor1, uColor2, colorMix);
            
            // Apply glow and intensity
            vec3 finalColor = color * borderGlow * uIntensity;
            float alpha = borderGlow * 0.8;
            
            gl_FragColor = vec4(finalColor, alpha);
        }
    `;

    // Animate the aura
    useFrame((state) => {
        if (auraRef.current) {
            const material = auraRef.current.material as THREE.ShaderMaterial;
            material.uniforms.uTime.value = state.clock.elapsedTime;
        }
    });

    return (
        <mesh ref={auraRef} position={[0, 0, -0.02]}>
            <planeGeometry args={[cardWidth * 1.15, cardHeight * 1.15]} />
            <shaderMaterial
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={auraUniforms}
                transparent={true}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
            />
        </mesh>
    );
}
