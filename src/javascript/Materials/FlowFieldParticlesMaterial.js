import * as THREE from 'three'
import vertexShader from '../shaders/flowFieldParticles/vertex.glsl'
import fragmentShader from '../shaders/flowFieldParticles/fragment.glsl'

export default function()
{
    return new THREE.ShaderMaterial({
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        depthTest: false,
        depthWrite: false,
        uniforms:
        {
            uFBOTexture: { value: null }
        }
    })
}
