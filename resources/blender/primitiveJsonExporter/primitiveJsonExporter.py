import re
import bpy
import json
import subprocess
from pprint import pprint
from inspect import getmembers

###################################
# Get type
###################################
def getType(_object):
    
    if re.compile('cube', re.IGNORECASE).match(_object.data.original.name):
        
        return 'box'
    
    elif re.compile('cylinder', re.IGNORECASE).match(_object.data.original.name):
        
        return 'cylinder'
    
    elif re.compile('sphere|icosphere', re.IGNORECASE).match(_object.data.original.name):
        
        return 'sphere'
    
    return ''

###################################
# Get position
###################################
def getPosition(_object, _options):
    
    position = {}
    
    worldLocation = _object.matrix_world.to_translation()
    
    if _options['dimensions'] == 3:
        
        position['x'] = worldLocation.x
        position['y'] = worldLocation.y
        position['z'] = worldLocation.z
        
    elif _options['dimensions'] == 2:
        
        position['x'] = worldLocation.x
        position['y'] = worldLocation.y
        
    return position

###################################
# Get 3D rotation
###################################
def get3dRotation(_object, _options):
    
    rotation = {}
    
    if _options['dimensions'] == 3:
        
        if _options['rotation3dType'] == 'euler':
            
            worldRotation = _object.matrix_world.to_euler(_options['rotation3dOrder'])
            
            rotation['type'] = 'euler'
            rotation['x'] = worldRotation.x
            rotation['y'] = worldRotation.y
            rotation['z'] = worldRotation.z
        
        elif _options['rotation3dType'] == 'quaternion':
            
            worldRotation = _object.matrix_world.to_quaternion()
            
            rotation['type'] = 'quaternion'
            rotation['x'] = worldRotation.x
            rotation['y'] = worldRotation.y
            rotation['z'] = worldRotation.z
            rotation['w'] = worldRotation.w
            
    elif _options['dimensions'] == 2:
        
        worldRotation = _object.matrix_world.to_euler('ZYX')
            
        rotation = worldRotation.z
            
    return rotation

###################################
# Get 2D type
###################################
def get2dType(_type):

    if _type == 'box':
        
        return 'rectangle'
    
    if _type == 'cylinder':
        
        return 'circle'
    
    if _type == 'sphere':
        
        return 'circle'

###################################
# Create data
###################################
def getOutput(options):
    
    output = []

    if options['selectedOnly']:
        objects = bpy.context.selected_objects
    else:
        objects = bpy.data.objects

    for _object in objects:

        # Test if Mesh and visible
        if isinstance(_object.data, bpy.types.Mesh) and (options['visibleOnly'] == False or _object.visible_get()):
            
            object = {}

            # Get type
            object['type'] = getType(_object)
            
            # Type found
            if object['type'] != '':

                object['position'] = getPosition(_object, options)
                
                # Box
                if object['type'] == 'box':
                    
                    object['size'] = {}
                    
                    if options['dimensions'] == 3:
                
                        object['size']['x'] = _object.dimensions.x
                        object['size']['y'] = _object.dimensions.y
                        object['size']['z'] = _object.dimensions.z
                    
                    elif options['dimensions'] == 2:

                        print('YUUUUU')
            
                        object['size']['x'] = _object.dimensions.x
                        object['size']['y'] = _object.dimensions.y
                        
                    object['rotation'] = get3dRotation(_object, options)

                # Cylinder
                elif object['type'] == 'cylinder':
                    
                    object['radius'] = _object.dimensions.x / 2
                    
                    if options['dimensions'] == 3:
                    
                        object['rotation'] = get3dRotation(_object, options)
                        
                        object['height'] = _object.dimensions.z
                    
                # Sphere
                elif object['type'] == 'sphere':
                    
                    object['radius'] = _object.dimensions.x / 2
                
                # Convert type to 2D
                if options['dimensions'] == 2:
                    
                    object['type'] = get2dType(object['type'])
                    
                # Save
                output.append(object)
    
    if options['beautify'] == True:

        output = json.dumps(output, indent=options['indent'])

    return output

