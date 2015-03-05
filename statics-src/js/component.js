define([
    'i18n!nls/locale',
    'view/component_windowView',
    'text!templet/component_dialogView.html',
    'text!templet/component_promptView.html',
    'text!templet/appContainerView.html'
], function (locale, component_windowView, component_dialogView, component_promptView, appContainerView) {

    // AJAX
    var api_call = function (_method, _type, _params, _callback) {
        $.ajax({
            dataType: 'json',
            type: _type, url: _method + '?request_type=json&' + (new Date()).valueOf(), data: _params,
            success: function (_message) {
                if (_message) {
                    api_required(_message, function () {
                        if (_callback) _callback(_message);
                    });
                }
            },
            error: function (_message) {
                component_alert({
                    'TITLE': locale.root.dialog.title_error,
                    'MESSAGE': locale.root.dialog.network_broken,
                    'BUTTON_TRUE_TITLE': locale.root.dialog.button_true
                });
            }
        });
    };
    var api_required = function (_message, _callback) {
        if (_message.succeed) _callback();
        else {
            if (_message.response.message == 'INVALID_TOKEN') {
                component_alert({
                    'TITLE': locale.root.dialog.title_error,
                    'MESSAGE': locale.root.dialog.signin_invalid_password,
                    'BUTTON_TRUE_TITLE': locale.root.dialog.button_true
                });
            } else if (_message.response.message == 'EMAIL_EXISTS') {
                component_alert({
                    'TITLE': locale.root.dialog.title_error,
                    'MESSAGE': locale.root.dialog.invite_invalid_email,
                    'BUTTON_TRUE_TITLE': locale.root.dialog.button_true
                });
            } else if (_message.response.message == 'FOLDER_EXISTS') {
                component_alert({
                    'TITLE': locale.root.dialog.title_error,
                    'MESSAGE': locale.root.dialog.storage_invalid_folder,
                    'BUTTON_TRUE_TITLE': locale.root.dialog.button_true
                });
            } else if (_message.response.message == 'FOLDER_NOT_EMPTY') {
                component_alert({
                    'TITLE': locale.root.dialog.title_error,
                    'MESSAGE': locale.root.dialog.storage_folder_not_empty,
                    'BUTTON_TRUE_TITLE': locale.root.dialog.button_true
                });
            } else if (_message.response.message == 'APP_INVALID') {
                Backbone.history.navigate('app', {
                    trigger: true
                });
            }
        }
    }

    // COMPONENT_DIALOG
    // Use for Alert or Confirm

    var component_dialog = function (_type, _params) {

        $('#component_dialog').remove();

        var settings = {
            TYPE: _type,
            TITLE: 'TITLE',
            MESSAGE: 'MESSAGE',
            BUTTON_TRUE_TITLE: 'Ok',
            BUTTON_FALSE_TITLE: 'Cancel'
        };

        if (_params.TITLE) settings.TITLE = _params.TITLE;
        if (_params.MESSAGE) settings.MESSAGE = _params.MESSAGE;
        if (_params.BUTTON_TRUE_TITLE) settings.BUTTON_TRUE_TITLE = _params.BUTTON_TRUE_TITLE;
        if (_params.BUTTON_FALSE_TITLE) settings.BUTTON_FALSE_TITLE = _params.BUTTON_FALSE_TITLE;

        if (settings.TYPE == 'PROMPT') $('body').append(_.template(component_promptView)(settings));
        else $('body').append(_.template(component_dialogView)(settings));

        $('#component_dialog').fadeIn(100, function () {
            $('#component_dialog').on('click', '#component_dialog_true', function () {
                if (_params.CALLBACK_TRUE) _params.CALLBACK_TRUE();
                else component_dialogRemove();
                $('#component_dialog #component_dialog_true').focus();
            });
            $('#component_dialog').on('click', '#component_dialog_false', function () {
                if (_params.CALLBACK_FALSE) _params.CALLBACK_FALSE();
                else component_dialogRemove();
                $('#component_dialog #component_dialog_false').focus();
            });
        });

    };
    var component_dialogRemove = function () {
        $('#component_dialog').fadeOut(100, function () {
            $(this).remove();
        });
    };
    var component_alert = function (_params) {
        component_dialog('ALERT', _params);
    };
    var component_confirm = function (_params) {
        component_dialog('CONFIRM', _params);
    };
    var component_prompt = function (_params) {
        component_dialog('PROMPT', _params);
    };

    // COMPONENT_WINDOW
    var component_window = function (_params, _callback) {
        $('body').append(new app.views.component_window(component_window_remove).render(_params).el);
        if (_callback) _callback();
    };
    var component_window_tab = function (_element) {
        var link = $(_element.currentTarget);
        if (link.attr('data-tab') == 'signout') {
            location.href = '/signout';
        } else {
            $('#component_window_inner .component_window_inner_tab').hide();
            $('#component_window_inner .component_window_inner_tab[data-tab=' + link.attr('data-tab') + ']').show();
            $('ul.swicher a').removeClass('active');
            link.addClass('active');
        }
    };
    var component_window_remove = function (_callback) {
        $('input[data-mark=dateTimePicker]').each(function () {
            $(this).datetimepicker('destroy');
        });
        $('body > div.xdsoft_datetimepicker').remove();
        $('#component_window').parent().remove();
        if (_callback) $(document).unbind('keydown', _callback);
    };

    // COMPONENT_APPLICATIONS
    var component_application = function (_id) {
        component_application_url(_id, function (_response) {
            Backbone.history.navigate('app/' + _id);
            $('#workspace').html(_.template(appContainerView)({
                'URL': _response.URL + '?token=' + _response.TOKEN
            }));
        });
    };
    var component_application_url = function (_id, _callback) {
        api_call('/api/apps/' + _id, 'GET', null, function (_response) {
            _callback({
                'URL': _response.response.BODY_URL,
                'TOKEN': _response.response.USER_TOKEN
            });
        });
    };

    var load_user_name = function (_id) {
        var data = app.instances.collections.users.where({ 'id': _id });
        return data[0].get('name');
    };
    var load_requested_param = function (_name) { 
        var args = new Object(), query = location.search.substring(1), pairs = query.split('&');
        for(var i = 0; i < pairs.length; i++) { 
            var pos = pairs[i].indexOf('='); 
            if (pos == -1) continue; 
            var argname = pairs[i].substring(0,pos), value = pairs[i].substring(pos+1); 
            args[argname] = decodeURIComponent(value); 
        } 
        return args[_name]; 
    };
    var isEmail = function (_string) {
        return /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/.test(_string);
    };
    var isPassword = function (_string) {
        return /(?!^\\d+$)(?!^[a-zA-Z]+$)(?!^[_#@]+$).{8,}/.test(_string);
    };
    var bytes_to_size = function (_bytes) {
        if (_bytes === 0) return '0 B';
        var k = 1024, sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
            i = Math.floor(Math.log(_bytes) / Math.log(k));
        return (_bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
    };

    return {

        api_call: api_call,

        dialog: component_dialog,
        dialogRemove: component_dialogRemove,
        alert: component_alert,
        confirm: component_confirm,
        prompt: component_prompt,
        isEmail: isEmail,
        isPassword: isPassword,
        load_user_name: load_user_name,
        load_requested_param: load_requested_param,
        bytes_to_size: bytes_to_size,

        component_window: component_window,
        component_window_tab: component_window_tab,
        component_window_remove: component_window_remove,

        application: component_application

    }

});