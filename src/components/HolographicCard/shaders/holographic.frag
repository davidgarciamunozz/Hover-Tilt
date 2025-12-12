uniform sampler2D uFrontTexture;
uniform sampler2D uFoilTexture;
uniform sampler2D uMaskTexture;
uniform vec2 uPointer;          // Pointer position (0-1 range)
uniform vec2 uTilt;             // Tilt values (-1 to 1)
uniform float uHoverOpacity;    // Hover state (0-1)
uniform float uTime;            // Time for animations
uniform float uGlowRadius;      // Glow radius (0-1, controls falloff distance)
uniform float uGlowIntensity;   // Glow intensity (0-1+, controls brightness)

varying vec2 vUv;

// Sunpillar/Rainbow colors (matching CSS exactly)
const vec3 sunpillar1 = vec3(1.0, 0.45, 0.45);   // hsl(2, 100%, 73%) - Red
const vec3 sunpillar2 = vec3(1.0, 0.93, 0.38);   // hsl(53, 100%, 69%) - Yellow
const vec3 sunpillar3 = vec3(0.69, 1.0, 0.38);   // hsl(93, 100%, 69%) - Green
const vec3 sunpillar4 = vec3(0.52, 1.0, 1.0);    // hsl(176, 100%, 76%) - Cyan
const vec3 sunpillar5 = vec3(0.48, 0.48, 1.0);   // hsl(228, 100%, 74%) - Blue
const vec3 sunpillar6 = vec3(0.93, 0.46, 0.93);  // hsl(283, 100%, 73%) - Magenta

// Create repeating rainbow gradient
vec3 getRainbowColor(float y) {
    float colorStep = mod(y * 3.5, 6.0); // 3.5 for nice visible stripes
    
    if (colorStep < 1.0) return mix(sunpillar1, sunpillar2, fract(colorStep));
    if (colorStep < 2.0) return mix(sunpillar2, sunpillar3, fract(colorStep));
    if (colorStep < 3.0) return mix(sunpillar3, sunpillar4, fract(colorStep));
    if (colorStep < 4.0) return mix(sunpillar4, sunpillar5, fract(colorStep));
    if (colorStep < 5.0) return mix(sunpillar5, sunpillar6, fract(colorStep));
    return mix(sunpillar6, sunpillar1, fract(colorStep));
}

// Metallic streaks
float getMetallicStreaks(vec2 uv, vec2 offset) {
    float angle = 2.32; // 133 degrees
    float rotatedY = (uv.x + offset.x) * sin(angle) + (uv.y + offset.y) * cos(angle);
    float pattern = mod(rotatedY * 100.0, 10.0);
    
    if (pattern < 3.8) return 0.1;
    if (pattern < 4.5) return 0.8;
    if (pattern < 5.2) return 0.8;
    return 0.1;
}

void main() {
    // Sample base card texture
    vec4 baseColor = texture2D(uFrontTexture, vUv);
    
    // Calculate dynamic background positions (matching CSS)
    float backgroundY = 0.33 + (uTilt.y * 0.34);
    vec2 backgroundPos = vec2(0.37 + (uTilt.x * 0.26), backgroundY);
    
    // === LAYER 1: Rainbow Gradient ===
    float rainbowY = vUv.y + backgroundY * 2.0;
    vec3 rainbowColor = getRainbowColor(rainbowY);
    
    // === LAYER 2: Foil Texture ===
    vec4 foilColor = texture2D(uFoilTexture, vUv);
    
    // === LAYER 3: Metallic Streaks (Dual-directional) ===
    // First layer - normal direction
    float streaks1 = getMetallicStreaks(vUv, backgroundPos);
    
    // Second layer - inverted direction (matching CSS ::after)
    vec2 invertedPos = vec2(-backgroundPos.x, -backgroundPos.y);
    float streaks2 = getMetallicStreaks(vUv, invertedPos);
    
    // Combine both layers for intersecting streaks
    float streaksPattern = max(streaks1, streaks2 * 0.8); // Second layer slightly less intense
    
    // === LAYER 4: Radial Gradient from Pointer ===
    vec2 toPointer = vUv - uPointer;
    float distToPointer = length(toPointer);
    float radialGlow = 1.0 - smoothstep(0.0, uGlowRadius, distToPointer); // Use uniform for radius
    
    // === Blend Layers (approximating CSS blend modes) ===
    
    // Start with foil texture
    vec3 shineColor = foilColor.rgb;
    
    // Mix with rainbow - INCREASED for more vibrant colors
    float luminance = dot(shineColor, vec3(0.299, 0.587, 0.114));
    vec3 rainbowBlend = mix(shineColor, rainbowColor, 0.85); // Increased from 0.6
    shineColor = mix(shineColor, rainbowBlend, 0.9); // Increased from 0.7
    
    // Add metallic streaks (hard-light approximation) - now using dual-layer pattern
    vec3 streakColor = vec3(streaksPattern);
    shineColor = mix(shineColor, shineColor * streakColor * 2.0, 0.6); // Increased mix for more visible streaks
    
    // === Color Adjustments (matching CSS filters) ===
    
    // Calculate pointer from center (for brightness adjustment)
    float pointerFromCenter = length(uPointer - vec2(0.5, 0.5)) / 0.707;
    
    // Brightness: increases near pointer - BOOSTED
    float brightness = 2.0 + (pointerFromCenter * 1.2) + (radialGlow * 1.5); // Increased from 1.5, 0.8, 0.7
    shineColor *= brightness;
    
    // Contrast boost - INCREASED
    shineColor = (shineColor - 0.5) * 3.0 + 0.5; // Increased from 2.5
    
    // Saturation boost - MASSIVELY INCREASED for rainbow vibrancy
    float gray = dot(shineColor, vec3(0.299, 0.587, 0.114));
    shineColor = mix(vec3(gray), shineColor, 3.5); // Increased from 2.5
    
    // Clamp to prevent over-bright values
    shineColor = clamp(shineColor, 0.0, 1.5);
    
    // === Masking ===
    
    // Sample mask texture
    vec4 maskColor = texture2D(uMaskTexture, vUv);
    float maskAlpha = maskColor.r;
    
    // Combine static mask with radial spotlight
    float radialMask = radialGlow * 0.6;
    float combinedMask = maskAlpha * (0.4 + radialMask);
    
    // === Final Blend (Color Dodge approximation) ===
    
    // Color dodge: makes bright areas extremely bright
    vec3 dodgedColor = baseColor.rgb / (1.0 - shineColor * 0.5 + 0.001); // Increased from 0.4
    
    // Mix based on mask and hover opacity
    vec3 finalColor = mix(baseColor.rgb, dodgedColor, combinedMask * uHoverOpacity);
    
    // Add BRIGHT WHITE atmospheric glow around pointer - ADJUSTABLE
    vec3 glowColor = vec3(1.0); // Pure white
    float glowStrength = pow(radialGlow, 0.8) * uHoverOpacity * uGlowIntensity; // Use uniform for intensity
    finalColor = mix(finalColor, glowColor, glowStrength);
    
    gl_FragColor = vec4(finalColor, baseColor.a);
}
