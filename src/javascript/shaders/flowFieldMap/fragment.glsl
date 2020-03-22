uniform float uTime;
uniform float uTimeFrequency;
uniform sampler2D uBaseTexture;
uniform sampler2D uTexture;

varying vec2 vUv;

#pragma glslify: random2d = require(../utils/random2d.glsl)
#pragma glslify: simplexPerlin4d = require(../utils/simplexPerlin4d.glsl)

void main()
{
    vec4 color = texture2D(uTexture, vUv);

    vec4 newColor = vec4(0.0);
    newColor.a = color.a - 0.002;

    if(newColor.a < 0.0)
    {
        newColor.rgb = texture2D(uBaseTexture, vUv).rgb;
        newColor.a = 1.0;
    }
    else
    {
        newColor.r = color.r + simplexPerlin4d(vec4(color.rgb + 0.0, uTime * uTimeFrequency)) * 0.02;
        newColor.g = color.g + simplexPerlin4d(vec4(color.rgb + 1234.0, uTime * uTimeFrequency)) * 0.02;
        newColor.b = color.b + simplexPerlin4d(vec4(color.rgb + 9876.0, uTime * uTimeFrequency)) * 0.02;
    }

    gl_FragColor = newColor;
}
