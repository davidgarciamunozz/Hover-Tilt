import 'hover-tilt/web-component';
import './styles.css'

export function HoverTiltDemo() {

    return (
        <>
            <div className='flex gap-2'>
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
            </div>
        </>
    );
}