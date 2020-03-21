import bpy

ob_sel = bpy.context.selected_editable_objects
ob_act = bpy.context.object

for ob in ob_sel:
    if ob == ob_act:
        continue
    for p in ob_act.keys():
        print(p, ob_act[p])
        ob[p] = ob_act[p]