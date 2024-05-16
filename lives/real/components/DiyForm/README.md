当前组件主要用来做动态表单渲染。使用案例可查看当前项目页 /lives/real/index

<DiyForm
:defaultValue="item.default"
:type="item.type"
:item="item"
@itemChange="formItemChange($event,i)"
:valueChange.sync="item.default" ></DiyForm>


