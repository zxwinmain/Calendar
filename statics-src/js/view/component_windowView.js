define([
    'text!templet/component_windowView.html'
], function (component_windowTemplet) {

    app.views.component_window = Backbone.View.extend({
        removeFunction: null,
        initialize: function (_removeFunction) {
            _.bindAll(this, 'onKeyDown');
            this.removeFunction = _removeFunction;
            _removeFunction();
            $(document).bind('keydown', this.onKeyDown);
        },
        events: {
            'click a.window_cancel': 'onCancel'
        },
        onKeyDown: function (_event) {
            var code = _event.keyCode || _event.which;
            if (code == 27) this.removeFunction(this.onKeyDown);
        },
        onCancel: function () {
            this.removeFunction(this.onKeyDown);
        },
        render: function (_params) {
            this.template = _.template(component_windowTemplet);
            this.$el.html(this.template({
                CONTENT: _params
            }));
            return this;
        }
    });

});