import shaderFragment from '../shaders/final/fragment.glsl'
import shaderVertex from '../shaders/final/vertex.glsl'

export default {
    uniforms:
    {
        tDiffuse: { type: 't', value: null },
        uTime: { type: 'f', value: null },
        uNoiseMultiplier: { type: 'f', value: null },
        uRGBOffsetMultiplier: { type: 'f', value: null },
        uRGBOffsetOffset: { type: 'f', value: null },
        uRGBOffsetPower: { type: 'f', value: null },
        uOverlayColor: { type: 'v3', value: null },
        uOverlayAlpha: { type: 'f', value: null }
    },
    vertexShader: shaderVertex,
    fragmentShader: shaderFragment
}
