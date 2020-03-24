uniform mat4 uSpaceMatrix;
uniform sampler2D uBaseTexture;
uniform sampler2D uTexture;
uniform float uTime;
uniform float uTimeFrequency;
uniform float uPositionFrequency;
uniform float uPositionSpeed;
uniform float uLifeSpeed;

varying vec2 vUv;

#pragma glslify: random2d = require(../utils/random2d.glsl)
#pragma glslify: simplexPerlin4d = require(../utils/simplexPerlin4d.glsl)

void main()
{
    // Get previous color
    vec4 color = texture2D(uTexture, vUv);

    // Create new color
    vec4 newColor = vec4(0.0);

    // Decrease life
    newColor.a = color.a - uLifeSpeed;

    // Is dead
    if(newColor.a < 0.0)
    {
        // Reset
        newColor.rgb = texture2D(uBaseTexture, vUv).rgb;
        newColor.a = 1.0;
    }

    // Is alive
    else
    {
        // Apply perlin according to the space
        vec4 spacePosition = uSpaceMatrix * vec4(color.rgb, 1.0);
        newColor.r = color.r + simplexPerlin4d(vec4((spacePosition.rgb + 0.0   ) * uPositionFrequency, uTime * uTimeFrequency)) * uPositionSpeed;
        newColor.g = color.g + simplexPerlin4d(vec4((spacePosition.rgb + 1234.0) * uPositionFrequency, uTime * uTimeFrequency)) * uPositionSpeed;
        newColor.b = color.b + simplexPerlin4d(vec4((spacePosition.rgb + 9876.0) * uPositionFrequency, uTime * uTimeFrequency)) * uPositionSpeed;
    }

    gl_FragColor = newColor;
}
