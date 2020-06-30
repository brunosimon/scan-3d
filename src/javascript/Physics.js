import { Engine, Render, World, Bodies, Body, Vector } from 'matter-js'

export default class Physics
{
    constructor(_options)
    {
        // Options
        this.debug = _options.debug
        this.time = _options.time

        // Debug
        if(this.debug)
        {
            this.debug.Register({
                type: 'folder',
                label: 'physics',
                open: true
            })
        }

        // Set up
        this.staticBodies = []
        this.scale = 100
        this.renderDistance = 2000
        this.renderSize = 600
        this.visible = false

        this.setEnvironment()
        this.setPlayer()
        this.setRender()

        // Debug
        if(this.debug)
        {
            this.debug.Register({
                folder: 'physics',
                type: 'checkbox',
                label: 'visible',
                object: this,
                property: 'visible',
                onChange: () =>
                {
                    if(this.visible)
                    {
                        this.render.element.appendChild(this.render.canvas)
                    }
                    else
                    {
                        this.render.element.removeChild(this.render.canvas)
                    }
                }
            })
        }
    }

    setForLevel(_level)
    {
        for(const _shapeSource of _level.collisionSource)
        {
            let body = null

            switch(_shapeSource.type)
            {
                case 'rectangle':
                    body = Bodies.rectangle(
                        _shapeSource.position.x * this.scale,
                        - _shapeSource.position.y * this.scale,
                        _shapeSource.size.x * this.scale,
                        _shapeSource.size.y * this.scale
                    )
                    break

                case 'circle':
                    body = Bodies.circle(
                        _shapeSource.position.x * this.scale,
                        - _shapeSource.position.y * this.scale,
                        _shapeSource.radius * this.scale
                    )
                    break
            }

            if(body)
            {
                // Set as static
                Body.setStatic(body, true)

                // Add and save
                World.add(this.world, body)
                this.staticBodies.push(body)
            }
            else
            {
                console.warn(`Shape source of type "${_shapeSource.type}" doesn't exist`, _shapeSource)
            }
        }
    }

    setEnvironment()
    {
        // Engine
        this.engine = Engine.create()

        // World
        this.world = this.engine.world
        this.world.gravity.y = 0
    }

    setPlayer()
    {
        this.player = {}
        this.player.baseSpeed = 0.015
        this.player.runninSpeed = this.player.baseSpeed * 3
        this.player.body = Bodies.circle(0, 0, 1 * this.scale)
        // this.player.body = Bodies.rectangle(0, 0, 1 * this.scale, 1 * this.scale)
        this.player.body.frictionAir = 0.1

        World.add(this.world, this.player.body)
    }

    setRender()
    {
        // Render
        this.render = Render.create({
            element: document.body,
            engine: this.engine
        })

        if(!this.visible)
        {
            this.render.element.removeChild(this.render.canvas)
        }

        this.render.canvas.style.position = 'fixed'
        this.render.canvas.style.top = 0
        this.render.canvas.style.left = 0

        this.render.options.hasBounds = true
        this.render.options.width = this.renderSize
        this.render.options.height = this.renderSize
        this.render.bounds.min.x = - this.renderDistance
        this.render.bounds.max.x = this.renderDistance
        this.render.bounds.min.y = - this.renderDistance
        this.render.bounds.max.y = this.renderDistance

        this.render.canvas.width = this.renderSize
        this.render.canvas.height = this.renderSize
    }

    moveToAngle(_angle, _running)
    {
        const speed = _running ? this.player.runninSpeed : this.player.baseSpeed
        Body.applyForce(this.player.body, this.player.body.position, Vector.create(Math.sin(_angle) * speed, Math.cos(_angle) * speed))
    }

    update()
    {
        Engine.update(this.engine, this.time.delta, 1)

        if(this.visible)
        {
            this.render.bounds.min.x = this.player.body.position.x - this.renderDistance
            this.render.bounds.max.x = this.player.body.position.x + this.renderDistance
            this.render.bounds.min.y = this.player.body.position.y - this.renderDistance
            this.render.bounds.max.y = this.player.body.position.y + this.renderDistance

            Render.world(this.render)
        }
    }
}
