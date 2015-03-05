define([
    'component',
    'text!templet/appView.html',
    'text!templet/appItemView.html',
    'model/eventModel'
], function (component, appView, appItemView) {

    app.views.app = Backbone.View.extend({
        el: '#workspace',
        events: {
            'click td.app a': 'onInit'
        },
        onInit: function (_event) {
            component.application($(_event.currentTarget).attr('data-id'));
        },
        render: function () {
            this.template = _.template(appView);
            this.$el.html(this.template());
            component.api_call('/api/apps', 'GET', null, function (_response) {
                for (var _index = 0; _index < _response.response.length; _index++) {
                    var item = _response.response[_index],
                        item_templet = _.template(appItemView);
                    $('table.appList td:eq(' + _index + ')').addClass('app').html(item_templet({
                        ITEM_ID: item.ID,
                        ITEM_ICON: item.BODY_ICON,
                        ITEM_NAME: item.BODY_NAME,
                        ITEM_DEVELOPER: item.BODY_DEVELOPER
                    }));
                }
            });
            return this;
        }
    });

});