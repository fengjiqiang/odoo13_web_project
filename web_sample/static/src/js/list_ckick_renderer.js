odoo.define('ListClickRenderer', function (require) {
    "use strict";

    var ListRenderer = require('web.ListRenderer');
    var FormRender = require('web.FormRenderer');

    var controller;
    var last_target_id = null;

    FormRender.include({
        _renderView: function () {
            controller = this;
            return this._super.apply(this, arguments);
        }
    })
    ListRenderer.include({
        /**
         * 后台数据在前端页面展示
         * @param {this} param 
         * @param {点击记录数据表id} resid 
         */
        sel_fun: function (param, resid) {
            // 执行rpc方法，返回后台数据
            this._rpc({
                // 指定执行rpc的model、method，传递的参数
                model: 'web.purchase.order',
                method: 'write_product_record',
                args: [resid],
            }).then(function () {
                // reload方法 在前端页面显示内容
                param.trigger_up('reload');
            });
        },
        /**
         * 多表联动
         * @override
         * @param {MouseEvent} event 
         */
        _onRowClicked: function (event) {
            // 自定义model和name(One2many字段)
            var model_list = ["web.purchase.order"]
            var name_list = ["order_line"]
            var self = this;
            var resid;
            // 获取点击明细行id
            var id = $(event.currentTarget).data('id');
            // 获取此明细行的数据表id
            for (let i = 0; i < self.state.data.length; i++) {
                if (self.state.data[i].id === id) {
                    resid = self.state.data[i].data.id;
                }
            }
            // 当form处于可编辑状态时
            if (controller && controller.mode === 'edit') {
                /**
                 * 点击的模型为'training.book.copy'
                 * 连续两次相同点击，不走reload方法，明细行可编辑
                 * 否则将当前记录id赋值给last_target_id
                 */
                if (self.state.data[0].model === 'web.purchase.order.line') {
                    if (last_target_id !== resid) {
                        this.sel_fun(self, resid);
                        // 上一次点击记录是可编辑状态时，弹框提示
                        // if (self.mode !== undefined) {
                        //     alert("记录已修改，请保存！");
                        // }
                        last_target_id = resid;
                    }
                }
            } else {
                this.sel_fun(self, resid);
            }
            /**
             * 如果点击记录的model和name不在自定义列表中
             * 执行父类方法
             */
            if(model_list.indexOf(this.__parentedParent.model) === -1 && name_list.indexOf(this.__parentedParent.name) === -1){
                this._super.apply(this, arguments);
            }
        },

    });

});
