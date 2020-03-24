uniform sampler2D uFBOTexture;
uniform mat4 uFBOMatrix;

void main()
{
    // FBO position
    vec4 fboData = texture2D(uFBOTexture, position.xy);

    // Position
    vec4 modelPosition = modelMatrix * uFBOMatrix * vec4(fboData.xyz, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;
    gl_Position = projectionPosition;

    // Size
    gl_PointSize = 1.0;
}
