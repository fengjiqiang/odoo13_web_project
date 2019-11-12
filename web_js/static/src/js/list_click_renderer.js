odoo.define('ListClickRenderer', function (require) {
"use strict";

var ListRenderer = require('web.ListRenderer');
var FormController = require('web.FormController');
var dialogs = require('web.view_dialogs');
var dom = require('web.dom');
var view_registry = require('web.view_registry');

var controller;
var formviewdialog;

dialogs.FormViewDialog.include({
    /**
     * 动态联动视窗
     * 明细行显示在底部
     * @override
     * @returns {FormViewDialog} this instance
     */
    open: function () {
        var self = this;
        var _super = this._super.bind(this);
        // 加入if判断，避免影响其他模块
        if(controller.state.data[0].model !== 'training.book.copy' && controller.state.data[0].model !== 'book.rent.return'){
            return _super();
        }
        var FormView = view_registry.get('form');
        var fields_view_def;
        if (this.options.fields_view) {
            fields_view_def = Promise.resolve(this.options.fields_view);
        } else {
            fields_view_def = this.loadFieldView(this.res_model, this.context, this.options.view_id, 'form');
        }

        fields_view_def.then(function (viewInfo) {
            var refinedContext = _.pick(self.context, function (value, key) {
                return key.indexOf('_view_ref') === -1;
            });
            var formview = new FormView(viewInfo, {
                modelName: self.res_model,
                context: refinedContext,
                ids: self.res_id ? [self.res_id] : [],
                currentId: self.res_id || undefined,
                index: 0,
                mode: self.res_id && self.options.readonly ? 'readonly' : 'edit',
                // footerToButtons: true,
                // default_buttons: false,
                // withControlPanel: false,
                model: self.model,
                // parentID: self.parentID,
                recordID: self.recordID,
            });
            return formview.getController(self);
        }).then(function (formView) {
            self.form_view = formView;
            var fragment = document.createDocumentFragment();
            if (self.recordID && self.shouldSaveLocally) {
                self.model.save(self.recordID, { savePoint: true });
            }
            return self.form_view.appendTo(fragment)
                .then(function () {
                    self.opened().then(function () {
                        var $buttons = $('<div>');
                        self.form_view.renderButtons($buttons);
                        if ($buttons.children().length) {
                            self.$footer.empty().append($buttons.contents());
                        }
                        dom.append(self.$el, fragment, {
                            callbacks: [{ widget: self.form_view }],
                            in_DOM: true,
                        });
                    });

                    // 明细行显示在tree视图底部
                    var res = $(fragment).find('.o_list_view');
                    if(controller.state.data[0].model === 'training.book.copy'){
                        if ($('.o_list_view').length === 1) {
                            $('.o_form_sheet').append(res);
                        } else {
                            $('.o_list_view').last().remove();
                            $('.o_form_sheet').append(res);
                        }
                    }
                });
        });

        //dialog保存数据
        formviewdialog = this;
        return this;
    },
     /**
     * dialog保存数据
     * @private
     * @returns {Promise}
     */
    _save: function () {
        var self = this;
        return this.form_view.saveRecord(this.form_view.handle, {
            stayInEdit: true,
            reload: true, 
            // savePoint: !this.shouldSaveLocally,
            savePoint: false,
            // viewType: 'form',
        }).then(function (changedFields) {
            var record = self.form_view.model.get(self.form_view.handle);
            return self.on_saved(record, !!changedFields.length);
        });
    },

    
});

FormController.include({
/**
     * form保存数据
     * @private
     * @param {MouseEvent} ev
     */
    _onSave: function (ev) {
        // 指定模型执行_save()方法
        var model_list = ["training.book", "training.book.copy", "book.rent.return"]
        if (controller) {
            if (model_list.indexOf(controller.state.data[0].model) !== -1) {
                formviewdialog._save();
            }
        }
        ev.stopPropagation();
        var self = this;
        this._disableButtons();
        this.saveRecord().then(this._enableButtons.bind(this)).guardedCatch(this._enableButtons.bind(this));
    },
});

ListRenderer.include({
    /**
     * 动态联动视窗
     * @override
     * @param {MouseEvent} ev
     */
    _onRowClicked: function (ev) {
        controller = this;

        // 加入if判断，避免影响其他模块
        if (controller.state.data[0].model === 'training.book.copy') {
            if (!ev.target.closest('.o_list_record_selector') && !$(ev.target).prop('special_click')) {
                var id = $(ev.currentTarget).data('id');
                if (id) {
                    this.trigger_up('open_record', { id: id, target: ev.target });
                }
            }
        } else {
            this._super.apply(this, arguments);
        }
    } 


});

});
