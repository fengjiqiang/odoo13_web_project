odoo.define('ListClickRenderer', function (require) {
"use strict";

var ListRenderer = require('web.ListRenderer');
var dialogs = require('web.view_dialogs');
var dom = require('web.dom');
var view_registry = require('web.view_registry');


dialogs.FormViewDialog.include({
    /**
     * Open the form view dialog.  It is necessarily asynchronous, but this
     * method returns immediately.
     *
     * @returns {FormViewDialog} this instance
     */
    open: function () {
        var self = this;
        var _super = this._super.bind(this);
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

                    if ($('.o_view_controller').length === 1) {
                        $('.o_form_sheet').append(fragment);
                    } else {
                        $('.o_view_controller').last().remove();
                        $('.o_form_sheet').append(fragment);
                    }
                    // return _super();
                });
        });

        return this;
    },
});

ListRenderer.include({
    /**
     * 多表联动
     * @override
     * @param {MouseEvent} event 
     */
    _onRowClicked: function (ev) {
        if (!ev.target.closest('.o_list_record_selector') && !$(ev.target).prop('special_click')) {
            var id = $(ev.currentTarget).data('id');
            if (id) {
                this.trigger_up('open_record', { id: id, target: ev.target });
            }
        }

    } 


});

});
