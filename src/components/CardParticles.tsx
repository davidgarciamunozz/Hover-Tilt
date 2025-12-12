import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CardParticlesProps {
    cardWidth: number;
    cardHeight: number;
    count?: number;
    color?: string;
    size?: number;
    speed?: number;
}

export function CardParticles({
    cardWidth,
    cardHeight,
    count = 50,
    color = '#FFD700',
    size = 0.05,
    speed = 0.5
}: CardParticlesProps) {
    const particlesRef = useRef<THREE.Points>(null);

    // Create particle positions emanating from card edges
    const particlesData = useMemo(() => {
        const positions = new Float32Array(count * 3);
        const velocities = new Float32Array(count * 3);
        const lifetimes = new Float32Array(count);
        const sizes = new Float32Array(count);

        for (let i = 0; i < count; i++) {
            const i3 = i * 3;

            // Random edge position (top, bottom, left, right)
            const edge = Math.floor(Math.random() * 4);
            const t = Math.random();

            switch (edge) {
                case 0: // Top edge
                    positions[i3] = (t - 0.5) * cardWidth;
                    positions[i3 + 1] = cardHeight / 2;
                    velocities[i3] = (Math.random() - 0.5) * 0.5;
                    velocities[i3 + 1] = Math.random() * 2 + 1;
                    break;
                case 1: // Bottom edge
                    positions[i3] = (t - 0.5) * cardWidth;
                    positions[i3 + 1] = -cardHeight / 2;
                    velocities[i3] = (Math.random() - 0.5) * 0.5;
                    velocities[i3 + 1] = -(Math.random() * 2 + 1);
                    break;
                case 2: // Left edge
                    positions[i3] = -cardWidth / 2;
                    positions[i3 + 1] = (t - 0.5) * cardHeight;
                    velocities[i3] = -(Math.random() * 2 + 1);
                    velocities[i3 + 1] = (Math.random() - 0.5) * 0.5;
                    break;
                case 3: // Right edge
                    positions[i3] = cardWidth / 2;
                    positions[i3 + 1] = (t - 0.5) * cardHeight;
                    velocities[i3] = Math.random() * 2 + 1;
                    velocities[i3 + 1] = (Math.random() - 0.5) * 0.5;
                    break;
            }

            positions[i3 + 2] = (Math.random() - 0.5) * 0.2; // Z position
            velocities[i3 + 2] = (Math.random() - 0.5) * 0.5;

            lifetimes[i] = Math.random();
            sizes[i] = size * (0.5 + Math.random() * 0.5);
        }

        return { positions, velocities, lifetimes, sizes };
    }, [count, cardWidth, cardHeight, size]);

    const geometry = useMemo(() => {
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(particlesData.positions, 3));
        geo.setAttribute('size', new THREE.BufferAttribute(particlesData.sizes, 1));
        return geo;
    }, [particlesData]);

    // Particle shader material
    const material = useMemo(() => {
        return new THREE.ShaderMaterial({
            uniforms: {
                uColor: { value: new THREE.Color(color) },
                uTime: { value: 0 },
            },
            vertexShader: `
                attribute float size;
                varying float vAlpha;
                uniform float uTime;
                
                void main() {
                    vAlpha = 1.0;
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    gl_PointSize = size * (300.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                uniform vec3 uColor;
                varying float vAlpha;
                
                void main() {
                    // Create circular particles
                    vec2 center = gl_PointCoord - vec2(0.5);
                    float dist = length(center);
                    
                    if (dist > 0.5) discard;
                    
                    float alpha = (1.0 - dist * 2.0) * vAlpha;
                    gl_FragColor = vec4(uColor, alpha);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        });
    }, [color]);

    // Animate particles
    useFrame((state, delta) => {
        if (particlesRef.current) {
            const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;

            for (let i = 0; i < count; i++) {
                const i3 = i * 3;

                // Update position
                positions[i3] += particlesData.velocities[i3] * delta * speed * 3.0; // 3x faster
                positions[i3 + 1] += particlesData.velocities[i3 + 1] * delta * speed * 3.0;
                positions[i3 + 2] += particlesData.velocities[i3 + 2] * delta * speed * 3.0;

                // Update lifetime - much faster for quick disappearance
                particlesData.lifetimes[i] += delta * 3.0; // 3x faster lifetime = quicker disappear

                // Reset particle if lifetime exceeded (short lifetime = 0.33 seconds)
                if (particlesData.lifetimes[i] > 1.0) {
                    particlesData.lifetimes[i] = 0;

                    // Reset to edge - spawn directly on the perimeter
                    const edge = Math.floor(Math.random() * 4);
                    const t = Math.random();

                    switch (edge) {
                        case 0: // Top
                            positions[i3] = (t - 0.5) * cardWidth;
                            positions[i3 + 1] = cardHeight / 2;
                            particlesData.velocities[i3] = (Math.random() - 0.5) * 0.3;
                            particlesData.velocities[i3 + 1] = Math.random() * 1.5 + 0.5;
                            break;
                        case 1: // Bottom
                            positions[i3] = (t - 0.5) * cardWidth;
                            positions[i3 + 1] = -cardHeight / 2;
                            particlesData.velocities[i3] = (Math.random() - 0.5) * 0.3;
                            particlesData.velocities[i3 + 1] = -(Math.random() * 1.5 + 0.5);
                            break;
                        case 2: // Left
                            positions[i3] = -cardWidth / 2;
                            positions[i3 + 1] = (t - 0.5) * cardHeight;
                            particlesData.velocities[i3] = -(Math.random() * 1.5 + 0.5);
                            particlesData.velocities[i3 + 1] = (Math.random() - 0.5) * 0.3;
                            break;
                        case 3: // Right
                            positions[i3] = cardWidth / 2;
                            positions[i3 + 1] = (t - 0.5) * cardHeight;
                            particlesData.velocities[i3] = Math.random() * 1.5 + 0.5;
                            particlesData.velocities[i3 + 1] = (Math.random() - 0.5) * 0.3;
                            break;
                    }

                    positions[i3 + 2] = (Math.random() - 0.5) * 0.1;
                    particlesData.velocities[i3 + 2] = (Math.random() - 0.5) * 0.3;
                }
            }

            particlesRef.current.geometry.attributes.position.needsUpdate = true;
            (material as THREE.ShaderMaterial).uniforms.uTime.value = state.clock.elapsedTime;
        }
    });

    return (
        <points ref={particlesRef} geometry={geometry} material={material} />
    );
}
