uniform sampler2D uTexture;

varying vec2 vUv;

#pragma glslify: random2d = require(../utils/random2d.glsl)

void main()
{
    // vec3 color = vec3(0.0);
    // color.x = random2d(vUv + 0.0);
    // color.y = random2d(vUv + 0.1);
    // color.z = random2d(vUv + 0.2);

    vec4 color = texture2D(uTexture, vUv);
    color.rgb += 0.005;

    gl_FragColor = color;
}
