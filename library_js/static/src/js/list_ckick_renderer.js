odoo.define('ListClickRenderer', function (require) {
    "use strict";

    var ListRenderer = require('web.ListRenderer');
    var ListController = require('web.ListController');
    var FormRender = require('web.FormRenderer');
    var session = require('web.session');

    var renderer;
    var controller;
    var last_target_id = null;

    FormRender.include({
        _renderView: function () {
            controller = this;
            return this._super.apply(this, arguments);
        }
    })

    // ListController.include({
    //     renderPager: function(){
    //         controller = this;
    //         console.log('controller', controller);
    //     }
    // });

    ListRenderer.include({
        // 复选框尝试失败
        // events: {
        //     'change tbody .o_data_cell o_field_cell o_checkbox_cell': '_onChooseRecord',
        // },
        // _onChooseRecord: function (ev) {
        //     ev.stopPropagation();
        //     this._updateSelection();
        // },

        _onRowClicked: function (event) {
            var model_list = ["training.book.copy", "training.book"]
            var name_list = ["book_rent_ids", "book_copy_ids"]
            // if (!this._isRecordEditable(ev.currentTarget.dataset.id)) {
            //     // If there is an edited record, tries to save it and do not open the clicked record
            //     if (this.getEditableRecordID()) {
            //         this.unselectRow();
            //     } else {
            //         this._super.apply(this, arguments);
            //     }
            // }
            var self = this;
            var id = $(event.currentTarget).data('id');
            // var resid = this._getRecord(id).data.id;
            for (let i = 0; i < self.state.data.length; i++) {
                if (self.state.data[i].id === id) {
                    resid = self.state.data[i].data.id;
                }
            }

            if (controller && controller.mode === 'edit') {
                session.user_context['default_ISBN'] = "23545678";
                if (self.state.data[0].model === 'training.book.copy') {
                    if (last_target_id === resid) {
                        return;
                    } else {
                        last_target_id = resid;
                    }
                }
                if (self.state.data[0].model === 'book.rent.return') {
                    this._super.apply(this, arguments);
                    return;
                }
            }


            if (this.viewType == 'list') {
                if(model_list.indexOf(this.__parentedParent.model) === -1 && name_list.indexOf(this.__parentedParent.name) === -1){
                    this._super.apply(this, arguments);
                    return;
                }

                var self = this;
                var id = $(event.currentTarget).data('id');
                var resid;
                if (id) {
                    // 获取记录id
                    // for (let i = 0; i < self.state.data.length; i++) {
                    //     if (self.state.data[i].id == id) {
                    //         resid = self.state.data[i].data.id;
                    //     }
                    // }
                    // 方法二获取记录id
                    var record = self._getRecord(id);
                    resid = record.data.id;
                }
                this._rpc({
                    // model: this.state.model,   // 当前模型名称
                    model: 'training.book',
                    method: 'write_rent_record',
                    args: [resid],
                // });
                }).then(function () {
                    // 方式一reload
                    self.trigger_up('save_line', {
                        recordID: self.state.data[0].id,
                    });
                    self.trigger_up('reload');
                    // 方式二switch_view,效果同方式一
                //     self.trigger_up('switch_view', {
                //         view_type: 'form',
                //         context: {'default_ISBN': '23545678'},
                //         // res_id: resid,
                //         mode: 'edit',
                //         // model: 'training.book',
                //         // target: 'self',
                //     })
                // });
                // }).then(function () {
                //     self._super.apply(self, arguments);
                });

                // this._rpc({
                //     // model: this.state.model,   // 当前模型名称
                //     model: 'training.book.copy',
                //     method: 'write_customer_info',
                //     args: [resid],
                //     // kwargs: {id: resid}
                // }).then(function () {
                //     self.trigger_up('reload');
                // });


                // this.state.data[0].data.book_location="馆A-1-1";
                // // renderview
                // var self = this;
                // this.$el
                //     .removeClass('table-responsive')
                //     .empty();

                // // destroy the previously instantiated pagers, if any
                // _.invoke(this.pagers, 'destroy');
                // this.pagers = [];

                // var displayNoContentHelper = !this._hasContent() && !!this.noContentHelp;
                // // display the no content helper if there is no data to display
                // if (displayNoContentHelper) {
                //     this.$el.html(this._renderNoContentHelper());
                //     return this._super();
                // }

                // var $table = $('<table>').addClass('o_list_view table table-sm table-hover table-striped');
                // this.$el.addClass('table-responsive')
                //     .append($table);
                // this._computeAggregates();
                // $table.toggleClass('o_list_view_grouped', this.isGrouped);
                // $table.toggleClass('o_list_view_ungrouped', !this.isGrouped);
                // this.hasHandle = this.state.orderedBy.length === 0 ||
                //     this.state.orderedBy[0].name === this.handleField;
                // if (this.isGrouped) {
                //     $table
                //         .append(this._renderHeader(true))
                //         .append(this._renderGroups(this.state.data))
                //         .append(this._renderFooter());
                // } else {
                //     $table
                //         .append(this._renderHeader())
                //         .append(this._renderBody())
                //         .append(this._renderFooter());
                // }
                // if (this.selection.length) {
                //     var $checked_rows = this.$('tr').filter(function (index, el) {
                //         return _.contains(self.selection, $(el).data('id'));
                //     });
                //     $checked_rows.find('.o_list_record_selector input').prop('checked', true);
                // }


            }
        },


    });

});
