import { useState } from 'react';
import 'hover-tilt/web-component';
import './styles.css'

export function HoverTiltDemo() {
    const [msg, setMsg] = useState('Tilt me!');

    return (
        <>
            <hover-tilt
                tilt-factor="1.5"
                scale-factor="1.1"
                shadow blend-mode="overlay"
                glare-intensity=".5"
                glare-hue="180"
                glare-mask="url(/mask/vmaxbg.jpg)"
                glare-mask-mode="luminance"
            >
                <div className="card">
                    <h1>{msg}</h1>
                </div>
            </hover-tilt>
            <input
                value={msg}
                onChange={(event) => setMsg(event.target.value)}
                placeholder="Type a message..."
            />
        </>
    );
}