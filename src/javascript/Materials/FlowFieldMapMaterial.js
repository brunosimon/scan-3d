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
            uStrengthFrequency: { value: null },
            uStrengthOffset: { value: null },
            uStrengthPower: { value: null },
            uLifeSpeed: { value: null },
            uTurbulencesTimeFrequency: { value: null },
            uTurbulencesFrequency: { value: null },
            uTurbulencesSpeed: { value: null },
            uTurbulencesDirection: { value: null }
        }
    })
}
