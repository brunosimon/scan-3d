import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

export default class DebugCamera
{
    constructor(_options)
    {
        this.time = _options.time
        this.baseInstance = _options.baseInstance
        this.interactionTarget = _options.interactionTarget

        this.active = false

        this.instance = this.baseInstance.clone()
        this.controls = new OrbitControls(this.instance, this.interactionTarget)
        this.controls.enabled = true
        this.controls.screenSpacePanning = true
        this.controls.enableKeys = false
        this.controls.zoomSpeed = 0.25
        this.controls.target.y = 1.4
        this.controls.enableDamping = true
        this.controls.update()

        this.time.on('tick', () =>
        {
            if(this.active)
            {
                this.controls.update()
            }
        })
    }

    activate()
    {
        this.active = true
    }

    deactivate()
    {
        this.active = false
    }
}
