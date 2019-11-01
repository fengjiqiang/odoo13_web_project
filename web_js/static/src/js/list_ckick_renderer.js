// odoo.define('ListClickRenderer', function (require) {
//     "use strict";

//     var ListRenderer = require('web.ListRenderer');
//     var FormRender = require('web.FormRenderer');

//     var controller;
//     var last_target_id = null;

//     FormRender.include({
//         _renderView: function () {
//             controller = this;
//             return this._super.apply(this, arguments);
//         }
//     })

//     ListRenderer.include({
//         /**
//          * 后台数据在前端页面展示
//          * @param {this} param 
//          * @param {点击记录数据表id} resid 
//          */
//         sel_fun: function (param, resid) {
//             // 执行rpc方法，返回后台数据
//             this._rpc({
//                 // 指定执行rpc的model、method，传递的参数
//                 model: 'training.book',
//                 method: 'write_rent_record',
//                 args: [resid],
//             }).then(function () {
//                 // reload方法 在前端页面显示内容
//                 param.trigger_up('reload');
//             });
//         },
//         /**
//          * 多表联动
//          * @override
//          * @param {MouseEvent} event 
//          */
//         _onRowClicked: function (event) {
//             var self = this;
//             var resid;
//             // 获取点击明细行id
//             var id = $(event.currentTarget).data('id');
//             // 获取此明细行的数据表id
//             for (let i = 0; i < self.state.data.length; i++) {
//                 if (self.state.data[i].id === id) {
//                     resid = self.state.data[i].data.id;
//                 }
//             }
//             /**
//              * 点击的模型为'training.book.copy'
//              * 当form处于可编辑状态时
//              * 连续两次相同点击，不走reload方法，明细行可编辑
//              * 否则将当前记录id赋值给last_target_id
//              */
//             if (self.state.data[0].model === 'training.book.copy') {
//                 if (controller && controller.mode === 'edit') {
//                     if (last_target_id !== resid) {
//                         this.sel_fun(self, resid);
//                         last_target_id = resid;
//                     }
//                 } else {
//                     this.sel_fun(self, resid);
//                 }
//             } else {
//                 this._super.apply(this, arguments);
//             }
//         },


//     });

// });
