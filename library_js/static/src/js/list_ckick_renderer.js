odoo.define('ListClickRenderer', function (require) {
"use strict";

var ListRenderer = require('web.ListRenderer');
var ListController = require('web.ListController');

var renderer;
var controller;

// ListController.include({
//     renderPager: function(){
//         controller = this;
//         console.log('controller', controller);
//     }
// });

ListRenderer.include({
    // _renderView: function(){
    //     renderer = this;
    //     var result = this._super.apply(this,arguments);
    //     return result;
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
        if (!this._isRecordEditable(event.currentTarget.dataset.id) && this.viewType == 'list') {
            if(model_list.indexOf(this.__parentedParent.model)==-1 && name_list.indexOf(this.__parentedParent.name)==-1){
                this._super.apply(this, arguments);
                return;
            }

            var self = this;

            // this.state.data[0].data.ISBN="56768";
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

            var id = $(event.currentTarget).data('id');
            var resid;
            if (id) {
                // 获取记录id
                for (let i = 0; i < self.state.data.length; i++) {
                    if (self.state.data[i].id == id) {
                        resid = self.state.data[i].data.id;
                    }
                }
                // this.trigger_up('open_record', { id: id, target: event.target});
                // var record = controller.model.get(id, {raw: true});
            }
            // id = record.data.id;
            this._rpc({
                // model: this.state.model,   // 当前模型名称
                model: 'training.book.copy',
                method: 'write_cus',
                args: [resid],
                // kwargs: {id: resid}
            }).then(function () {
                self.trigger_up('reload');
                //  self.trigger_up('switch_view', {
                //     view_type: 'form',
                //     res_id: id,
                //     mode: 'readonly',
                //     model: 'training.book.copy',
                // });
            });

            this._rpc({
                // model: this.state.model,   // 当前模型名称
                model: 'training.book',
                method: 'write_rent_record',
                args: [resid],
            }).then(function () {
                self.trigger_up('reload');
            });
            // 废弃
            // this.do_action({
            //     name: 'Attachments',
            //     type: 'ir.actions.act_window',
            //     // res_model: $(ev.currentTarget).data('model'),
            //     // res_model: this.state.model,
            //     res_model: 'training.book.copy',
            //     // domain: [['id', '=', resid]],
            //     // views: [[false, 'list']],
            //     // view_mode: 'list',
            //     res_id: resid,
            //     views: [[false, 'form']],
            //     view_mode: 'form',
            //     target: 'self',
            // });
            console.log("2019-10-10");
        }
    },

});

});
