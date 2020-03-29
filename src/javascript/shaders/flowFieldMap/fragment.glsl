uniform mat4 uSpaceMatrix;
uniform sampler2D uBaseTexture;
uniform sampler2D uTexture;
uniform float uTime;
uniform float uStrengthFrequency;
uniform float uStrengthOffset;
uniform float uStrengthPower;
uniform float uLifeSpeed;
uniform float uTurbulencesTimeFrequency;
uniform float uTurbulencesFrequency;
uniform float uTurbulencesSpeed;
uniform vec3 uTurbulencesDirection;

varying vec2 vUv;

#pragma glslify: random2d = require(../utils/random2d.glsl)
#pragma glslify: simplexPerlin4d = require(../utils/simplexPerlin4d.glsl)

void main()
{
    // Get previous color
    vec4 color = texture2D(uTexture, vUv);
    vec4 baseColor = texture2D(uBaseTexture, vUv);

    // Space color
    vec4 spaceColor = uSpaceMatrix * vec4(color.rgb, 1.0);
    vec4 spaceBaseColor = uSpaceMatrix * vec4(baseColor.rgb, 1.0);

    // Flow strength
    float flowStrength = max(simplexPerlin4d(spaceBaseColor * uStrengthFrequency) + uStrengthOffset, 0.0);
    flowStrength = pow(flowStrength, uStrengthPower);

    // Create new color
    vec4 newColor = vec4(0.0);

    // Decrease life
    newColor.a = color.a - uLifeSpeed * 1.0 * flowStrength;

    // Is dead
    if(newColor.a < 0.0)
    {
        // Reset
        newColor.rgb = baseColor.rgb;
        newColor.a = 1.0;
    }

    // Is alive
    else
    {
        newColor.r = color.r + (simplexPerlin4d(vec4((spaceColor.rgb + 0.0   ) * uTurbulencesFrequency, uTime * uTurbulencesTimeFrequency)) + uTurbulencesDirection.x) * uTurbulencesSpeed * flowStrength;
        newColor.g = color.g + (simplexPerlin4d(vec4((spaceColor.rgb + 1234.0) * uTurbulencesFrequency, uTime * uTurbulencesTimeFrequency)) + uTurbulencesDirection.y) * uTurbulencesSpeed * flowStrength;
        newColor.b = color.b + (simplexPerlin4d(vec4((spaceColor.rgb + 9876.0) * uTurbulencesFrequency, uTime * uTurbulencesTimeFrequency)) + uTurbulencesDirection.z) * uTurbulencesSpeed * flowStrength;
    }

    gl_FragColor = newColor;
}
