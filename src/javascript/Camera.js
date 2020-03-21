import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

export default class Camera
{
    constructor(_options)
    {
        // Options
        this.config = _options.config
        this.debug = _options.debug
        this.time = _options.time
        this.sizes = _options.sizes
        this.interactionTarget = _options.interactionTarget

        // Set up
        this.mode = 'orbitControls'

        // if(!this.debug)
        // {
        //     this.mode = 'default'
        // }

        // Debug
        if(this.debug)
        {
            this.debug.Register({
                type: 'folder',
                label: 'camera',
                open: false
            })

            this.debug.Register({
                folder: 'camera',
                type: 'select',
                label: 'mode',
                object: this,
                property: 'mode',
                options: ['default', 'orbitControls']
            })
        }

        this.setInstance()
        this.setDefault()
        this.setOrbitControls()
    }

    setInstance()
    {
        // Set up
        this.instance = new THREE.PerspectiveCamera(75, this.config.width / this.config.height, 0.1, 150)
        this.instance.position.set(0, 1.8, - 4)
        this.instance.lookAt(new THREE.Vector3(0, 1.8, 0))

        // Resize event
        this.sizes.on('resize', () =>
        {
            this.instance.aspect = this.config.width / this.config.height
            this.instance.updateProjectionMatrix()
        })

        // Time tick
        this.time.on('tick', () =>
        {
            this.instance.position.copy(this[this.mode].instance.position)
            this.instance.quaternion.copy(this[this.mode].instance.quaternion)
        })
    }

    setDefault()
    {
        // Set up
        this.default = {}
        this.default.instance = this.instance.clone()
        this.default.offsetY = - (this.config.heightRatio - 1) * 3 * (this.sizes.viewport.height / this.sizes.viewport.width)

        this.sizes.on('resize', () =>
        {
            this.default.offsetY = - (this.config.heightRatio - 1) * 3 * (this.sizes.viewport.height / this.sizes.viewport.width)
        })

        /**
         * Pan
         */
        this.default.pan = {}
        this.default.pan.amplitude = {}
        this.default.pan.amplitude.value = 1.65
        this.default.pan.amplitude.x = this.sizes.width / this.sizes.height * this.default.pan.amplitude.value
        this.default.pan.amplitude.y = this.sizes.height / this.sizes.width * this.default.pan.amplitude.value
        this.default.pan.target = {}
        this.default.pan.target.x = 0
        this.default.pan.target.y = 0
        this.default.pan.value = {}
        this.default.pan.value.x = 0
        this.default.pan.value.y = 0
        this.default.pan.easing = 0.02

        window.addEventListener('mousemove', (_event) =>
        {
            this.default.pan.target.x = _event.clientX / this.sizes.width - 0.5
            this.default.pan.target.y = - (_event.clientY / this.sizes.height - 0.5)
        })

        this.time.on('tick', () =>
        {
            this.default.pan.value.x += (this.default.pan.target.x - this.default.pan.value.x) * this.default.pan.easing
            this.default.pan.value.y += (this.default.pan.target.y - this.default.pan.value.y) * this.default.pan.easing

            this.default.instance.position.x = this.default.pan.value.x * this.default.pan.amplitude.x
            this.default.instance.position.y = this.default.pan.value.y * this.default.pan.amplitude.y

            this.default.instance.position.y += this.default.offsetY
        })

        this.sizes.on('resize', () =>
        {
            this.default.pan.amplitude.x = this.sizes.width / this.sizes.height * this.default.pan.amplitude.value
            this.default.pan.amplitude.y = this.sizes.height / this.sizes.width * this.default.pan.amplitude.value
        })

        // Debug
        if(this.debug)
        {
            this.debug.Register({
                folder: 'camera',
                type: 'range',
                min: 0.001,
                max: 0.2,
                step: 0.001,
                label: 'panEasing',
                object: this.default.pan,
                property: 'easing'
            })

            this.debug.Register({
                folder: 'camera',
                type: 'range',
                min: 0,
                max: 3,
                step: 0.001,
                label: 'panAmplitude',
                object: this.default.pan.amplitude,
                property: 'value',
                onChange: () =>
                {
                    this.default.pan.amplitude.x = this.sizes.width / this.sizes.height * this.default.pan.amplitude.value
                    this.default.pan.amplitude.y = this.sizes.height / this.sizes.width * this.default.pan.amplitude.value
                }
            })
        }
    }

    setOrbitControls()
    {
        // if(!this.debug)
        // {
        //     return
        // }

        // Set up
        this.orbitControls = {}
        this.orbitControls.instance = this.instance.clone()
        this.orbitControls.controls = new OrbitControls(this.orbitControls.instance, this.interactionTarget)
        this.orbitControls.controls.enabled = true
        this.orbitControls.controls.screenSpacePanning = true
        this.orbitControls.controls.enableKeys = false
        this.orbitControls.controls.zoomSpeed = 0.5
        this.orbitControls.controls.target.y = 1.4
        this.orbitControls.controls.enableDamping = true
        this.orbitControls.controls.update()

        this.time.on('tick', () =>
        {
            if(this.mode === 'orbitControls')
            {
                this.orbitControls.controls.update()
            }
        })
    }
}
