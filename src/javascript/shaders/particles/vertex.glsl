uniform float uSize;
uniform float uPositionRandomness;

attribute float alpha;
attribute float size;

varying vec3 vColor;
varying float vAlpha;

#pragma glslify: random1d = require(../utils/random1d.glsl)

void main()
{
    // Position
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    float xAngle = random1d(position.x) * 3.1415 * 2.0;
    float yAngle = random1d(position.y) * 3.1415 * 2.0;
    float radius = random1d(position.z) * uPositionRandomness;

    modelPosition.y += cos(xAngle) * radius;
    modelPosition.z += sin(xAngle) * radius;

    modelPosition.x += cos(yAngle) * radius;
    modelPosition.z += sin(yAngle) * radius;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;
    gl_Position = projectionPosition;

    // Size
    gl_PointSize = uSize;
    gl_PointSize *= size;
    gl_PointSize *= (1.0 / - viewPosition.z);

    // Color
    vColor = color;

    // Alpha
    vAlpha = alpha;
}
