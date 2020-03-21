varying vec3 vColor;

void main()
{
    float alpha = step(distance(gl_PointCoord, vec2(0.5)), 0.5);

    gl_FragColor = vec4(vColor, alpha);
}
