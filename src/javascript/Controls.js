import * as THREE from 'three'
import Ola from 'ola'

export default class Controls
{
    constructor(_options)
    {
        this.time = _options.time
        this.interactionTarget = _options.interactionTarget
        this.physics = _options.physics
        this.camera = _options.camera

        this.setPlayer()
        this.setDrag()
        this.setKeyboard()
    }

    setPlayer()
    {
        this.player = {}

        this.player.rotation = {}
        this.player.rotation.target = new THREE.Vector2()
        this.player.rotation.value = new THREE.Vector2()
        this.player.rotation.easing = 0.003

        this.player.eyeSight = {}
        this.player.eyeSight.standing = 1.68
        this.player.eyeSight.crouching = 1
        this.player.eyeSight.value = Ola({ y: this.player.eyeSight.standing }, 1000)
    }

    setDrag()
    {
        this.drag = {}
        this.drag.previous = new THREE.Vector2()
        this.drag.current = new THREE.Vector2()
        this.drag.delta = new THREE.Vector2()
        this.drag.sensitivity = 0.002

        this.interactionTarget.style.cursor = 'grab'

        this.drag.mouseDown = (_event) =>
        {
            this.drag.current.x = _event.clientX
            this.drag.current.y = _event.clientY

            this.interactionTarget.style.cursor = 'grabbing'

            window.addEventListener('mouseup', this.drag.mouseUp)
            window.addEventListener('mousemove', this.drag.mouseMove)
        }
        this.drag.mouseUp = () =>
        {
            this.interactionTarget.style.cursor = 'grab'

            window.removeEventListener('mouseup', this.drag.mouseUp)
            window.removeEventListener('mousemove', this.drag.mouseMove)
        }
        this.drag.mouseMove = (_event) =>
        {
            this.drag.previous.copy(this.drag.current)
            this.drag.current.x = _event.clientX
            this.drag.current.y = _event.clientY

            this.drag.delta.x = this.drag.current.x - this.drag.previous.x
            this.drag.delta.y = this.drag.current.y - this.drag.previous.y

            // Update player
            this.player.rotation.target.y += this.drag.delta.x * this.drag.sensitivity
            this.player.rotation.target.x += this.drag.delta.y * this.drag.sensitivity

            this.player.rotation.target.x = Math.min(Math.max(this.player.rotation.target.x, - Math.PI * 0.5), Math.PI * 0.5)
        }

        this.interactionTarget.addEventListener('mousedown', this.drag.mouseDown)
    }

    setKeyboard()
    {
        this.keyboard = {}
        this.keyboard.up = false
        this.keyboard.right = false
        this.keyboard.down = false
        this.keyboard.left = false
        this.keyboard.running = false

        window.addEventListener('keydown', (_event) =>
        {
            if(_event.code === 'KeyW' || _event.code === 'ArrowUp')
            {
                this.keyboard.up = true
            }
            else if(_event.code === 'KeyD' || _event.code === 'ArrowRight')
            {
                this.keyboard.right = true
            }
            else if(_event.code === 'KeyS' || _event.code === 'ArrowDown')
            {
                this.keyboard.down = true
            }
            else if(_event.code === 'KeyA' || _event.code === 'ArrowLeft')
            {
                this.keyboard.left = true
            }
            else if(_event.code === 'ShiftLeft' || _event.code === 'ShiftRight')
            {
                this.keyboard.running = true
            }
            else if(_event.code === 'ControlLeft' || _event.code === 'KeyC')
            {
                this.player.eyeSight.value.set({ y: this.player.eyeSight.crouching })
            }
        })

        window.addEventListener('keyup', (_event) =>
        {
            if(_event.code === 'KeyW' || _event.code === 'ArrowUp')
            {
                this.keyboard.up = false
            }
            else if(_event.code === 'KeyD' || _event.code === 'ArrowRight')
            {
                this.keyboard.right = false
            }
            else if(_event.code === 'KeyS' || _event.code === 'ArrowDown')
            {
                this.keyboard.down = false
            }
            else if(_event.code === 'KeyA' || _event.code === 'ArrowLeft')
            {
                this.keyboard.left = false
            }
            else if(_event.code === 'ShiftLeft' || _event.code === 'ShiftRight')
            {
                this.keyboard.running = false
            }
            else if(_event.code === 'ControlLeft' || _event.code === 'KeyC')
            {
                this.player.eyeSight.value.set({ y: this.player.eyeSight.standing })
            }
        })
    }

    update()
    {
        // Update rotation
        this.player.rotation.value.lerp(this.player.rotation.target, this.player.rotation.easing * this.time.delta)

        // Update camera rotation
        this.camera.defaultCamera.instance.rotation.x = this.player.rotation.value.x
        this.camera.defaultCamera.instance.rotation.y = this.player.rotation.value.y

        // Update physics
        const baseAngle = this.player.rotation.value.y
        let offsetAngle = null

        if(this.keyboard.up && this.keyboard.right)
        {
            offsetAngle = Math.PI * 0.75
        }
        else if(this.keyboard.right && this.keyboard.down)
        {
            offsetAngle = Math.PI * 0.25
        }
        else if(this.keyboard.down && this.keyboard.left)
        {
            offsetAngle = - Math.PI * 0.25
        }
        else if(this.keyboard.left && this.keyboard.up)
        {
            offsetAngle = - Math.PI * 0.75
        }
        else if(this.keyboard.up)
        {
            offsetAngle = Math.PI
        }
        else if(this.keyboard.right)
        {
            offsetAngle = Math.PI * 0.5
        }
        else if(this.keyboard.down)
        {
            offsetAngle = 0
        }
        else if(this.keyboard.left)
        {
            offsetAngle = - Math.PI * 0.5
        }

        if(offsetAngle !== null)
        {
            this.physics.moveToAngle(baseAngle + offsetAngle, this.keyboard.running)
        }

        // Update camera position
        this.camera.defaultCamera.instance.position.x = this.physics.player.body.position.y / this.physics.scale
        this.camera.defaultCamera.instance.position.z = this.physics.player.body.position.x / this.physics.scale
        this.camera.defaultCamera.instance.position.y = this.player.eyeSight.value.y
    }
}
