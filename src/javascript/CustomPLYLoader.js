import * as THREE from 'three'

export default class CustomPLYLoader
{
    constructor()
    {

    }

    load(_url, _onComplete)
    {
        window
            .fetch(_url)
            .then((_response) =>
            {
                return _response.text()
            })
            .then((_result) =>
            {
                // Source parts
                const splitedSource = _result.split(/[\n\r]end_header[\n\r]/)
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

                // Get vertices
                const verticesLines = verticesPart.split(/\n/).slice(0, count)

                for(let i = 0; i < count; i++)
                {
                    const verticeIndex = i * 3
                    const line = verticesLines[i]
                    const parsedLine = line.match(/(-?[0-9]+(?:\.[0-9]+)?)\s(-?[0-9]+(?:\.[0-9]+)?)\s(-?[0-9]+(?:\.[0-9]+)?)\s([0-9]{1,3})\s([0-9]{1,3})(\s([0-9]{1,3}))?/)

                    if(parsedLine)
                    {
                        positionArray[verticeIndex + 0] = parseFloat(parsedLine[1])
                        positionArray[verticeIndex + 1] = parseFloat(parsedLine[2])
                        positionArray[verticeIndex + 2] = parseFloat(parsedLine[3])

                        colorArray[verticeIndex + 0] = parseInt(parsedLine[4]) / 255
                        colorArray[verticeIndex + 1] = parseInt(parsedLine[5]) / 255
                        colorArray[verticeIndex + 2] = parseInt(parsedLine[6]) / 255
                    }
                }

                geometry.setAttribute('position', new THREE.BufferAttribute(positionArray, 3))
                geometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3))

                _onComplete(geometry)
            })
    }
}
