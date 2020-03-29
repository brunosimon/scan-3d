uniform mat4 uSpaceMatrix;
uniform sampler2D uBaseTexture;
uniform sampler2D uTexture;
uniform float uTime;
uniform float uTimeFrequency;
uniform float uFlowFrequency;
uniform float uFlowSpeed;
uniform vec3 uFlowDirection;
uniform float uFlowStrengthFrequency;
uniform float uFlowStrengthOffset;
uniform float uFlowStrengthPower;
uniform float uLifeSpeed;

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
    float flowStrength = max(simplexPerlin4d(spaceBaseColor * uFlowStrengthFrequency) + uFlowStrengthOffset, 0.0);
    flowStrength = pow(flowStrength, uFlowStrengthPower);

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
        newColor.r = color.r + (simplexPerlin4d(vec4((spaceColor.rgb + 0.0   ) * uFlowFrequency, uTime * uTimeFrequency)) + uFlowDirection.x) * uFlowSpeed * flowStrength;
        newColor.g = color.g + (simplexPerlin4d(vec4((spaceColor.rgb + 1234.0) * uFlowFrequency, uTime * uTimeFrequency)) + uFlowDirection.y) * uFlowSpeed * flowStrength;
        newColor.b = color.b + (simplexPerlin4d(vec4((spaceColor.rgb + 9876.0) * uFlowFrequency, uTime * uTimeFrequency)) + uFlowDirection.z) * uFlowSpeed * flowStrength;
    }

    gl_FragColor = newColor;
}
