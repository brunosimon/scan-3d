import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'

import FinalPass from './Passes/FinalPass.js'

export default class Renderer
{
    constructor(_options = {})
    {
        this.config = _options.config
        this.debug = _options.debug
        this.time = _options.time
        this.sizes = _options.sizes
        this.scene = _options.scene
        this.camera = _options.camera

        // Debug
        if(this.debug)
        {
            this.debug.Register({
                type: 'folder',
                label: 'renderer',
                open: false
            })
        }

        this.setInstance()
        this.setPostProcess()
    }

    setInstance()
    {
        this.clearColor = '#030002'

        // Renderer
        this.instance = new THREE.WebGLRenderer({
            alpha: true
        })
        this.instance.domElement.style.position = 'absolute'
        this.instance.domElement.style.top = 0
        this.instance.domElement.style.left = 0
        this.instance.domElement.style.width = '100%'
        this.instance.domElement.style.height = '100%'

        // this.instance.setClearColor(0x414141, 1)
        this.instance.setClearColor(this.clearColor, 1)
        this.instance.setPixelRatio(this.config.pixelRatio)

        this.instance.setSize(this.config.width, this.config.height)

        this.instance.physicallyCorrectLights = true
        this.instance.gammaFactor = 2.2
        this.instance.gammaOutPut = true
        this.instance.outputEncoding = THREE.sRGBEncoding
        // this.instance.autoClear = false

        // Resize event
        this.sizes.on('resize', () =>
        {
            this.instance.setSize(this.config.width, this.config.height)
        })

        // Debug
        if(this.debug)
        {
            this.debug.Register({
                type: 'color',
                folder: 'renderer',
                label: 'clearColor',
                object: this,
                property: 'clearColor',
                format: 'hex',
                onChange: () =>
                {
                    this.instance.setClearColor(this.clearColor, 1)
                }
            })
        }

    }

    setPostProcess()
    {
        this.postProcess = {}

        /**
         * Render pass
         */
        this.postProcess.renderPass = new RenderPass(this.scene, this.camera.instance)

        /**
         * Bloom pass
         */
        this.postProcess.bloomPass = new UnrealBloomPass(new THREE.Vector2(this.config.width, this.config.height), 1.5, 0.4, 0.85)
        this.postProcess.bloomPass.threshold = 0
        this.postProcess.bloomPass.strength = 0.5
        this.postProcess.bloomPass.radius = 0

        if(this.debug)
        {
            this.debug.Register({
                folder: 'renderer',
                type: 'range',
                label: 'unrealBloomThreshold',
                min: 0,
                max: 1,
                object: this.postProcess.bloomPass,
                property: 'threshold'
            })
            this.debug.Register({
                folder: 'renderer',
                type: 'range',
                label: 'unrealBloomStrength',
                min: 0,
                max: 3,
                object: this.postProcess.bloomPass,
                property: 'strength'
            })
            this.debug.Register({
                folder: 'renderer',
                type: 'range',
                label: 'unrealBloomRadius',
                min: 0,
                max: 1,
                object: this.postProcess.bloomPass,
                property: 'radius'
            })
        }

        /**
         * Final pass
         */
        this.postProcess.finalPass = new ShaderPass(FinalPass)
        this.postProcess.finalPass.animated = true
        this.postProcess.finalPass.material.uniforms.uTime.value = 0
        this.postProcess.finalPass.material.uniforms.uNoiseMultiplier.value = 0.05
        this.postProcess.finalPass.material.uniforms.uRGBOffsetMultiplier.value = 0.3
        this.postProcess.finalPass.material.uniforms.uRGBOffsetOffset.value = 0.1
        this.postProcess.finalPass.material.uniforms.uRGBOffsetPower.value = 2
        this.postProcess.finalPass.material.uniforms.uOverlayColor.value = new THREE.Color('#000d08')
        this.postProcess.finalPass.material.uniforms.uOverlayAlpha.value = 1

        if(this.debug)
        {
            this.debug.Register({
                folder: 'renderer',
                type: 'range',
                label: 'noiseMultiplier',
                min: 0,
                max: 1,
                object: this.postProcess.finalPass.material.uniforms.uNoiseMultiplier,
                property: 'value'
            })
            this.debug.Register({
                folder: 'renderer',
                type: 'checkbox',
                label: 'noiseAnimated',
                object: this.postProcess.finalPass,
                property: 'animated'
            })
            // this.debug.Register({
            //     folder: 'renderer',
            //     type: 'range',
            //     label: 'RGBOffsetMultiplier',
            //     min: 0,
            //     max: 1,
            //     object: this.postProcess.finalPass.material.uniforms.uRGBOffsetMultiplier,
            //     property: 'value'
            // })
            // this.debug.Register({
            //     folder: 'renderer',
            //     type: 'range',
            //     label: 'RGBOffsetOffset',
            //     min: 0,
            //     max: 1,
            //     object: this.postProcess.finalPass.material.uniforms.uRGBOffsetOffset,
            //     property: 'value'
            // })
            // this.debug.Register({
            //     folder: 'renderer',
            //     type: 'range',
            //     label: 'RGBOffsetPower',
            //     min: 0,
            //     max: 5,
            //     object: this.postProcess.finalPass.material.uniforms.uRGBOffsetPower,
            //     property: 'value'
            // })
        }

        /**
         * Effect composer
         */
        this.postProcess.composer = new EffectComposer(this.instance)

        this.postProcess.composer.addPass(this.postProcess.renderPass)
        this.postProcess.composer.addPass(this.postProcess.bloomPass)
        // this.postProcess.composer.addPass(this.postProcess.finalPass)

        /**
         * Time tick event
         */
        this.time.on('tick', () =>
        {
            // Update passes
            if(this.postProcess.finalPass.animated)
            {
                this.postProcess.finalPass.material.uniforms.uTime.value = this.time.elapsed
            }

            // Render
            this.postProcess.composer.render()
            // this.instance.render(this.scene, this.camera.instance)
        })

        /**
         * Resize event
         */
        this.sizes.on('resize', () =>
        {
            this.instance.setSize(this.config.width, this.config.height)
            this.postProcess.composer.setSize(this.config.width, this.config.height)
        })
    }
}
