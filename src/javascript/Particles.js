import * as THREE from 'three'
import source from './resources/scans/1.ply'
import ParticlesMaterial from './Materials/ParticlesMaterial.js'
import FlowFieldMap from './FlowFieldMap.js'
import FlowFieldParticlesMaterial from './Materials/FlowFieldParticlesMaterial'

export default class Particles
{
    constructor(_options = {})
    {
        this.debug = _options.debug
        this.time = _options.time
        this.renderer = _options.renderer

        // Set up
        this.container = new THREE.Group()

        // Debug
        if(this.debug)
        {
            this.debug.Register({
                type: 'folder',
                label: 'particles',
                open: true
            })
        }

        this.setFlowField()

        // Material
        this.material = new ParticlesMaterial()
        this.material.uniforms.uSize.value = 30
        this.material.uniforms.uPositionRandomness.value = 0.02
        this.material.uniforms.uAlpha.value = 1

        if(this.debug)
        {
            this.debug.Register({
                folder: 'particles',
                type: 'range',
                label: 'uSize',
                min: 1,
                max: 100,
                object: this.material.uniforms.uSize,
                property: 'value'
            })

            this.debug.Register({
                folder: 'particles',
                type: 'range',
                label: 'uPositionRandomness',
                min: 0,
                max: 0.3,
                step: 0.0001,
                object: this.material.uniforms.uPositionRandomness,
                property: 'value'
            })

            this.debug.Register({
                folder: 'particles',
                type: 'range',
                label: 'uAlpha',
                min: 0,
                max: 1,
                step: 0.001,
                object: this.material.uniforms.uAlpha,
                property: 'value'
            })
        }

        // Geometry
        this.geometry = this.parseSource(source)

        // Points
        this.points = new THREE.Points(this.geometry, this.material)
        // this.container.add(this.points)
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
        const alphaArray = new Float32Array(count * 1)
        const sizeArray = new Float32Array(count * 1)

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

            alphaArray[verticeIndex] = 0.2 + Math.random() * 0.8
            sizeArray[verticeIndex] = Math.random()
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positionArray, 3))
        geometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3))
        geometry.setAttribute('alpha', new THREE.BufferAttribute(alphaArray, 1))
        geometry.setAttribute('size', new THREE.BufferAttribute(sizeArray, 1))

        return geometry
    }

    setFlowField()
    {
        this.flowField = {}

        // Map
        this.flowField.map = new FlowFieldMap({ renderer: this.renderer })

        // Dummy
        this.flowField.dummyMap = new THREE.Mesh(
            new THREE.PlaneBufferGeometry(5, 5, 1, 1),
            new THREE.MeshBasicMaterial({
                map: this.flowField.map.renderTargets.current.texture
            })
        )
        this.flowField.dummyMap.rotation.y = Math.PI
        this.flowField.dummyMap.position.y = 1.5
        this.container.add(this.flowField.dummyMap)

        // Particles
        this.flowField.particles = {}
        this.flowField.particles.geometry = new THREE.BufferGeometry()

        const positionArray = new Float32Array(this.flowField.map.size * 3)

        for(let i = 0; i < this.flowField.map.size; i++)
        {
            const verticeIndex = i * 3

            positionArray[verticeIndex + 0] = (i % this.flowField.map.width) / this.flowField.map.width
            positionArray[verticeIndex + 1] = ~~(i / this.flowField.map.width) / this.flowField.map.height
        }

        this.flowField.particles.geometry.setAttribute('position', new THREE.BufferAttribute(positionArray, 3))

        this.flowField.particles.material = new FlowFieldParticlesMaterial()
        this.flowField.particles.material.uniforms.uFBOTexture.value = this.flowField.map.renderTargets.current.texture

        this.flowField.particles.points = new THREE.Points(this.flowField.particles.geometry, this.flowField.particles.material)
        this.container.add(this.flowField.particles.points)

        // Time tick event
        this.time.on('tick', () =>
        {
            this.flowField.map.render()
            // this.flowField.particles.material.uniforms.uFBOTexture.value = this.flowField.map.renderTargets.current.texture
        })
    }
}
