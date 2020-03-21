import Guify from 'guify'
import * as THREE from 'three'

import EventEmitter from './Utils/EventEmitter.js'
import Time from './Utils/Time.js'
import Sizes from './Utils/Sizes.js'

import Camera from './Camera.js'
import Renderer from './Renderer.js'
import Particles from './Particles.js'

export default class Application
{
    /**
     * Constructor
     */
    constructor(_options = {})
    {
        window.application = this

        this.targetElement = _options.targetElement

        if(!this.targetElement)
        {
            console.warn('Missing \'targetElement\' property')
            return
        }

        this.time = new Time()
        this.sizes = new Sizes()

        this.setConfig()
        this.setDebug()
        this.setScene()
        this.setCamera()
        this.setRenderer()
        this.setParticles()
    }

    /**
     * Set config
     */
    setConfig()
    {
        this.config = {}

        // Debug
        this.config.debug = window.location.hash === '#debug'

        // Pixel ratio
        this.config.pixelRatio = Math.min(Math.max(window.devicePixelRatio, 1), 2)

        // Width and height
        const boundings = this.targetElement.getBoundingClientRect()
        this.config.width = boundings.width
        this.config.height = boundings.height
        this.config.heightRatio = this.config.height / this.sizes.viewport.height

        this.sizes.on('resize', () =>
        {
            const boundings = this.targetElement.getBoundingClientRect()
            this.config.width = boundings.width
            this.config.height = boundings.height
            this.config.heightRatio = this.config.height / this.sizes.viewport.height
        })

        // Touch
        this.config.touch = false

        window.addEventListener('touchstart', () =>
        {
            this.config.touch = true
        }, { once: true })
    }

    /**
     * Set debug
     */
    setDebug()
    {
        if(this.config.debug)
        {
            this.debug = new Guify({
                title: 'Scan 3D',
                theme: 'dark', // dark, light, yorha, or theme object
                align: 'right', // left, right
                width: 400,
                barMode: 'none', // none, overlay, above, offset
                panelMode: 'inner',
                opacity: 1,
                open: true
            })
        }
    }

    /**
     * Set scene
     */
    setScene()
    {
        this.scene = new THREE.Scene()

        // const dummy = new THREE.Mesh(new THREE.BoxBufferGeometry(1, 1, 1, 10, 10, 10), new THREE.MeshBasicMaterial({ wireframe: true }))
        // this.scene.add(dummy)
    }

    /**
     * Set camera
     */
    setCamera()
    {
        this.camera = new Camera({
            config: this.config,
            debug: this.debug,
            time: this.time,
            sizes: this.sizes,
            interactionTarget: this.targetElement
        })

        this.scene.add(this.camera.instance)
    }

    /**
     * Set renderer
     */
    setRenderer()
    {
        this.renderer = new Renderer({
            config: this.config,
            debug: this.debug,
            time: this.time,
            sizes: this.sizes,
            scene: this.scene,
            camera: this.camera
        })

        this.targetElement.appendChild(this.renderer.instance.domElement)
    }

    /**
     * Set particles
     */
    setParticles()
    {
        this.particles = new Particles
        this.scene.add(this.particles.container)
    }
}
