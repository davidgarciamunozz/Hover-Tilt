import { useState } from 'react';
import 'hover-tilt/web-component';
import './styles.css'

export function HoverTiltDemo() {
    const [msg, setMsg] = useState('Tilt me!');

    return (
        <>
            <hover-tilt
                shadow blend-mode="overlay"
                glare-intensity=".5"
                glare-hue="180"
                glare-mask="url(/mask/BackLines.png)"
                glare-mask-mode="luminance"
                glare-intensity={4}
                blend-mode="luminosity"
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
            <input
                value={msg}
                onChange={(event) => setMsg(event.target.value)}
                placeholder="Type a message..."
            />
        </>
    );
}