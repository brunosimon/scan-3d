import CustomPLYLoader from './CustomPLYLoader.js'
import couleeVerte1GeometrySource from './resources/scans/01-coulee-verte-1/geometry.ply'
import couleeVerte1CollisionSource from './resources/scans/01-coulee-verte-1/collision.json'
import couleeVerte2GeometrySource from './resources/scans/01-coulee-verte-2/geometry.ply'
import couleeVerte2CollisionSource from './resources/scans/01-coulee-verte-2/collision.json'
import squareDeMontsouris1GeometrySource from './resources/scans/02-square-de-montsouris-1/geometry.ply'
import squareDeMontsouris1CollisionSource from './resources/scans/02-square-de-montsouris-1/collision.json'
import squareDeMontsouris2GeometrySource from './resources/scans/02-square-de-montsouris-2/geometry.ply'
import squareDeMontsouris2CollisionSource from './resources/scans/02-square-de-montsouris-2/collision.json'
import citeFleurie1GeometrySource from './resources/scans/03-cite-fleurie-1/geometry.ply'
import citeFleurie1CollisionSource from './resources/scans/03-cite-fleurie-1/collision.json'

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
        this.go(4)
    }

    setList()
    {
        this.list = [
            {
                geometrySource: couleeVerte1GeometrySource,
                geometry: null,
                collisionSource: couleeVerte1CollisionSource,
                loaded: false
            },
            {
                geometrySource: couleeVerte2GeometrySource,
                geometry: null,
                collisionSource: couleeVerte2CollisionSource,
                loaded: false
            },
            {
                geometrySource: squareDeMontsouris1GeometrySource,
                geometry: null,
                collisionSource: squareDeMontsouris1CollisionSource,
                loaded: false
            },
            {
                geometrySource: squareDeMontsouris2GeometrySource,
                geometry: null,
                collisionSource: squareDeMontsouris2CollisionSource,
                loaded: false
            },
            {
                geometrySource: citeFleurie1GeometrySource,
                geometry: null,
                collisionSource: citeFleurie1CollisionSource,
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
