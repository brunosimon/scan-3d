uniform sampler2D uTexture;

varying vec2 vUv;

#pragma glslify: random2d = require(../utils/random2d.glsl)
#pragma glslify: simplexPerlin4d = require(../utils/simplexPerlin4d.glsl)

void main()
{
    float uTime = 0.0;
    // vec3 color = vec3(0.0);
    // color.x = random2d(vUv + 0.0);
    // color.y = random2d(vUv + 0.1);
    // color.z = random2d(vUv + 0.2);

    vec4 color = texture2D(uTexture, vUv);
    // color.r += simplexPerlin4d(vec4(color));

    vec4 newColor = vec4(0.0);
    newColor.r = color.r + simplexPerlin4d(vec4(color.rgb + 0.0, uTime)) * 0.02;
    newColor.g = color.g + simplexPerlin4d(vec4(color.rgb + 1234.0, uTime)) * 0.02;
    newColor.b = color.b + simplexPerlin4d(vec4(color.rgb + 9876.0, uTime)) * 0.02;

    gl_FragColor = newColor;
}
