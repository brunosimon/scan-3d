import * as THREE from 'three'

export default class FirstPersonCamera
{
    constructor(_options)
    {
        this.time = _options.time
        this.baseInstance = _options.baseInstance
        this.interactionTarget = _options.interactionTarget

        this.active = false
        this.eyeElevation = 1.68
        this.pointerLocked = false

        this.instance = this.baseInstance.clone()
        this.instance.position.y = this.eyeElevation
        this.instance.rotation.order = 'YXZ'

        this.drag = {}
        this.drag.previous = new THREE.Vector2()
        this.drag.current = new THREE.Vector2()
        this.drag.delta = new THREE.Vector2()
        this.drag.sensitivity = 0.002

        this.rotation = {}
        this.rotation.target = new THREE.Vector2()
        this.rotation.value = new THREE.Vector2()
        this.rotation.easing = 0.003

        this.mouse = {}
        this.mouse.mouseDown = (_event) =>
        {
            if(!this.active)
            {
                return
            }

            this.drag.current.x = _event.clientX
            this.drag.current.y = _event.clientY

            window.addEventListener('mouseup', this.mouse.mouseUp)
            window.addEventListener('mousemove', this.mouse.mouseMove)
        }
        this.mouse.mouseUp = () =>
        {
            window.removeEventListener('mouseup', this.mouse.mouseUp)
            window.removeEventListener('mousemove', this.mouse.mouseMove)
        }
        this.mouse.mouseMove = (_event) =>
        {
            this.drag.previous.copy(this.drag.current)
            this.drag.current.x = _event.clientX
            this.drag.current.y = _event.clientY

            this.drag.delta.x = this.drag.current.x - this.drag.previous.x
            this.drag.delta.y = this.drag.current.y - this.drag.previous.y

            this.rotation.target.y += this.drag.delta.x * this.drag.sensitivity
            this.rotation.target.x += this.drag.delta.y * this.drag.sensitivity

            this.rotation.target.x = Math.min(Math.max(this.rotation.target.x, - Math.PI * 0.5), Math.PI * 0.5)
        }

        this.interactionTarget.addEventListener('mousedown', this.mouse.mouseDown)
    }

    update()
    {
        if(!this.active)
        {
            return
        }

        this.rotation.value.lerp(this.rotation.target, this.rotation.easing * this.time.delta)
        this.instance.rotation.x = this.rotation.value.x
        this.instance.rotation.y = this.rotation.value.y
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
