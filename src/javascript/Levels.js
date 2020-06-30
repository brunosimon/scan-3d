import CustomPLYLoader from './CustomPLYLoader.js'
import couleeVerteGeometrySource from './resources/scans/coulee-verte-geometry.ply'
import couleeVerteCollisionSource from './resources/scans/coulee-verte-collision.json'

export default class Levels
{
    constructor(_options)
    {
        // Options
        this.config = _options.config
        this.debug = _options.debug
        this.time = _options.time
        this.physics = _options.physics
        this.particles = _options.particles

        this.loader = new CustomPLYLoader()

        this.setList()
        this.go(0)
    }

    setList()
    {
        this.list = [
            {
                geometrySource: couleeVerteGeometrySource,
                geometry: null,
                collisionSource: couleeVerteCollisionSource,
                loaded: false
            }
        ]
    }

    go(_levelIndex)
    {
        const level = this.list[_levelIndex]

        // Already loaded
        if(level.loaded)
        {
            this.particles.setForLevel(level)
            this.physics.setForLevel(level)
        }

        // Not yet loaded
        else
        {
            this.loader.load(level.geometrySource, (_geometry) =>
            {
                level.geometry = _geometry
                level.loaded = true
                this.particles.setForLevel(level)
                this.physics.setForLevel(level)
            })
        }
    }
}
