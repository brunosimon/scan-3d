import * as THREE from 'three'
import vertexShader from '../shaders/flowField/vertex.glsl'
import fragmentShader from '../shaders/flowField/fragment.glsl'

export default function()
{
    return new THREE.ShaderMaterial({
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        uniforms:
        {
            uTexture: { value: null }
        }
    })
}
