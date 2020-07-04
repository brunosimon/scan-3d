import * as THREE from 'three'
import vertexShader from '../shaders/particles/vertex.glsl'
import fragmentShader from '../shaders/particles/fragment.glsl'

export default function()
{
    return new THREE.ShaderMaterial({
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        vertexColors: THREE.VertexColors,
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthTest: false,
        depthWrite: false,
        uniforms:
        {
            uFBOTexture: { value: null },
            uFBOMatrix: { value: null },
            uSize: { value: null },
            uSizeAboveMultiplier: { value: null },
            uPositionRandomness: { value: null },
            uPositionRandomnessAboveMultiplier: { value: null },
            uAlpha: { value: null },
            uColorOffset: { value: null },
            uColorBrightness: { value: null },
            uColorContrast: { value: null },
            uDistanceAttenuationMultiplier: { value: null },
            uDistanceAttenuationOffset: { value: null }
        }
    })
}
