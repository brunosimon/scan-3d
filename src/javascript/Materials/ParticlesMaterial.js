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
        alphaTest: 0.5,
        depthTest: false,
        uniforms:
        {
            uSize: { value: null },
            uPositionRandomness: { value: null },
            uAlpha: { value: null }
        }
    })
}
