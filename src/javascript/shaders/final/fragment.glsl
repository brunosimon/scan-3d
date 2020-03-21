#pragma glslify: random = require(../utils/random2d.glsl)

uniform sampler2D tDiffuse;
uniform float uNoiseMultiplier;
uniform float uTime;
uniform float uRGBOffsetMultiplier;
uniform float uRGBOffsetOffset;
uniform float uRGBOffsetPower;
uniform vec3 uOverlayColor;
uniform float uOverlayAlpha;

varying vec2 vUv;

void main()
{
    vec4 diffuseColor = texture2D(tDiffuse, vUv);

    // RGB Offset
    float rgbOffsetStrength = pow(max(0.0, distance(vUv, vec2(0.5)) * uRGBOffsetMultiplier - uRGBOffsetOffset), uRGBOffsetPower);

    vec2 rUV = vUv + vec2(cos((3.14 * 2.0) / 3.0 + 1.0), sin((3.14 * 2.0) / 3.0 + 1.0)) * rgbOffsetStrength;
    vec2 gUV = vUv + vec2(cos(- (3.14 * 2.0) / 3.0 + 1.0), sin(- (3.14 * 2.0) / 3.0 + 1.0)) * rgbOffsetStrength;
    vec2 bUV = vUv + vec2(cos(0.0), sin(0.0)) * rgbOffsetStrength;

    vec4 diffuseColorR = texture2D(tDiffuse, rUV);
    vec4 diffuseColorG = texture2D(tDiffuse, gUV);
    vec4 diffuseColorB = texture2D(tDiffuse, bUV);
    vec3 finalColor = vec3(diffuseColorR.r, diffuseColorG.g, diffuseColorB.b);

    // Noise
    finalColor.r += (random(vUv + uTime * 0.00001) - 0.5) * uNoiseMultiplier;
    finalColor.g += (random(vUv + vec2(0.1) + uTime * 0.00001) - 0.5) * uNoiseMultiplier;
    finalColor.b += (random(vUv + vec2(0.1) + uTime * 0.00001) - 0.5) * uNoiseMultiplier;

    // Overlay
    finalColor.rgb = mix(finalColor.rgb, uOverlayColor, uOverlayAlpha);

    // gl_FragColor = vec4(vec3(rgbOffsetStrength), 1.0);
    gl_FragColor = vec4(finalColor, 1.0);
}
