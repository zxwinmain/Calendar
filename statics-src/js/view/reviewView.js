define([
    'component',
    'text!templet/reviewView.html',
    'text!templet/reviewContentView.html',
    'view/calendar_window_eventSaveView',
    'view/calendar_window_eventView'
], function (component, reviewView, reviewContentView) {

    app.views.review = Backbone.View.extend({
        el: '#workspace',
        events: {
            'click dl a.fc-event': 'onClickEvent'
        },
        onClickEvent: function (_event) {
            var element = $(_event.currentTarget).parents('span.relation'),
                element_json = JSON.parse(decodeURIComponent(element.attr('data-body'))),
                element_model = new app.models.event({
                    id: element_json.ID,
                    id_user: element_json.ID_USER,
                    name: element_json.BODY_NAME,
                    start: element_json.BODY_START,
                    end: element_json.BODY_END,
                    intro: element_json.BODY_INTRO,
                    className: element_json.BODY_CLASS,
                    permission: element_json.BODY_PERMISSION,
                    is_done: element_json.IS_DONE
                });
            if (element_json.ID_USER == app.instances.models.user.get('id')) {
                component.component_window(null);
                new app.views.calendar_window_eventSave(element_model).render();
            } else {
                component.component_window(null);
                new app.views.calendar_window_event(element_model).render();
            }
        },
        renderLoading: function () {
            $('.mainContainer_body').html($('#span_loading').html());
        },
        renderLogs: function (_currentDateTime) {
            app.instances.views.review.renderLoading();
            var requestDate = moment(moment(_currentDateTime).format('YYYY-MM-DD')).unix(),
                reviewContentTemplate = _.template(reviewContentView);
            $('.mainContainer_head').html(moment(_currentDateTime).format('YYYY-MM-DD'));
            if (app.instances.views.review.fechXhr
            && app.instances.views.review.fechXhr.readyState > 0
            && app.instances.views.review.fechXhr.readyState < 4) app.instances.views.review.fechXhr.abort();
            app.instances.views.review.fechXhr = component.api_call('/api/records', 'GET', {
                'TIMESTAMP': requestDate
            }, function (_response) {
                if (app.instances.views.review) { 
                    if (!_response.response.length) $('.mainContainer_body').html($('#span_null').html());
                    else $('.mainContainer_body').html(reviewContentTemplate({
                        list: _response.response
                    }));
                }
            });
        },
        render: function () {
            this.template = _.template(reviewView);
            this.$el.html(this.template());
            var dateTimeLang = 'en';
            if (localStorage.getItem('locale') == 'zh-cn') dateTimeLang = 'ch';
            $('#dateSelector').datetimepicker({
                inline: true,
                lang: dateTimeLang,
                timepicker: false,
                format: 'Y-m-d',
                onGenerate: this.renderLogs
            });
            return this;
        }
    });

});