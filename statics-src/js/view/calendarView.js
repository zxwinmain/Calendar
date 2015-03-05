define([
    'component',
    'text!templet/calendarView.html',
    'lib/fullcalendar',
    'model/eventModel',
    'view/calendarSelectorView',
    'view/calendar_window_eventSaveView',
    'view/calendar_window_eventView'
], function (component, calendarView, fullCalendar) {

    app.views.calendar = Backbone.View.extend({
        el: '#workspace',
        initialize: function () {
            if (!app.instances.collections.events) {
                app.instances.collections.events = new app.collections.event;
            }
            app.instances.collections.events.unbind();
            app.instances.collections.events.bind('add', this.insertEvent);
            app.instances.collections.events.bind('remove', this.removeEvent);
            app.instances.collections.users.unbind('add', this.refetchEvent);
            app.instances.collections.users.bind('add', this.refetchEvent);
            if (!localStorage.getItem('calendar_member')) localStorage.setItem('calendar_member', 'all');
            if (!localStorage.getItem('calendar_state')) localStorage.setItem('calendar_state', 'all');
        },
        packEvent: function (_model) {
            var checkbox = '<input class="checkbox" type="checkbox"',
                editable = true,
                classes = new Array();
            if (!_model) _model = app.instances.collections.events.at(0);
            if (parseInt(_model.get('is_done')) == 1) {
                checkbox = checkbox + ' checked="checked"';
                classes.push('fc-done');
            }
            if (_model.get('id_user') != app.instances.models.user.get('id')) {
                checkbox = checkbox + ' disabled="disabled"';
                editable = false;
                classes.push('fc-other-user');
            }
            classes.push(_model.get('className'));
            return {
                id: _model.get('id'),
                title: checkbox + '><span>' + component.load_user_name(_model.get('id_user')) + ' ' + _model.get('name') + '</span>',
                start: moment.unix(_model.get('start')).format('YYYY-MM-DD'),
                end: moment.unix(parseInt(_model.get('end')) + 86400).format('YYYY-MM-DD'),
                className: classes,
                allDay: true,
                is_done: _model.get('is_done'),
                editable: editable
            };
        },
        insertEvent: function (_model) {
            $('#calendarContainer').fullCalendar('renderEvent', app.instances.views.calendar.packEvent(_model));
        },
        refetchEvent: function () {
            $('#calendarContainer').fullCalendar('refetchEvents');
        },
        removeEvent: function (_model) {
            $('#calendarContainer').fullCalendar('removeEvents', _model.get('id'));
        },
        render: function () {
            this.template = _.template(calendarView);
            $(this.el).html(this.template());
            var lang = localStorage.getItem('locale') || 'en-us';
            if (lang != 'en-us') require(['lib/fullcalendar-lang/' + lang], this.calendarRender);
            else this.calendarRender();
            return this;
        },
        calendarRender: function () {
            var currentTimezone = false;
            if (localStorage.getItem('timezone')) currentTimezone = localStorage.getItem('timezone');
            $('#calendarContainer').fullCalendar({
                lang: localStorage.getItem('locale') || 'en-us',
                timezone: currentTimezone,
                fixedWeekCount: false,
                editable: true,
                header: {
                    left: 'prev,next title',
                    right: ''
                },
                loading: function (isLoading, view) {
                    if (isLoading) $('.fc-view-container').append('<div class="calendarLoading"></div>');
                    else $('.calendarLoading').remove();
                },
                eventRender: function (event, element) {
                    if (parseInt(event.is_done) == 1) element.find('span.fc-title').addClass('completed');
                    element.find('span.fc-title').html(element.find('span.fc-title').text());
                },
                dayClick: function (date, jsEvent, view) {
                    component.component_window(null);
                    new app.views.calendar_window_eventSave().render(date.format('YYYY-MM-DD'));
                },
                eventClick: function (calEvent, jsEvent, view) {
                    var data = app.instances.collections.events.query({
                        id: calEvent.id
                    }),
                        data_user = data[0].get('id_user'),
                        targetElement = $(jsEvent.target);
                    if (jsEvent.target.className == 'checkbox') {
                        targetElement.attr('disabled', 'disabled');
                        if (targetElement.is(':checked')) {
                            component.api_call('/api/events/' + calEvent.id + '/status', 'PUT', {
                                'IS_DONE': 1
                            }, function (_response) {
                                data[0].set('is_done', 1);
                            });
                            targetElement.parents('.fc-title').removeClass('completed').addClass('completed');
                        } else {
                            component.api_call('/api/events/' + calEvent.id + '/status', 'PUT', {
                                'IS_DONE': 0
                            }, function (_response) {
                                data[0].set('is_done', 0);
                            });
                            targetElement.parents('.fc-title').removeClass('completed');
                        }
                    } else {
                        if (data_user == app.instances.models.user.get('id')) {
                            component.component_window(null);
                            new app.views.calendar_window_eventSave(data[0]).render();
                        } else {
                            component.component_window(null);
                            new app.views.calendar_window_event(data[0]).render();
                        }
                    }
                },
                events: function (start, end, timezone, callback) {
                    var calendarView = $('#calendarContainer').fullCalendar('getView');
                    if (app.instances.collections.events.fechXhr
                    && app.instances.collections.events.fechXhr.readyState > 0
                    && app.instances.collections.events.fechXhr.readyState < 4) app.instances.collections.events.fechXhr.abort();
                    app.instances.collections.events.fechXhr = app.instances.collections.events.fetch({
                        reset: true,
                        data: {
                            start: calendarView.start.unix(),
                            end: calendarView.end.unix(),
                            member: localStorage.getItem('calendar_member'),
                            state: localStorage.getItem('calendar_state')
                        },
                        success: function () {
                            if (app.instances.views.calendar) {
                                var events = [],
                                    data = app.instances.collections.events.query({
                                        $or: {
                                            'start': {
                                                $between: [start.unix(), end.unix()]
                                            },
                                            'end': {
                                                $lte: end.unix()
                                            }
                                        }
                                    });
                                _.each(data, function (item) {
                                    events.push(app.instances.views.calendar.packEvent(item));
                                });
                                callback(events);
                            }
                        }
                    });
                },
                eventDrop: function (event, delta, revertFunc) {
                    var data = app.instances.collections.events.query({
                        id: event.id
                    });
                    data[0].set('start', event.start.unix());
                    data[0].set('end', parseInt(event.end.unix()) - 86400);
                    data[0].save();
                },
                eventResize: function (event, delta, revertFunc) {
                    var data = app.instances.collections.events.query({
                        id: event.id
                    });
                    data[0].set('start', event.start.unix());
                    data[0].set('end', parseInt(event.end.unix()) - 86400);
                    data[0].save();
                }
            });
            new app.views.calendarSelector().render();
        }
    });

});