import 'hover-tilt/web-component';
import './styles.css'

export function HoverTiltDemo() {

    return (
        <div className='flex flex-col gap-6 justify-center items-center w-full max-w-[1200px] px-4'>
            <div className='flex flex-col md:flex-row gap-6 justify-center items-center'>
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
                {/* 3d card effect */}
                <hover-tilt
                    shadow
                    shadow-blur="30"
                    scale-factor="1.15"
                    glare-hue="180"
                    glare-mask="url(/mask/w-mark-pattern.png)"
                    glare-mask-mode="luminance"
                    glare-intensity={5}
                    blend-mode="plus-lighter"
                    spring-options='{ "stiffness": 0.08, "damping": 0.15 }'
                    className="luminance-beam stacked-3d"
                >
                    <div className='stacked-3d-content'>
                        <img src="/cards/back2.png" width={400} height={600} alt="3d card" className="stacked-3d-bg" />
                        <img src="/cards/3d-pop.png" width={400} height={600} alt="3d pop" className="stacked-3d-logo" />

                    </div>
                </hover-tilt>
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