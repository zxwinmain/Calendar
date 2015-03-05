define([
    'i18n!nls/locale',
    'component'
], function (locale, component) {

    var onOpen = function () {
    };

    var onMessage = function (_response) {
        var message = $.parseJSON(_response.data), response = message.response;
        message_package(response, function (_response_packed) {
            switch (message.method) {
                case 'event_created':
                    event_created(_response_packed);
                    break;
                case 'event_updated':
                    event_updated(_response_packed);
                    break;
                case 'event_deleted':
                    event_deleted(_response_packed);
                    break;
                case 'user_created':
                    user_created(_response_packed);
                    break;
                case 'user_updated':
                    user_updated(_response_packed);
                    break;
                case 'user_deleted':
                    user_deleted(_response_packed);
                    break;
            }
        });
    };

    var onError = function () {
        location.reload();
    };

    var onClose = function () {
        location.reload();
    };

    // LARGE MESSAGES
    var message_package = function (_response, _callback) {
        if (_response.LARGE_MESSAGE) {
            component.api_call('callback/queue/message/' + _response.LARGE_MESSAGE, 'GET', null, function (_largeMessage) {
                if (_largeMessage.response) _callback(_largeMessage.response);
            });
        } else _callback(_response);
    };

    // USERS
    var user_package = function (_response) {
        var avatar = '/statics/img/avatar_default.jpg';
        if (_response.BODY_AVATAR) avatar = _response.BODY_AVATAR;
        return {
            id: _response.ID,
            email: _response.BODY_EMAIL,
            name: _response.BODY_NAME,
            avatar: avatar,
            intro: _response.BODY_INTRO,
            is_administrator: _response.IS_ADMINISTRATOR,
            time_created: _response.TIME_CREATED,
            time_updated: _response.TIME_UPDATED,
            time_deleted: _response.TIME_DELETED
        };
    };
    var user_created = function (_response) {
        app.instances.collections.users.add(user_package(_response));
    };
    var user_updated = function (_response) {
        user_deleted(_response);
        user_created(_response);
    };
    var user_deleted = function (_response) {
        var target = app.instances.collections.users.where({ 'id': _response.ID });
        if (target) app.instances.collections.users.remove(target);
    };

    // EVENTS
    var event_package = function (_response) {
        return {
            id: _response.ID,
            id_user: _response.ID_USER,
            name: _response.BODY_NAME,
            start: _response.BODY_START,
            end: _response.BODY_END,
            intro: _response.BODY_INTRO,
            className: _response.BODY_CLASS,
            permission: _response.BODY_PERMISSION,
            is_done: _response.IS_DONE
        };
    };
    var event_created = function (_response) {
        if (app.instances.collections.events)
            app.instances.collections.events.add(event_package(_response));
    };
    var event_updated = function (_response) {
        event_deleted(_response);
        event_created(_response);
    };
    var event_deleted = function (_response) {
        if (app.instances.collections.events) {
            var target = app.instances.collections.events.where({ 'id': _response.ID });
            if (target) app.instances.collections.events.remove(target);
        }
    };

    return {
        'onOpen': onOpen,
        'onMessage': onMessage,
        'onError': onError,
        'onClose': onClose
    }

});