uniform sampler2D uFBOTexture;

void main()
{
    // FBO position
    vec3 fboPosition = texture2D(uFBOTexture, position.xy).xyz;

    // Position
    vec4 modelPosition = modelMatrix * vec4(fboPosition, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;
    gl_Position = projectionPosition;

    // Size
    gl_PointSize = 3.0;
}
