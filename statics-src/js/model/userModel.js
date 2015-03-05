define([
], function () {

    app.models.user = Backbone.Model.extend({
        url: '/api/users/me',
        defaults: {
            id: null,
            email: null,
            name: null,
            avatar: null,
            intro: '',
            is_administrator: 0
        },
        parse: function (response, options) {
            if (response.response) return this.parseObject(response.response);
            else return this.parseObject(response);
        },
        parseObject: function (response) {
            var avatar = '/statics/img/avatar_default.jpg';
            if (response.BODY_AVATAR) avatar = response.BODY_AVATAR;
            return {
                id: response.ID,
                email: response.BODY_EMAIL,
                name: response.BODY_NAME,
                avatar: avatar,
                intro: response.BODY_INTRO,
                is_administrator: response.IS_ADMINISTRATOR,
                time_created: response.TIME_CREATED,
                time_updated: response.TIME_UPDATED,
                time_deleted: response.TIME_DELETED
            };
        }
    });

    app.collections.user = Backbone.Collection.extend({
        model: app.models.user,
        url: '/api/users',
        parse: function (response, options) {
            return response;
        }
    });

});