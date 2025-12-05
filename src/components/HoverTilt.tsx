import 'hover-tilt/web-component';
import './styles.css'
import { useState, useRef, useEffect } from 'react';
import { useIsMobile } from '../hooks/usePerformance';

export function HoverTiltDemo() {
    // Performance optimizations
    const isMobile = useIsMobile();

    // Track which cards have been flipped at least once
    const [firstFlipDone, setFirstFlipDone] = useState<Set<number>>(new Set());
    // Track rotation degrees for each card
    const [rotations, setRotations] = useState<Map<number, number>>(new Map());
    // Track which card is currently active/centered
    const [activeCard, setActiveCard] = useState<number | null>(null);
    // Refs for each card container
    const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
    // Store transform values for each card
    const [cardTransforms, setCardTransforms] = useState<Map<number, string>>(new Map());

    // Calculate transform to center the active card
    useEffect(() => {
        if (activeCard !== null && cardRefs.current[activeCard]) {
            const cardElement = cardRefs.current[activeCard];
            const rect = cardElement!.getBoundingClientRect();

            // Calculate the center of the viewport
            const viewportCenterX = window.innerWidth / 2;
            const viewportCenterY = window.innerHeight / 2;

            // Calculate the center of the card
            const cardCenterX = rect.left + rect.width / 2;
            const cardCenterY = rect.top + rect.height / 2;

            // Calculate the translation needed
            const translateX = viewportCenterX - cardCenterX;
            const translateY = viewportCenterY - cardCenterY;

            // Set the transform
            setCardTransforms(prev => {
                const newMap = new Map(prev);
                newMap.set(activeCard, `translate(${translateX}px, ${translateY}px) scale(1.5)`);
                return newMap;
            });
        } else if (activeCard === null) {
            // Clear all transforms
            setCardTransforms(new Map());
        }
    }, [activeCard]);

    const toggleFlip = (cardIndex: number) => {
        const isFirstFlip = !firstFlipDone.has(cardIndex);

        // Toggle active state
        setActiveCard(prev => prev === cardIndex ? null : cardIndex);

        // Mark first flip as done
        if (isFirstFlip) {
            setFirstFlipDone(prev => new Set(prev).add(cardIndex));
        }

        // Update rotation
        setRotations(prev => {
            const newMap = new Map(prev);
            const currentRotation = newMap.get(cardIndex) || 0;
            // First flip: 360 degrees, subsequent flips: toggle 180 degrees
            const newRotation = isFirstFlip ? 360 : (currentRotation === 0 ? 180 : 0);
            newMap.set(cardIndex, newRotation);
            return newMap;
        });
    };

    return (
        <div className='flex flex-col gap-6 justify-center items-center w-full max-w-[1200px] px-4'>
            <div className='flex flex-col md:flex-row gap-6 justify-center items-center'>
                {/* Card 1 - with flip */}
                <div
                    ref={el => { cardRefs.current[0] = el; }}
                    className={`card-flip-container ${!firstFlipDone.has(0) && rotations.get(0) ? 'first-flip' : ''} ${activeCard === 0 ? 'active' : ''}`}
                    onClick={() => toggleFlip(0)}
                    style={{ transform: cardTransforms.get(0) || 'none' }}
                >
                    <div
                        className="card-flip-wrapper"
                        style={{ '--card-rotate-y': `${rotations.get(0) || 0}deg` } as React.CSSProperties}
                    >
                        <hover-tilt
                            glare-hue="180"
                            glare-mask="url(/mask/BackLines.svg)"
                            glare-mask-mode="alpha"
                            glare-intensity={4}
                            blend-mode="luminosity"
                            className="card-aura [&::part(container)]:rounded-[4.55%/3.5%]"
                        >
                            <img
                                width={400}
                                height={600}
                                src="/cards/back.png"
                                alt="Pokémon Card"
                                loading="lazy"
                                className="rounded-[inherit]"
                            />
                        </hover-tilt>
                    </div>
                </div>

                {/* Card 2 - with flip */}
                <div
                    ref={el => { cardRefs.current[1] = el; }}
                    className={`card-flip-container ${!firstFlipDone.has(1) && rotations.get(1) ? 'first-flip' : ''} ${activeCard === 1 ? 'active' : ''}`}
                    onClick={() => toggleFlip(1)}
                    style={{ transform: cardTransforms.get(1) || 'none' }}
                >
                    <div
                        className="card-flip-wrapper"
                        style={{ '--card-rotate-y': `${rotations.get(1) || 0}deg` } as React.CSSProperties}
                    >
                        <hover-tilt
                            glare-hue="180"
                            glare-mask="url(/mask/BackLines1.png)"
                            glare-mask-mode="luminance"
                            glare-intensity={4}
                            blend-mode="luminosity"
                            className="card-aura [&::part(container)]:rounded-[4.55%/3.5%]"
                        >
                            <img
                                width={400}
                                height={600}
                                src="/cards/back1.png"
                                alt="Pokémon Card"
                                loading="lazy"
                                className="rounded-[inherit]"
                            />
                        </hover-tilt>
                    </div>
                </div>

                {/* Card 3 - with flip */}
                {/* <div
                    ref={el => { cardRefs.current[2] = el; }}
                    className={`card-flip-container ${!firstFlipDone.has(2) && rotations.get(2) ? 'first-flip' : ''} ${activeCard === 2 ? 'active' : ''}`}
                    onClick={() => toggleFlip(2)}
                    style={{ transform: cardTransforms.get(2) || 'none' }}
                >
                    <div
                        className="card-flip-wrapper"
                        style={{ '--card-rotate-y': `${rotations.get(2) || 0}deg` } as React.CSSProperties}
                    >
                        <hover-tilt
                            glare-hue="180"
                            glare-mask="url(/mask/w-mark-pattern.png)"
                            glare-mask-mode="luminance"
                            glare-intensity={5}
                            blend-mode="luminosity"
                            className="card-aura [&::part(container)]:rounded-[4.55%/3.5%] luminance-beam"
                        >
                            <img
                                width={400}
                                height={600}
                                src="/cards/back2.png"
                                alt="Pokémon Card"
                                loading="lazy"
                                className="rounded-[inherit]"
                            />
                        </hover-tilt>
                    </div>
                </div> */}

                {/* Charizard - with flip */}
                <div
                    ref={el => { cardRefs.current[2] = el; }}
                    className={`card-flip-container ${!firstFlipDone.has(2) && rotations.get(2) ? 'first-flip' : ''} ${activeCard === 2 ? 'active' : ''}`}
                    onClick={() => toggleFlip(2)}
                    style={{ transform: cardTransforms.get(2) || 'none' }}
                >
                    <div
                        className="card-flip-wrapper"
                        style={{ '--card-rotate-y': `${rotations.get(2) || 0}deg` } as React.CSSProperties}
                    >
                        <hover-tilt
                            className="card-aura [&::part(container)]:rounded-[4.55%/3.5%] luminance-beam vstar-card"
                            glare-intensity={1}
                            tilt-factor={isMobile ? 2 : 3}
                            spring-options={isMobile
                                ? '{ "stiffness": 0.12, "damping": 0.18 }'
                                : '{ "stiffness": 0.08, "damping": 0.15 }'}
                        >
                            <div className="vstar-card-content">
                                <img
                                    width={400}
                                    height={600}
                                    src="/cards/pokemon/charizard.png"
                                    alt="Pokémon Card"
                                    loading="lazy"
                                    className="rounded-[inherit] card__front-img"
                                />
                                <div className="card__shine"></div>
                                <div className="card__glare"></div>
                            </div>
                        </hover-tilt>
                    </div>
                </div>

                {/* 3d card effect - with flip */}
                <div
                    ref={el => { cardRefs.current[3] = el; }}
                    className={`card-flip-container ${!firstFlipDone.has(3) && rotations.get(3) ? 'first-flip' : ''} ${activeCard === 3 ? 'active' : ''}`}
                    onClick={() => toggleFlip(3)}
                    style={{ transform: cardTransforms.get(3) || 'none' }}
                >
                    <div
                        className="card-flip-wrapper"
                        style={{ '--card-rotate-y': `${rotations.get(3) || 0}deg` } as React.CSSProperties}
                    >
                        <hover-tilt
                            shadow-blur="30"
                            scale-factor="1.15"
                            glare-hue="180"
                            glare-mask="url(/mask/w-mark-pattern.svg)"
                            glare-mask-mode="alpha"
                            glare-intensity={1}
                            blend-mode="overlay"
                            spring-options='{ "stiffness": 0.08, "damping": 0.15 }'
                            className="card-aura card-face front luminance-beam stacked-3d"
                        >
                            <div className='stacked-3d-content'>
                                <img src="/cards/back2.png" width={400} height={600} alt="3d card" className="stacked-3d-bg" />
                                <img src="/cards/3d-pop.png" width={400} height={600} alt="3d pop" className="stacked-3d-logo" />
                            </div>
                        </hover-tilt>

                    </div>
                </div>
            </div>

            {/* experimental cards */}
            {/* 
            <div className='flex gap-6 justify-center items-center w-[700px]'>
                <hover-tilt
                    shadow
                    glare-hue="180"
                    glare-mask="url(/mask/BackLines.png)"
                    glare-mask-mode="luminance"
                    glare-intensity={4}
                    blend-mode="luminosity"
                    className="[&::part(container)]:rounded-[4.55%/3.5%]"
                >
                    <img
                        width={400}
                        height={600}
                        src="/cards/back.png"
                        alt="Pokémon #0133: Eevee Reverse Holo Masterball"
                        loading="lazy"
                        className="rounded-[inherit]"
                    />
                </hover-tilt>
                <hover-tilt
                    shadow
                    glare-hue="180"
                    glare-mask="url(/mask/BackLines1.png)"
                    glare-mask-mode="luminance"
                    glare-intensity={4}
                    blend-mode="luminosity"
                    className="[&::part(container)]:rounded-[4.55%/3.5%]"
                >
                    <img
                        width={400}
                        height={600}
                        src="/cards/back1.png"
                        alt="Pokémon #0133: Eevee Reverse Holo Masterball"
                        loading="lazy"
                        className="rounded-[inherit]"
                    />
                </hover-tilt>
                <hover-tilt
                    shadow
                    glare-hue="180"
                    glare-mask="url(/mask/w-mark-pattern.png)"
                    glare-mask-mode="luminance"
                    glare-intensity={5}
                    blend-mode="luminosity"
                    className="[&::part(container)]:rounded-[4.55%/3.5%] luminance-beam"
                >
                    <img
                        width={400}
                        height={600}
                        src="/cards/back2.png"
                        alt="Pokémon #0133: Eevee Reverse Holo Masterball"
                        loading="lazy"
                        className="rounded-[inherit]"
                    />
                </hover-tilt>


            </div> */}

        </div>
    );
}