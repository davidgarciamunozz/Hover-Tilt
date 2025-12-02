/// <reference types="vite/client" />
import * as React from 'react';

interface HoverTiltAttributes extends React.HTMLAttributes<HTMLElement> {
    'tilt-factor'?: string | number;
    'scale-factor'?: string | number;
    'shadow'?: boolean;
    'blend-mode'?: string;
    'glare-intensity'?: string | number;
    'glare-hue'?: string | number;
    'glare-mask'?: string;
    'glare-mask-mode'?: string;
}

// Augment global JSX
declare global {
    namespace JSX {
        interface IntrinsicElements {
            'hover-tilt': React.DetailedHTMLProps<HoverTiltAttributes, HTMLElement>;
        }
    }
}

// Augment React.JSX
declare module 'react' {
    namespace JSX {
        interface IntrinsicElements {
            'hover-tilt': React.DetailedHTMLProps<HoverTiltAttributes, HTMLElement>;
        }
    }
}
