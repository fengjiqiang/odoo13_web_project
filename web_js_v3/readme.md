### JS联动(V3.0)文档说明

- 有A,B,C三个表，其中A表中有1个One2many字段，关联到B表，B表中有1个One2many字段，关联到C表。在A表的form视图中，实现B与C两表联动。
- 具体操作：
当点击A表关联到B表的One2many明细行时，会显示B表关联到C表的One2many明细，明细行可以增删改，但是无法保存，正在完善。
- 实现方式：
通过JS操作DOM，实现将弹出的dialog移到tree视图下面，实现B,C两表联动。