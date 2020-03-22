import * as THREE from 'three'
import FlowFieldMapMaterial from './Materials/FlowFieldMapMaterial'

export default class FlowFieldMap
{
    constructor(_options)
    {
        this.renderer = _options.renderer
        this.width = 64
        this.height = 64
        this.size = this.width * this.height

        // Environment
        this.scene = new THREE.Scene()
        this.camera = new THREE.OrthographicCamera(- 1, 1, 1, - 1, 0.5, 1.5)
        this.camera.position.z = 1

        // Base texture
        const data = new Float32Array(4 * this.size)

        for(let i = 0; i < this.size; i++)
        {
            const pixelIndex = i * 4
            data[pixelIndex + 0] = Math.random()
            data[pixelIndex + 1] = Math.random()
            data[pixelIndex + 2] = Math.random()
            data[pixelIndex + 3] = 1
        }
        this.baseTexture = new THREE.DataTexture(data, this.width, this.height, THREE.RGBAFormat, THREE.FloatType)
        this.baseTexture.minFilter = THREE.NearestFilter
        this.baseTexture.magFilter = THREE.NearestFilter
        this.baseTexture.generateMipmaps = false
        this.baseTexture.needsUpdate = true

        // Render target
        this.renderTargets = {}
        this.renderTargets.a = new THREE.WebGLRenderTarget(
            this.width,
            this.height,
            {
                minFilter: THREE.NearestFilter,
                magFilter: THREE.NearestFilter,
                format: THREE.RGBAFormat,
                type: THREE.FloatType
            }
        )
        this.renderTargets.b = this.renderTargets.a.clone()
        this.renderTargets.current = this.renderTargets.a
        this.renderTargets.other = this.renderTargets.b

        // Texture
        this.texture = this.renderTargets.a.texture

        // Plane
        this.geometry = new THREE.PlaneBufferGeometry(1, 1, 1, 1)

        this.material = new FlowFieldMapMaterial()
        this.material.uniforms.uTexture.value = this.baseTexture

        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.scene.add(this.mesh)

        // Temp
        this.renderer.instance.setRenderTarget(this.renderTargets.current)
        this.renderer.instance.render(this.scene, this.camera)
        this.renderer.instance.setRenderTarget(null)
    }

    render()
    {
        // Update material texture
        this.material.uniforms.uTexture.value = this.renderTargets.current.texture

        // Render
        this.renderer.instance.setRenderTarget(this.renderTargets.other)
        this.renderer.instance.render(this.scene, this.camera)
        this.renderer.instance.setRenderTarget(null)
        this.renderTargets.current.needsUpdate = true

        // Swap
        const temp = this.renderTargets.current
        this.renderTargets.current = this.renderTargets.other
        this.renderTargets.other = temp
    }
}
