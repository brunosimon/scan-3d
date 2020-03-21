import bpy
import json
import subprocess

data = []

objects = bpy.context.selected_objects

# Each selected object
for _object in objects:
    # Is CURVE
    if _object.type == 'CURVE':
        colorIndex = 0;
        if 'colorIndex' in _object.keys():
            colorIndex = _object['colorIndex'];
        
        # Each spline of the curve
        for _spline in _object.data.splines:
            
            # Create spline data
            splineData = {}
            splineData['length'] = _spline.calc_length()
            splineData['name'] = _object.name
            splineData['points'] = []
            splineData['closed'] = _spline.use_cyclic_u
            splineData['colorIndex'] = colorIndex
            data.append(splineData)
            
            # Each point of the spline
            for _bezier_point in _spline.bezier_points:
                
                # Save in result
                splineData['points'].append({
                    'p': {
                        'x': round(_bezier_point.co[0] + _object.location.x, 7),
                        'y': round(_bezier_point.co[1] + _object.location.y, 7),
                        'z': round(_bezier_point.co[2] + _object.location.z, 7)
                    },
                    'lp': {
                        'x': round(_bezier_point.handle_left[0] + _object.location.x, 7),
                        'y': round(_bezier_point.handle_left[1] + _object.location.y, 7),
                        'z': round(_bezier_point.handle_left[2] + _object.location.z, 7)
                    },
                    'rp': {
                        'x': round(_bezier_point.handle_right[0] + _object.location.x, 7),
                        'y': round(_bezier_point.handle_right[1] + _object.location.y, 7),
                        'z': round(_bezier_point.handle_right[2] + _object.location.z, 7)
                    }
                })

jsonData = json.dumps(data, sort_keys=True, indent=4)
# print(jsonData)

subprocess.run("pbcopy", universal_newlines=True, input=jsonData)

print('data has been copied to your clipboard')
