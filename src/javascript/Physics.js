import { Engine, Render, World, Bodies, Body, Vector } from 'matter-js'

export default class Physics
{
    constructor(_options)
    {
        // Options
        this.debug = _options.debug
        this.time = _options.time
        this.scale = 100

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

        this.setEnvironment()
        this.setPlayer()
        this.setRender()
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
                        _shapeSource.position.y * this.scale,
                        _shapeSource.size.x * this.scale,
                        _shapeSource.size.y * this.scale
                    )
                    break

                case 'circle':
                    body = Bodies.circle(
                        _shapeSource.position.x * this.scale,
                        _shapeSource.position.y * this.scale,
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

        this.render.canvas.style.position = 'fixed'
        this.render.canvas.style.top = 0
        this.render.canvas.style.left = 0

        this.render.options.hasBounds = true
        this.render.options.width = 800
        this.render.options.height = 800
        this.render.bounds.min.x = - 2000
        this.render.bounds.max.x = 2000
        this.render.bounds.min.y = - 2000
        this.render.bounds.max.y = 2000

        this.render.canvas.width = 800
        this.render.canvas.height = 800
    }

    moveToAngle(_angle, _running)
    {
        const speed = _running ? this.player.runninSpeed : this.player.baseSpeed
        Body.applyForce(this.player.body, this.player.body.position, Vector.create(Math.cos(_angle) * speed, Math.sin(_angle) * speed))
    }

    update()
    {
        Engine.update(this.engine, this.time.delta, 1)
        Render.world(this.render)
        // Render.lookAt(this.render, this.player)
        // Render.lookAt(this.render, this.player)
    }
}
