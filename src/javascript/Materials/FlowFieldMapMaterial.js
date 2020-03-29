import * as THREE from 'three'
import vertexShader from '../shaders/flowFieldMap/vertex.glsl'
import fragmentShader from '../shaders/flowFieldMap/fragment.glsl'

export default function()
{
    return new THREE.ShaderMaterial({
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        uniforms:
        {
            uSpaceMatrix: { value: null },
            uBaseTexture: { value: null },
            uTexture: { value: null },
            uTime: { value: null },
            uTimeFrequency: { value: null },
            uFlowFrequency: { value: null },
            uFlowSpeed: { value: null },
            uFlowDirection: { value: null },
            uFlowStrengthFrequency: { value: null },
            uFlowStrengthOffset: { value: null },
            uFlowStrengthPower: { value: null },
            uLifeSpeed: { value: null }
        }
    })
}
