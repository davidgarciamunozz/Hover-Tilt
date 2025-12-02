import React from 'react';

declare global {
    namespace JSX {
        interface IntrinsicElements {
            'hover-tilt': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
                'tilt-factor'?: string;
                'scale-factor'?: string;
                'shadow'?: boolean;
                'blend-mode'?: string;
                'glare-intensity'?: number;
                'glare-hue'?: string;
                'glare-mask'?: string;
                'glare-mask-mode'?: string;
            };
        }
    }
}

export { };
