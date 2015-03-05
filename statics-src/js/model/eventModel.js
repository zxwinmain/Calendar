define([
], function () {

    app.models.event = Backbone.Model.extend({
        url: function () {
            var root = '/api/events';
            if (this.get('id')) return root + '/' + encodeURIComponent(this.get('id'))
            else return root;
        },
        defaults: {
            id: null,
            id_user: null,
            name: null,
            intro: null,
            start: null,
            end: null,
            className: 'fc-green',
            is_done: 0
        },
        parse: function (response, options) {
            if(response.response) return this.parseObject(response.response);
            else return this.parseObject(response);
        },
        parseObject: function (response) {
            return {
                id: response.ID,
                id_user: response.ID_USER,
                name: response.BODY_NAME,
                intro: response.BODY_INTRO,
                start: response.BODY_START,
                end: response.BODY_END,
                className: response.BODY_CLASS,
                permission: response.BODY_PERMISSION,
                is_done: response.IS_DONE
            };
        }
    });

    app.collections.event = Backbone.QueryCollection.extend({
        model: app.models.event,
        url: '/api/events',
        parse: function (response, options) {
            return response.response
        }
    });

});