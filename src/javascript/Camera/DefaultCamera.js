import * as THREE from 'three'

export default class DefaultCamera
{
    constructor(_options)
    {
        this.time = _options.time
        this.baseInstance = _options.baseInstance

        this.instance = this.baseInstance.clone()
        this.instance.rotation.order = 'YXZ'
    }
}
