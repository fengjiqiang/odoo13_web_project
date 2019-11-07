odoo.define('ListClickRenderer', function (require) {
"use strict";

var ListRenderer = require('web.ListRenderer');
var FormController = require('web.FormController');
var dialogs = require('web.view_dialogs');
var dom = require('web.dom');
var view_registry = require('web.view_registry');
var controller;
var formdialog;


FormController.include({
    /**
     * 保存数据
     * @private
     * @param {MouseEvent} ev
     */
    _onSave: function (ev) {
        ev.stopPropagation(); 
        formdialog._save();
        var self = this;
        this._disableButtons();
        this.saveRecord().then(this._enableButtons.bind(this)).guardedCatch(this._enableButtons.bind(this));
    },
});

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
        if (controller.state.data[0].model !== 'training.book.copy' && controller.state.data[0].model !== 'book.rent.return') {
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
                footerToButtons: true,
                default_buttons: false,
                withControlPanel: false,
                model: self.model,
                parentID: self.parentID,
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
                    // console.log(fragment);

                    if (controller.state.data[0].model === 'training.book.copy') {
                        if ($('.o_view_controller').length === 1) {
                            $('.o_form_sheet').append(fragment);
                        } else {
                            $('.o_view_controller').last().remove();
                            $('.o_form_sheet').append(fragment);
                        }
                    } 

                    // return _super();
                });
        });

        formdialog = this;
        return this;
    },

    /**
     * 保存数据
     */
    _save: function () {
        var self = this;
        return this.form_view.saveRecord(this.form_view.handle, {
            stayInEdit: true,
            reload: false,
            savePoint: this.shouldSaveLocally,
            viewType: 'form',
        }).then(function (changedFields) {
            var record = self.form_view.model.get(self.form_view.handle);
            return self.on_saved(record, !!changedFields.length);
        });
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

        if (!ev.target.closest('.o_list_record_selector') && !$(ev.target).prop('special_click')) {
            var id = $(ev.currentTarget).data('id');
            if (id) {
                this.trigger_up('open_record', { id: id, target: ev.target });
            }
        }

    } 


});

});
