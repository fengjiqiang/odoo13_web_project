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
    // sel_fun: function (param, resid) {
    //     // 执行rpc方法，返回后台数据
    //     this._rpc({
    //         // 指定执行rpc的model、method，传递的参数
    //         model: 'training.book',
    //         method: 'write_rent_record',
    //         args: [resid],
    //     }).then(function () {
    //         // reload方法 在前端页面显示内容
    //         param.trigger_up('reload');
    //     });
    // },
    /**
     * 判断data是否为空
     * 如果为空，返回空字符串
     * @param {data} data 
     */
    is_false: function (data) {
        if (!data) {
            return " ";
        } else {
            return data;
        }
    },
    /**
     * 多表联动
     * @override
     * @param {MouseEvent} event 
     */
    _onRowClicked: function (event) {
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
        /**
         * 点击的模型为'training.book.copy'
         * 当form处于可编辑状态时
         * 连续两次相同点击，不走reload方法，明细行可编辑
         * 否则将当前记录id赋值给last_target_id
         */
        // if (self.state.data[0].model === 'training.book.copy') {
        //     if (controller && controller.mode === 'edit') {
        //         if (last_target_id !== resid) {
        //             this.sel_fun(self, resid);
        //             last_target_id = resid;
        //         }
        //     } else {
        //         this.sel_fun(self, resid);
        //     }
        // } else {
        //     this._super.apply(this, arguments);
        // }
        if (self.state.data[0].model === 'training.book.copy') {
            if ($('.o_field_one2many_new').length === 0) {
                $('.clearfix').append("<div class='o_field_one2many_new'>\
                                        <table style='table-layout: fixed;'>\
                                        <thead>\
                                        <tr>\
                                        <th tabindex='-1' class='o_column_sortable' data-original-title='' title='' style='width: 487px;'><span class='o_resize'>书籍</span></th>\
                                        <th tabindex='-1' class='o_column_sortable' data-original-title='' title='' style='width: 487px;'><span class='o_resize'>编号</span></th>\
                                        <th tabindex='-1' class='o_column_sortable' data-original-title='' title='' style='width: 487px;'><span class='o_resize'>借阅人</span></th>\
                                        <th tabindex='-1' class='o_column_sortable' data-original-title='' title='' style='width: 487px;'><span class='o_resize'>借阅时间</span></th>\
                                        <th tabindex='-1' class='o_column_sortable' data-original-title='' title='' style='width: 487px;'><span class='o_resize'>归还时间</span></th>\
                                        <th tabindex='-1' class='o_column_sortable' data-original-title='' title='' style='width: 487px;'><span class='o_resize'>持续时间</span></th>\
                                        </tr>\
                                        </thead>\
                                        <tbody class='new_table'>\
                                        </tbody>\
                                        </table>\
                                        </div>");
            }
            self._rpc({
                model:'book.rent.return',
                method:'search_read',
                args:[],
                kwargs:{
                    fields:['copy_id','book_reference','customer_id','rental_date','return_date','continue_days'],
                    domain:[['copy_id','=',resid]]
                }   
            }).then(function(res){
                // console.log(res);
                $('.new_table').empty();
                for (let i=0; i<res.length; i++) {
                    var data = res[i];
                    console.log(data);
                    $('.new_table').append("<tr>\
                                            <td>"+ data.copy_id[1] +"</td>\
                                            <td>"+ data.book_reference +"</td>\
                                            <td>"+ data.customer_id[1] +"</td>\
                                            <td>"+ data.rental_date +"</td>\
                                            <td>"+ self.is_false(data.return_date) +"</td>\
                                            <td>"+ self.is_false(data.continue_days) +"</td>\
                                            </tr>\
                    ")
                }
            })
        } else {
            this._super.apply(this, arguments);
        }
   },


});

});
