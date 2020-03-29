# Scan 3D

## Setup
Download [Node.js](https://nodejs.org/en/download/).
Run this followed commands:

``` bash
# Install dependencies (only for first time)
npm i

# Serve at localhost:8080
npm run dev

# Build for production in the dist/ directory
npm run build
```

## Zephyr export

**Dense point cloud**

- Category: General
- Presets: Default

**3D Model Generation**

- Category: General
- Presets: High Details

**Texturing**

- Category: General
- Presets: Default Single Texture


## Blender export

- Merge vertices by distance
- Rotate
- Fix wrong meshing (floor, ceiling, reflections)
- Run `/resources/blender/textureToVertexColors.py` to convert texture to vertex color
- Export as PLY (`Z Forward`, `Y Up`, `Scale 1.0`, `Vertex Color`) and don't export manReference
- Remove faces from PLY file

