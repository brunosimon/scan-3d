import * as THREE from 'three'
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader.js'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
import source from './resources/scans/1.ply'
import ParticlesMaterial from './Materials/ParticlesMaterial.js'

export default class Particles
{
    constructor()
    {
        this.container = new THREE.Group()

        // Material
        // this.material = new THREE.PointsMaterial({
        //     sizeAttenuation: true,
        //     size: 0.015,
        //     vertexColors: THREE.VertexColors,
        //     blending: THREE.AdditiveBlending,
        //     transparent: true,
        //     opacity: 1
        // })
        this.material = new ParticlesMaterial()
        this.material.uniforms.uSize.value = 10

        this.geometry = this.parseSource(source)
        this.points = new THREE.Points(this.geometry, this.material)
        this.container.add(this.points)

        // // Loaders
        // this.plyLoader = new PLYLoader()
        // this.objLoader = new OBJLoader()

        // // Load
        // this.plyLoader.load(
        //     source,
        //     (_a) =>
        //     {
        //         this.points = new THREE.Points(_a, this.material)
        //         this.container.add(this.points)
        //     }
        // )
    }

    parseSource(_source)
    {
        // Source parts
        const splitedSource = _source.split(/\nend_header\n/)
        const headerPart = splitedSource[0]
        const verticesPart = splitedSource[1]

        // Get count from header
        let count = 0

        const headerLines = headerPart.split(/\n/)
        for(const _line of headerLines)
        {
            const match = _line.match(/element\svertex\s([0-9]+)/)
            if(match)
            {
                count = parseInt(match[1])
            }
        }

        // Geometry
        const geometry = new THREE.BufferGeometry()
        const positionArray = new Float32Array(count * 3)
        const colorArray = new Float32Array(count * 3)
        const randomnessArray = new Float32Array(count * 1)

        // Get vertices
        const verticesLines = verticesPart.split(/\n/).slice(0, count)

        for(let i = 0; i < count; i++)
        {
            const verticeIndex = i * 3
            const line = verticesLines[i]
            const parsedLine = line.match(/(-?[0-9]+(?:\.[0-9]+)?)\s(-?[0-9]+(?:\.[0-9]+)?)\s(-?[0-9]+(?:\.[0-9]+)?)\s([0-9]{1,3})\s([0-9]{1,3})\s([0-9]{1,3})/)

            positionArray[verticeIndex + 0] = parseFloat(parsedLine[1])
            positionArray[verticeIndex + 1] = parseFloat(parsedLine[2])
            positionArray[verticeIndex + 2] = parseFloat(parsedLine[3])

            colorArray[verticeIndex + 0] = parseInt(parsedLine[4]) / 255
            colorArray[verticeIndex + 1] = parseInt(parsedLine[5]) / 255
            colorArray[verticeIndex + 2] = parseInt(parsedLine[6]) / 255

            randomnessArray[verticeIndex] = Math.random()
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positionArray, 3))
        geometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3))
        geometry.setAttribute('randomness', new THREE.BufferAttribute(randomnessArray, 1))

        return geometry
    }
}
