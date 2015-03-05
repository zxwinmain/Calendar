define([
    'i18n!nls/locale',
    'component',
    'text!templet/component_window_settingsView.html',
    'moment-timezone',
    'jquery.ajaxfileupload'
], function (locale, component, component_windowTemplet, moment) {

    app.views.component_window_settings = Backbone.View.extend({
        el: '#component_window_wrapper',
        events: {
            'click ul.swicher a': function (e) {
                component.component_window_tab(e);
            },
            'click #button_save_profile': 'onSaveProfile',
            'click #button_save_locale': 'onSaveLocale',
            'click #button_save_avatar': 'onSaveAvatar',
            'click #button_save_system': 'onSaveSystem',
            'click a.administrator': 'onSetAdministrator',
            'click a.resetPassword': 'onResetPassword',
            'click a.delete': 'onDeleteUser',
            'click a.block': 'onBlockUser',
            'click #button_save_new_user': 'onInviteUser'
        },
        onSaveProfile: function () {
            var USER_EMAIL = $('input[name=USER_EMAIL]').val(),
                USER_NAME = $('input[name=USER_NAME]').val(),
                USER_PASSWORD = $('input[name=USER_PASSWORD]').val(),
                SUCCEED = 1;

            if (!USER_EMAIL || !USER_NAME) {
                SUCCEED = 0;
                component.alert({
                    'TITLE': locale.root.dialog.title_error,
                    'MESSAGE': locale.root.dialog.content_not_completed,
                    'BUTTON_TRUE_TITLE': locale.root.dialog.button_true
                });
            } else if (!component.isEmail(USER_EMAIL)) {
                SUCCEED = 0;
                component.alert({
                    'TITLE': locale.root.dialog.title_error,
                    'MESSAGE': locale.root.dialog.signin_invalid_email,
                    'BUTTON_TRUE_TITLE': locale.root.dialog.button_true
                });
            }

            if (USER_PASSWORD) {
                if (!component.isPassword($('input[name=USER_PASSWORD]').val())) {
                    SUCCEED = 0;
                    component.alert({
                        'TITLE': locale.root.dialog.title_error,
                        'MESSAGE': locale.root.dialog.signin_invalid_password,
                        'BUTTON_TRUE_TITLE': locale.root.dialog.button_true
                    });
                }
                app.instances.models.user.set('password', $('input[name=USER_PASSWORD]').val());
            }
            if (SUCCEED) {
                app.instances.models.user.set('name', $('input[name=USER_NAME]').val());
                app.instances.models.user.set('intro', $('textarea[name=USER_INTRO]').val());
                app.instances.models.user.save();
                app.instances.models.user.unset('password');
                component.component_window_remove();
            }
        },
        onSaveLocale: function () {
            localStorage.setItem('locale', $('select[name=USER_LANGUAGE]').val());
            localStorage.setItem('timezone', $('select[name=USER_TIMEZONE]').val());
            location.reload();
        },
        onSaveAvatar: function () {
            app.instances.models.user.set('avatar', $('#avatar_preview').attr('src'));
            app.instances.models.user.save();
            component.component_window_remove();
        },
        onSaveSystem: function () {
            var SYSTEM_NAME = $('input[name=SYSTEM_NAME]').val(),
                SUCCEED = 1;
            if (!SYSTEM_NAME) {
                SUCCEED = 0;
                component.alert({
                    'TITLE': locale.root.dialog.title_error,
                    'MESSAGE': locale.root.dialog.content_not_completed,
                    'BUTTON_TRUE_TITLE': locale.root.dialog.button_true
                });
            }
            if (SUCCEED) {
                app.instances.models.account.set('name', $('input[name=SYSTEM_NAME]').val());
                app.instances.models.account.save();
                component.component_window_remove();
            }
        },
        onSetAdministrator: function (e) {
            var USER_ID = $(e.currentTarget).parents('dd').attr('id'),
                USER_DATA = app.instances.collections.users.where({ 'id': USER_ID });
            if (USER_DATA[0].get('is_administrator') == 1) {
                component.confirm({
                    'TITLE': locale.root.dialog.title_confirm,
                    'MESSAGE': locale.root.component_window.settings.system_members_administrator_false,
                    'BUTTON_TRUE_TITLE': locale.root.dialog.button_true,
                    'BUTTON_FALSE_TITLE': locale.root.dialog.button_false,
                    'CALLBACK_TRUE': function () {
                        component.api_call('/api/users/' + USER_ID + '/administrator', 'PUT', {
                            'IS_ADMINISTRATOR': 0
                        }, function (_response) {
                            component.dialogRemove();
                        });
                    }
                });
            } else {
                component.confirm({
                    'TITLE': locale.root.dialog.title_confirm,
                    'MESSAGE': locale.root.component_window.settings.system_members_administrator_true,
                    'BUTTON_TRUE_TITLE': locale.root.dialog.button_true,
                    'BUTTON_FALSE_TITLE': locale.root.dialog.button_false,
                    'CALLBACK_TRUE': function () {
                        component.api_call('/api/users/' + USER_ID + '/administrator', 'PUT', {
                            'IS_ADMINISTRATOR': 1
                        }, function (_response) {
                            component.dialogRemove();
                        });
                    }
                });
            }
        },
        onResetPassword: function (e) {
            var USER_ID = $(e.currentTarget).parents('dd').attr('id');
            component.confirm({
                'TITLE': locale.root.dialog.title_confirm,
                'MESSAGE': locale.root.component_window.settings.system_members_resetPassword,
                'BUTTON_TRUE_TITLE': locale.root.dialog.button_true,
                'BUTTON_FALSE_TITLE': locale.root.dialog.button_false,
                'CALLBACK_TRUE': function () {
                    component.api_call('/api/users/' + USER_ID + '/password', 'PUT', {}, function (_response) {
                        component.dialogRemove();
                    });
                }
            });
        },
        onDeleteUser: function (e) {
            var USER_ID = $(e.currentTarget).parents('dd').attr('id');
            component.confirm({
                'TITLE': locale.root.dialog.title_confirm,
                'MESSAGE': locale.root.component_window.settings.system_members_delete,
                'BUTTON_TRUE_TITLE': locale.root.dialog.button_true,
                'BUTTON_FALSE_TITLE': locale.root.dialog.button_false,
                'CALLBACK_TRUE': function () {
                    component.api_call('/api/users/' + USER_ID, 'DELETE', {}, function (_response) {
                        component.dialogRemove();
                    });
                }
            });
        },
        onBlockUser: function (e) {
            var USER_ID = $(e.currentTarget).parents('dd').attr('id'),
                USER_DATA = app.instances.collections.users.where({ 'id': USER_ID });
            if (USER_DATA[0].get('time_deleted') == 0) {
                component.confirm({
                    'TITLE': locale.root.dialog.title_confirm,
                    'MESSAGE': locale.root.component_window.settings.system_members_block_true,
                    'BUTTON_TRUE_TITLE': locale.root.dialog.button_true,
                    'BUTTON_FALSE_TITLE': locale.root.dialog.button_false,
                    'CALLBACK_TRUE': function () {
                        component.api_call('/api/users/' + USER_ID + '/block', 'PUT', {
                            'IS_BLOCKED': 1
                        }, function (_response) {
                            component.dialogRemove();
                        });
                    }
                });
            } else {
                component.confirm({
                    'TITLE': locale.root.dialog.title_confirm,
                    'MESSAGE': locale.root.component_window.settings.system_members_block_false,
                    'BUTTON_TRUE_TITLE': locale.root.dialog.button_true,
                    'BUTTON_FALSE_TITLE': locale.root.dialog.button_false,
                    'CALLBACK_TRUE': function () {
                        component.api_call('/api/users/' + USER_ID + '/block', 'PUT', {
                            'IS_BLOCKED': 0
                        }, function (_response) {
                            component.dialogRemove();
                        });
                    }
                });
            }
        },
        onInviteUser: function () {
            var USER_EMAIL = $('#input_save_new_user_email').val(),
                USER_NAME = $('#input_save_new_user_name').val();
            if (!USER_EMAIL || !USER_NAME) {
                component.alert({
                    'TITLE': locale.root.dialog.title_error,
                    'MESSAGE': locale.root.dialog.content_not_completed,
                    'BUTTON_TRUE_TITLE': locale.root.dialog.button_true
                });
            } else if (!component.isEmail(USER_EMAIL)) {
                component.alert({
                    'TITLE': locale.root.dialog.title_error,
                    'MESSAGE': locale.root.dialog.signin_invalid_email,
                    'BUTTON_TRUE_TITLE': locale.root.dialog.button_true
                });
            } else {
                component.api_call('/api/users', 'POST', {
                    'USER_EMAIL': USER_EMAIL,
                    'USER_NAME': USER_NAME
                }, function (_response) {
                    component.alert({
                        'TITLE': locale.root.dialog.title_ok,
                        'MESSAGE': locale.root.dialog.invited,
                        'BUTTON_TRUE_TITLE': locale.root.dialog.button_true
                    });
                    $('#input_save_new_user_email').val('');
                    $('#input_save_new_user_name').val('');
                });
            }
        },
        render: function (_params) {
            this.template = _.template(component_windowTemplet);
            this.$el.html(this.template({
                USER_EMAIL: app.instances.models.user.get('email'),
                USER_NAME: app.instances.models.user.get('name'),
                USER_INTRO: app.instances.models.user.get('intro'),
                TIMEZONES: moment.tz.names(),
                SYSTEM_NAME: app.instances.models.account.get('name')
            }));
            $('ul.swicher li:first-child a').addClass('active');
            $('#input_save_avatar').AjaxFileUpload({
                action: '/api/upload/avatar',
                onComplete: function (filename, response) {
                    if (response.succeed) {
                        $('#avatar_preview').attr('src', response.response);
                    } else {
                        if (response.response == 'INVALID_FILE_TYPE') component.alert({
                            'TITLE': locale.root.dialog.title_error,
                            'MESSAGE': locale.root.dialog.file_invalid,
                            'BUTTON_TRUE_TITLE': locale.root.dialog.button_true
                        });
                        if (response.response == 'NO_FILE_UPLOADED') component.alert({
                            'TITLE': locale.root.dialog.title_error,
                            'MESSAGE': locale.root.dialog.file_no_uploaded,
                            'BUTTON_TRUE_TITLE': locale.root.dialog.button_true
                        });
                    }
                }
            });
            app.instances.collections.users.on('add', this.userListAdd);
            app.instances.collections.users.on('remove', this.userListRemove);
            return this;
        },
        userListAdd: function (_model) {
            $('#userList').append('<dd id="' + _model.get('id') + '"><div class="left"></div><div class="right"><a class="administrator icon-flash"></a><a class="resetPassword icon-ccw"></a><a class="block icon-minus-circled"></a><a class="delete icon-cancel"></a></div></dd>');
            $('#' + _model.get('id')).find('div.left').html('<span class="name">' + _model.get('name') + '</span><span class="email">' + _model.get('email') + '</span>');
            if (_model.get('is_administrator') == '1') $('#' + _model.get('id')).find('span.name').css('color', 'red');
            if (parseInt(_model.get('time_deleted')) > 0) $('#' + _model.get('id')).find('span.name').css('color', '#ccc');
        },
        userListRemove: function (_model) {
            $('#' + _model.get('id')).remove();
        }
    });

});