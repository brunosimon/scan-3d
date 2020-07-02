import bpy

def bake_uv_to_vc(image_name):
    # Lookup the image by name. Easier than trying to figure out which one is
    # currently active
    image = bpy.data.images[image_name]

    width = image.size[0]
    height = image.size[1]

    # Keep UVs in the within the bounds to avoid out-of-bounds errors
    def _clamp_uv(val):
        return max(0, min(val, 1))

    # Need to set the mode to VERTEX_PAINT, otherwise the vertex color data is
    # empty for some reason
    ob = bpy.context.object
    bpy.ops.object.mode_set(mode='VERTEX_PAINT')

    # Caching the image pixels makes this *much* faster
    local_pixels = list(image.pixels[:])

    for face in ob.data.polygons:
        for vert_idx, loop_idx in zip(face.vertices, face.loop_indices):
            uv_coords = ob.data.uv_layers.active.data[loop_idx].uv

            # Just sample the closest pixel to the UV coordinate. If you need
            # higher quality, an improved approach might be to implement
            # bilinear sampling here instead
            target = [round(_clamp_uv(uv_coords.x) * (width - 1)), round(_clamp_uv(uv_coords.y) * (height - 1))]
            index = ( target[1] * width + target[0] ) * 4

            bpy.context.object.data.vertex_colors["Col"].data[loop_idx].color[0] = local_pixels[index]
            bpy.context.object.data.vertex_colors["Col"].data[loop_idx].color[1] = local_pixels[index + 1]
            bpy.context.object.data.vertex_colors["Col"].data[loop_idx].color[2] = local_pixels[index + 2]
            bpy.context.object.data.vertex_colors["Col"].data[loop_idx].color[3] = local_pixels[index + 3]

bake_uv_to_vc("image_name")
