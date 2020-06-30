bl_info = {
    'name': 'Primitive Data Exporter',
    'author': 'Bruno Simon (contact@bruno-simon.com)',
    'version': (0, 0, 1, 0),
    'blender': (2, 8, 2)
}

# Add the current file path to the import
import sys
import os
import bpy
from bpy_extras.io_utils import ExportHelper
from bpy.props import StringProperty, BoolProperty, EnumProperty
from bpy.types import Operator

blend_dir = os.path.dirname(bpy.data.filepath)
if blend_dir not in sys.path:
   sys.path.append(blend_dir)
   
import importlib
import primitiveJsonExporter

importlib.reload(primitiveJsonExporter)

# Code
def write_some_data(context, filepath, options):
    f = open(filepath, 'w', encoding='utf-8')
    f.write(primitiveJsonExporter.getOutput(options))
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

