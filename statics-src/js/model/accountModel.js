define([
], function () {

    app.models.account = Backbone.Model.extend({
        url: '/api/account',
        parse: function (response, options) {
            if (response.response) return this.parseObject(response.response);
            else return this.parseObject(response);
        },
        parseObject: function (response) {
            return {
                id: response.ID,
                name: response.BODY_NAME,
                time_created: response.TIME_CREATED,
                time_updated: response.TIME_UPDATED,
                time_deleted: response.TIME_DELETED
            };
        }
    });

});