import CustomPLYLoader from './CustomPLYLoader.js'
import couleeVerteGeometrySource from './resources/scans/coulee-verte/geometry.ply'
import couleeVerteCollisionSource from './resources/scans/coulee-verte/collision.json'
import squareDeMontsourisGeometrySource from './resources/scans/square-de-montsouris/geometry.ply'
import squareDeMontsourisCollisionSource from './resources/scans/square-de-montsouris/collision.json'

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

        // Set up
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
                collisionSource: squareDeMontsourisCollisionSource,
                loaded: false
            },
            {
                geometrySource: squareDeMontsourisGeometrySource,
                geometry: null,
                collisionSource: squareDeMontsourisCollisionSource,
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
