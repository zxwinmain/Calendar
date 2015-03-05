define([
    'text!templet/calendar_window_event.html',
    'moment',
    'moment-timezone'
], function (component_windowTemplet, moment) {

    app.views.calendar_window_event = Backbone.View.extend({
        el: '#component_window_wrapper',
        model: null,
        initialize: function (_model) {
            if (_model) this.model = _model;
        },
        render: function (_calendarDate) {
            this.template = _.template(component_windowTemplet);
            this.$el.html(this.template({
                EVENT_NAME: this.model.get('name'),
                EVENT_START: moment.unix(this.model.get('start')).format('YYYY-MM-DD'),
                EVENT_END: moment.unix(this.model.get('end')).format('YYYY-MM-DD'),
                EVENT_INTRO: this.model.get('intro'),
                EVENT_CLASS: this.model.get('className'),
                EVENT_OWNER: this.model.get('id_user')
            }));
            return this;
        }
    });

});