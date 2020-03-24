import * as THREE from 'three'
import FlowFieldMapMaterial from './Materials/FlowFieldMapMaterial'

export default class FlowFieldMap
{
    constructor(_options)
    {
        // Options
        this.debug = _options.debug
        this.renderer = _options.renderer
        this.time = _options.time
        this.positions = _options.positions

        // Debug
        if(this.debug)
        {
            this.debug.Register({
                type: 'folder',
                label: 'flowField',
                open: true
            })
        }

        // Set up
        this.width = 2048 // iOS limit (use 4096 for Android and 8192 otherwise)
        this.height = Math.ceil(this.positions.length / 3 / this.width)
        this.size = this.width * this.height

        this.setSpace()
        this.setBaseTexture()
        this.setRenderTargets()
        this.setEnvironment()

        // First render
        this.renderer.instance.setRenderTarget(this.renderTargets.primary)
        this.renderer.instance.render(this.scene, this.camera)
        this.renderer.instance.setRenderTarget(null)

        // Debug
        if(this.debug)
        {
            this.debug.Register({
                folder: 'flowField',
                type: 'range',
                label: 'uTimeFrequency',
                min: 0,
                max: 0.001,
                step: 0.0000001,
                object: this.material.uniforms.uTimeFrequency,
                property: 'value'
            })

            this.debug.Register({
                folder: 'flowField',
                type: 'range',
                label: 'uPositionFrequency',
                min: 0.0001,
                max: 20,
                step: 0.0001,
                object: this.material.uniforms.uPositionFrequency,
                property: 'value'
            })

            this.debug.Register({
                folder: 'flowField',
                type: 'range',
                label: 'uPositionSpeed',
                min: 0.0001,
                max: 0.1,
                step: 0.0001,
                object: this.material.uniforms.uPositionSpeed,
                property: 'value'
            })

            this.debug.Register({
                folder: 'flowField',
                type: 'range',
                label: 'uLifeSpeed',
                min: 0.00001,
                max: 0.01,
                step: 0.00001,
                object: this.material.uniforms.uLifeSpeed,
                property: 'value'
            })
        }
    }

    setSpace()
    {
        this.space = {}

        this.space.min = {}
        this.space.min.x = Infinity
        this.space.min.y = Infinity
        this.space.min.z = Infinity

        this.space.max = {}
        this.space.max.x = - Infinity
        this.space.max.y = - Infinity
        this.space.max.z = - Infinity

        for(let i = 0; i < this.positions.length; i += 3)
        {
            if(this.positions[i + 0] < this.space.min.x)
            {
                this.space.min.x = this.positions[i + 0]
            }
            if(this.positions[i + 1] < this.space.min.y)
            {
                this.space.min.y = this.positions[i + 1]
            }
            if(this.positions[i + 2] < this.space.min.z)
            {
                this.space.min.z = this.positions[i + 2]
            }

            if(this.positions[i + 0] > this.space.max.x)
            {
                this.space.max.x = this.positions[i + 0]
            }
            if(this.positions[i + 1] > this.space.max.y)
            {
                this.space.max.y = this.positions[i + 1]
            }
            if(this.positions[i + 2] > this.space.max.z)
            {
                this.space.max.z = this.positions[i + 2]
            }
        }

        this.space.amplitude = {}
        this.space.amplitude.x = this.space.max.x - this.space.min.x
        this.space.amplitude.y = this.space.max.y - this.space.min.y
        this.space.amplitude.z = this.space.max.z - this.space.min.z

        this.space.matrix = new THREE.Matrix4()
        this.space.matrix.makeTranslation(this.space.min.x, this.space.min.y, this.space.min.z)
        this.space.matrix.scale(new THREE.Vector3(this.space.amplitude.x, this.space.amplitude.y, this.space.amplitude.z))
    }

    setBaseTexture()
    {
        // Base texture
        const data = new Float32Array(4 * this.size)

        // From positions
        for(let i = 0; i < this.positions.length / 3; i++)
        {
            const positionIndex = i * 3
            const pixelIndex = i * 4
            data[pixelIndex + 0] = (this.positions[positionIndex + 0] - this.space.min.x) / this.space.amplitude.x
            data[pixelIndex + 1] = (this.positions[positionIndex + 1] - this.space.min.y) / this.space.amplitude.y
            data[pixelIndex + 2] = (this.positions[positionIndex + 2] - this.space.min.z) / this.space.amplitude.z
            data[pixelIndex + 3] = Math.random()
        }

        // From random
        // for(let i = 0; i < this.size; i++)
        // {
        //     const pixelIndex = i * 4
        //     data[pixelIndex + 0] = Math.random()
        //     data[pixelIndex + 1] = Math.random()
        //     data[pixelIndex + 2] = Math.random()
        //     data[pixelIndex + 3] = Math.random()
        // }

        this.baseTexture = new THREE.DataTexture(data, this.width, this.height, THREE.RGBAFormat, THREE.FloatType)
        this.baseTexture.minFilter = THREE.NearestFilter
        this.baseTexture.magFilter = THREE.NearestFilter
        this.baseTexture.generateMipmaps = false
        this.baseTexture.needsUpdate = true
        this.baseTexture.flipY = false
    }

    setRenderTargets()
    {
        this.renderTargets = {}
        this.renderTargets.a = new THREE.WebGLRenderTarget(
            this.width,
            this.height,
            {
                wrapS: THREE.ClampToEdgeWrapping,
                wrapT: THREE.ClampToEdgeWrapping,
                minFilter: THREE.NearestFilter,
                magFilter: THREE.NearestFilter,
                format: THREE.RGBAFormat,
                type: THREE.FloatType,
                depthWrite: false,
                depthBuffer: false,
                stencilBuffer: false
            }
        )
        this.renderTargets.b = this.renderTargets.a.clone()
        this.renderTargets.primary = this.renderTargets.a
        this.renderTargets.secondary = this.renderTargets.b
    }

    setEnvironment()
    {
        // Scene
        this.scene = new THREE.Scene()

        // Orthographic camera
        this.camera = new THREE.OrthographicCamera(- 1, 1, 1, - 1, 0.5, 1.5)
        this.camera.position.z = 1

        // Plane geometry
        this.geometry = new THREE.PlaneBufferGeometry(1, 1, 1, 1)

        // Plane material
        this.material = new FlowFieldMapMaterial()
        this.material.uniforms.uBaseTexture.value = this.baseTexture
        this.material.uniforms.uTexture.value = this.baseTexture
        this.material.uniforms.uTime.value = 0.0
        this.material.uniforms.uTimeFrequency.value = 0.0001
        this.material.uniforms.uPositionFrequency.value = 0.6
        this.material.uniforms.uPositionSpeed.value = 0.004
        this.material.uniforms.uLifeSpeed.value = 0.003
        this.material.uniforms.uSpaceMatrix.value = this.space.matrix

        // Mesh in front of camera
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.scene.add(this.mesh)
    }

    render()
    {
        // Update material texture
        this.material.uniforms.uTexture.value = this.renderTargets.primary.texture
        this.material.uniforms.uTime.value = this.time.elapsed

        // Render in secondary renderTarget
        this.renderer.instance.setRenderTarget(this.renderTargets.secondary)
        this.renderer.instance.render(this.scene, this.camera)
        this.renderer.instance.setRenderTarget(null)
        this.renderTargets.primary.needsUpdate = true

        // Swap
        const temp = this.renderTargets.primary
        this.renderTargets.primary = this.renderTargets.secondary
        this.renderTargets.secondary = temp
    }
}
