odoo.define('ListClickRenderer', function (require) {
"use strict";

var ListRenderer = require('web.ListRenderer');
var FormRender = require('web.FormRenderer');

var controller;

FormRender.include({
    _renderView: function () {
        controller = this;
        return this._super.apply(this, arguments);
    }
})

ListRenderer.include({
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

        if (self.state.data[0].model === 'training.book.copy') {
            if ($('.o_field_one2many_new').length === 0) {
                $('.clearfix').append("<div class='o_field_one2many_new'>\
                                    <table style='table-layout: fixed;'>\
                                    <thead>\
                                    <tr>\
                                    <th tabindex='-1' style='width: 487px;'><span>书籍</span></th>\
                                    <th tabindex='-1' style='width: 487px;'><span>编号</span></th>\
                                    <th tabindex='-1' style='width: 487px;'><span>借阅人</span></th>\
                                    <th tabindex='-1' style='width: 487px;'><span>借阅时间</span></th>\
                                    <th tabindex='-1' style='width: 487px;'><span>归还时间</span></th>\
                                    <th tabindex='-1' style='width: 487px;'><span>持续时间</span></th>\
                                    </tr>\
                                    </thead>\
                                    <tbody class='new_table'>\
                                    </tbody>\
                                    </table>\
                                    </div>");
            }
            self._rpc({
                model: 'book.rent.return',
                method: 'search_read',
                args: [],
                kwargs: {
                    fields: ['copy_id', 'book_reference', 'customer_id', 'rental_date', 'return_date', 'continue_days'],
                    domain: [['copy_id', '=', resid]]
                }
            }).then(function (res) {
                // console.log(res);
                $('.new_table').empty();
                for (let i = 0; i < res.length; i++) {
                    var data = res[i];
                    // console.log(data);
                    $('.new_table').append("<tr>\
                                        <td>"+ data.copy_id[1] + "</td>\
                                        <td>"+ data.book_reference + "</td>\
                                        <td>"+ data.customer_id[1] + "</td>\
                                        <td>"+ data.rental_date + "</td>\
                                        <td>"+ self.is_false(data.return_date) + "</td>\
                                        <td>"+ self.is_false(data.continue_days) + "</td>\
                                        </tr>\
                ")
                }
            });
        } else {
            this._super.apply(this, arguments);
        }

    } 



});

});
