define([
    'i18n!nls/locale',
    'component',
    'text!templet/signinView.html'
], function (locale, component, signinView) {

    app.views.signin = Backbone.View.extend({
        el: '#workspace',
        initialize: function () {
            $('#component_head').remove();
            $('#component_window').remove();
            if (component.load_requested_param('locale')) {
                if (localStorage.getItem('locale') != component.load_requested_param('locale')) {
                    localStorage.setItem('locale', component.load_requested_param('locale'));
                    location.reload();
                }
            }
        },
        events: {
            'keyup input[name=USER_PASSWORD]': 'onKeyPressed',
            'click #signin_button': 'onSigninClicked'
        },
        onKeyPressed: function (event) {
            if (event.keyCode == 13) {
                this.$('#signin_button').click();
            }
        },
        onSigninClicked: function (event) {

            if (event) event.preventDefault();

            var USER_EMAIL = $('input[name=USER_EMAIL]').val(),
                USER_PASSWORD = $('input[name=USER_PASSWORD]').val(),
                SUCCEED = 1;

            if (!USER_EMAIL || !USER_PASSWORD) {
                SUCCEED = 0;
                component.alert({
                    'TITLE': locale.root.dialog.title_error,
                    'MESSAGE': locale.root.dialog.signin_required,
                    'BUTTON_TRUE_TITLE': locale.root.dialog.button_true
                });
            } else if (!component.isEmail(USER_EMAIL)) {
                SUCCEED = 0;
                component.alert({
                    'TITLE': locale.root.dialog.title_error,
                    'MESSAGE': locale.root.dialog.signin_invalid_email,
                    'BUTTON_TRUE_TITLE': locale.root.dialog.button_true
                });
            } else if (!component.isPassword(USER_PASSWORD)) {
                SUCCEED = 0;
                component.alert({
                    'TITLE': locale.root.dialog.title_error,
                    'MESSAGE': locale.root.dialog.signin_invalid_password,
                    'BUTTON_TRUE_TITLE': locale.root.dialog.button_true
                });
            }

            if (SUCCEED) $('form').submit();

        },
        render: function () {
            this.template = _.template(signinView);
            this.$el.html(this.template());
            if (window.appError) {
                if (window.appError == 'WRONG_USER_OR_PASSWORD') {
                    component.alert({
                        'TITLE': locale.root.dialog.title_error,
                        'MESSAGE': locale.root.dialog.signin_wrong_user_or_password,
                        'BUTTON_TRUE_TITLE': locale.root.dialog.button_true
                    });
                } else if (window.appError == 'WRONG_ACCOUNT') {
                    component.alert({
                        'TITLE': locale.root.dialog.title_error,
                        'MESSAGE': locale.root.dialog.signin_wrong_account,
                        'BUTTON_TRUE_TITLE': locale.root.dialog.button_true
                    });
                }
            }
            return this;
        }
    });

});