define([
    'component',
    'text!templet/calendarSelectorView.html',
], function (component, calendarSelectorView) {

    app.views.calendarSelector = Backbone.View.extend({
        el: '#calendarContainer .fc-toolbar .fc-right',
        events: {
            'change #filter_user': 'onFiltUser',
            'change #filter_state': 'onFiltState'
        },
        onFiltUser: function () {
            localStorage.setItem('calendar_member', $('#filter_user').val());
            $('#calendarContainer').fullCalendar('refetchEvents');
        },
        onFiltState: function () {
            localStorage.setItem('calendar_state', $('#filter_state').val());
            $('#calendarContainer').fullCalendar('refetchEvents');
        },
        render: function () {
            this.template = _.template(calendarSelectorView);
            this.$el.html(this.template({

            }));
            return this;
        }
    });

});