import EventEmitter from './Utils/EventEmitter'

export default class Fullscreen extends EventEmitter
{
    constructor(_options)
    {
        super()

        // Options
        this.targetElement = _options.targetElement

        // Set up
        this.fullscreenActive = false
        this.pointerLockActive = false

        // Mouse event
        this.targetElement.addEventListener('dblclick', () =>
        {
            this.toggle()
        })

        // Keyboard event
        window.addEventListener('keydown', (_event) =>
        {
            if(_event.code === 'KeyF')
            {
                this.toggle()
            }
        })

        // Fullscreen change
        document.addEventListener('fullscreenchange', () =>
        {
            this.fullscreenActive = document.fullscreen

            // Wait a little and test if pointer lock worked
            window.setTimeout(() =>
            {
                if(this.fullscreenActive && !this.pointerLockActive)
                {
                    this.targetElement.requestPointerLock()
                }
                if(!this.fullscreenActive && this.pointerLockActive)
                {
                    this.targetElement.exitPointerLock()
                }
            }, 500)
        })

        // Pointer lock change
        document.addEventListener('pointerlockchange', () =>
        {
            this.pointerLockActive = !!document.pointerLockElement
        })
    }

    toggle()
    {
        if(this.fullscreenActive)
        {
            this.deactivate()
        }
        else
        {
            this.activate()
        }
    }

    activate()
    {
        this.fullscreenActive = true

        this.targetElement.requestFullscreen()
        this.targetElement.requestPointerLock()

        this.trigger('activate')
    }

    deactivate()
    {
        this.fullscreenActive = false

        document.exitFullscreen()
        document.exitPointerLock()

        this.trigger('deactivate')
    }
}
