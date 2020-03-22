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
            uBaseTexture: { value: null },
            uTexture: { value: null },
            uTime: { value: null },
            uTimeFrequency: { value: null }
        }
    })
}
