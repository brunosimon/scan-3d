# Add the current file path to the import
import sys
import os
import bpy
from bpy_extras.io_utils import ExportHelper
from bpy.props import StringProperty, BoolProperty, EnumProperty
from bpy.types import Operator
import re
import json

###################################
# primitiveJsonExporter
###################################

# Get type
def getType(_object):
    
    if re.compile('cube', re.IGNORECASE).match(_object.data.original.name):
        
        return 'box'
    
    elif re.compile('cylinder', re.IGNORECASE).match(_object.data.original.name):
        
        return 'cylinder'
    
    elif re.compile('sphere|icosphere', re.IGNORECASE).match(_object.data.original.name):
        
        return 'sphere'
    
    return ''

# Get position
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

# Get 3D rotation
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

# Get 2D type
def get2dType(_type):

    if _type == 'box':
        
        return 'rectangle'
    
    if _type == 'cylinder':
        
        return 'circle'
    
    if _type == 'sphere':
        
        return 'circle'

# Create data
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

###################################
# Exporter
###################################
def write_some_data(context, filepath, options):
    f = open(filepath, 'w', encoding='utf-8')
    f.write(getOutput(options))
    f.close()

    return {'FINISHED'}

# ExportHelper is a helper class, defines filename and
# invoke() function which calls the file selector.
class PrimitiveDataExporter(Operator, ExportHelper):
    # This appears in the tooltip of the operator and in the generated docs
    bl_idname = 'export_test.some_data'  # important since its how bpy.ops.import_test.some_data is constructed
    bl_label = 'Primitive Data Exporter'

    # ExportHelper mixin class uses this
    filename_ext = '.json'

    filter_glob: StringProperty(
        default='*.json',
        options={'HIDDEN'},
        maxlen=255,  # Max internal buffer length, longer would be clamped.
    )

    selectedOnly: BoolProperty(
        name='Selected only',
        description='Only export selected objects',
        default=False,
    )

    visibleOnly: BoolProperty(
        name='Visible only',
        description='Only export visible objects',
        default=True,
    )

    dimensions: EnumProperty(
        name='Dimensions',
        description='World dimensions',
        items=(
            ('2', '2D', '2D with X and Y'),
            ('3', '3D', '3D with XYZ'),
        ),
        default='3',
    )

    rotation3dType: EnumProperty(
        name='3D rotation type',
        description='Rotation type (only for 3D)',
        items=(
            ('euler', 'Euler', '...'),
            ('quaternion', 'Quaternion', '...'),
        ),
        default='euler',
    )

    rotation3dOrder: EnumProperty(
        name='3D rotation order',
        description='Rotation order (only for 3D)',
        items=(
            ('XYZ', 'XYZ', '...'),
            ('XZY', 'XZY', '...'),
            ('YXZ', 'YXZ', '...'),
            ('YZX', 'YZX', '...'),
            ('ZXY', 'ZXY', '...'),
            ('ZYX', 'ZYX', '...')
        ),
        default='XYZ',
    )

    beautify: BoolProperty(
        name='Beautify',
        description='Make the JSON looks good with line breaks and indentation',
        default=True,
    )
    
    indent: EnumProperty(
        name='Indent',
        description='How many spaces to indent',
        items=(
            ('2', '2', '2 spaces'),
            ('3', '3', '3 spaces'),
            ('4', '4', '4 spaces'),
            ('8', '8', '8 spaces')
        ),
        default='4',
    )

    def execute(self, context):
        options = {
            'selectedOnly': self.selectedOnly,
            'visibleOnly': self.visibleOnly,
            'dimensions': int(self.dimensions),
            'rotation3dType': self.rotation3dType,
            'rotation3dOrder': self.rotation3dOrder,
            'beautify': self.beautify,
            'indent': int(self.indent)
        }
        
        return write_some_data(context, self.filepath, options)


# Only needed if you want to add into a dynamic menu
def menu_func_export(self, context):
    self.layout.operator(PrimitiveDataExporter.bl_idname, text='Primitive data (json)')

def register():
    bpy.utils.register_class(PrimitiveDataExporter)
    bpy.types.TOPBAR_MT_file_export.append(menu_func_export)

def unregister():
    bpy.utils.unregister_class(PrimitiveDataExporter)
    bpy.types.TOPBAR_MT_file_export.remove(menu_func_export)

if __name__ == '__main__':
    register()

    # test call
    bpy.ops.export_test.some_data('INVOKE_DEFAULT')

