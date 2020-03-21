uniform float uAlpha;

varying vec3 vColor;
varying float vAlpha;

void main()
{
    float alpha = step(distance(gl_PointCoord, vec2(0.5)), 0.5);
    alpha *= uAlpha;
    alpha *= vAlpha;

    gl_FragColor = vec4(vColor, alpha);
}
