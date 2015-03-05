define([
    'component',
    'text!templet/supportView.html',
], function (component, supportView) {

    app.views.support = Backbone.View.extend({
        el: '#workspace',
        initialize: function () {

        },
        render: function () {
            this.template = _.template(supportView);
            this.$el.html(this.template());
            return this;
        }
    });

});