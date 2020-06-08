import * as THREE from 'three'
import FirstPersonCamera from './FirstPersonCamera.js'
import DebugCamera from './DebugCamera.js'

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
        this.mode = 'firstPersonCamera'

        // if(!this.debug)
        // {
        //     this.mode = 'debugCamera'
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
                options: ['firstPersonCamera', 'debugCamera']
            })
        }

        this.setInstance()
        this.setFirstPersonCamera()
        this.setDebugCamera()
    }

    setInstance()
    {
        // Set up
        this.instance = new THREE.PerspectiveCamera(75, this.config.width / this.config.height, 0.1, 150)
        this.instance.position.set(0, 1.68, 2)
        this.instance.lookAt(new THREE.Vector3(0, 1.55, 0))

        // Resize event
        this.sizes.on('resize', () =>
        {
            this.instance.aspect = this.config.width / this.config.height
            this.instance.updateProjectionMatrix()
        })
    }

    setFirstPersonCamera()
    {
        // Set up
        this.firstPersonCamera = new FirstPersonCamera({
            time: this.time,
            baseInstance: this.instance,
            interactionTarget: this.interactionTarget
        })

        if(this.mode === 'firstPersonCamera')
        {
            this.firstPersonCamera.activate()
        }
    }

    setDebugCamera()
    {
        this.debugCamera = new DebugCamera({
            time: this.time,
            baseInstance: this.instance,
            interactionTarget: this.interactionTarget
        })

        if(this.mode === 'debugCamera')
        {
            this.debugCamera.activate()
        }
    }

    update()
    {
        this.debugCamera.update()
        this.firstPersonCamera.update()

        this.instance.position.copy(this[this.mode].instance.position)
        this.instance.quaternion.copy(this[this.mode].instance.quaternion)
    }
}
