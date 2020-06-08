import { Engine, Render, World, Bodies } from 'matter-js'

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

        this.setEnvironment()
        this.setRender()

        this.time.on('tick', () =>
        {
            Engine.update(this.engine, this.time.delta, 1)
            Render.world(this.render)
        })
    }

    setEnvironment()
    {
        // Engine
        this.engine = Engine.create()
        this.engine.world.gravity.y = 0

        const boxA = Bodies.rectangle(400, 200, 80, 80)
        const boxB = Bodies.rectangle(450, 50, 80, 80)
        const ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true })

        // add all of the bodies to the world
        World.add(this.engine.world, [boxA, boxB, ground])
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
    }
}
