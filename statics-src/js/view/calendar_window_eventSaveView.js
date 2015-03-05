define([
    'i18n!nls/locale',
    'component',
    'text!templet/calendar_window_eventSave.html',
    'moment',
    'moment-timezone',
    'jquery.datetimepicker',
    'wysihtml5',
    'wysihtml5-config'
], function (locale, component, component_windowTemplet, moment) {

    app.views.calendar_window_eventSave = Backbone.View.extend({
        el: '#component_window_wrapper',
        model: null,
        initialize: function (_model) {
            if (_model) this.model = _model;
        },
        events: {
            'click #button_save_event': 'onSave',
            'click #button_delete': 'onDelete',
            'change #select_event_class': 'onChangeTheme',
            'change #input_event_start': function () {
                $('#input_event_end').val($('#input_event_start').val());
            }
        },
        onSave: function () {
            var EVENT_NAME = $('input[name=EVENT_NAME]').val(),
                EVENT_START = moment($('input[name=EVENT_START]').val()).unix(),
                EVENT_END = moment($('input[name=EVENT_END]').val()).unix(),
                EVENT_INTRO = $('textarea[name=EVENT_INTRO]').val(),
                EVENT_CLASS = $('#select_event_class').val(),
                EVENT_PERMISSION = $('#select_event_permission').val(),
                EVENT_OWNER = $('#select_event_owner').val(),
                SUCCEED = 1;

            if (!EVENT_NAME || !EVENT_START || !EVENT_END) {
                SUCCEED = 0;
                component.alert({
                    'TITLE': locale.root.dialog.title_error,
                    'MESSAGE': locale.root.dialog.content_not_completed,
                    'BUTTON_TRUE_TITLE': locale.root.dialog.button_true
                });
            } else if (EVENT_START > EVENT_END) {
                SUCCEED = 0;
                component.alert({
                    'TITLE': locale.root.dialog.title_error,
                    'MESSAGE': locale.root.dialog.time_range_error,
                    'BUTTON_TRUE_TITLE': locale.root.dialog.button_true
                });
            }
            if (SUCCEED) {
                if (!this.model) this.model = new app.models.event();
                this.model.set('name', EVENT_NAME);
                this.model.set('start', EVENT_START);
                this.model.set('end', EVENT_END);
                this.model.set('intro', EVENT_INTRO);
                this.model.set('className', EVENT_CLASS);
                this.model.set('id_user', EVENT_OWNER);
                this.model.set('permission', EVENT_PERMISSION);
                this.model.save();
                component.component_window_remove();
            }
        },
        onDelete: function () {
            component.confirm({
                'TITLE': locale.root.dialog.title_confirm,
                'MESSAGE': locale.root.component_window.common.title_delete_confirm,
                'BUTTON_TRUE_TITLE': locale.root.dialog.button_true,
                'BUTTON_FALSE_TITLE': locale.root.dialog.button_false,
                'CALLBACK_TRUE': _.bind(function () {
                    component.dialogRemove();
                    this.model.destroy();
                    component.component_window_remove();
                }, this)
            });
        },
        onChangeTheme: function (_element) {
            $('#select_event_class').removeClass().addClass('select').addClass($('#select_event_class').val());
        },
        render: function (_calendarDate) {
            this.template = _.template(component_windowTemplet);
            if (this.model) {
                this.$el.html(this.template({
                    EVENT_NAME: this.model.get('name'),
                    EVENT_START: moment.unix(this.model.get('start')).format('YYYY-MM-DD'),
                    EVENT_END: moment.unix(this.model.get('end')).format('YYYY-MM-DD'),
                    EVENT_INTRO: this.model.get('intro'),
                    EVENT_CLASS: this.model.get('className'),
                    EVENT_PERMISSION: this.model.get('permission'),
                    EVENT_OWNER: this.model.get('id_user')
                }));
            } else {
                this.$el.html(this.template({
                    EVENT_NAME: '',
                    EVENT_START: _calendarDate,
                    EVENT_END: _calendarDate,
                    EVENT_INTRO: '',
                    EVENT_CLASS: 'fc-green',
                    EVENT_PERMISSION: 'public',
                    EVENT_OWNER: app.instances.models.user.get('id')
                }));
            }
            var dateTimeLang = 'en';
            if (localStorage.getItem('locale') == 'zh-cn') dateTimeLang = 'ch';
            $('#input_event_start').datetimepicker({
                lazyInit: true,
                lang: dateTimeLang,
                timepicker: false,
                closeOnDateSelect: true,
                format: 'Y-m-d'
            });
            $('#input_event_end').datetimepicker({
                lazyInit: true,
                lang: dateTimeLang,
                timepicker: false,
                closeOnDateSelect: true,
                format: 'Y-m-d'
            });
            var editor = new wysihtml5.Editor("editor", {
                toolbar: "editor_toolbar",
                parserRules: wysihtml5ParserRules
            });
            return this;
        }
    });

});