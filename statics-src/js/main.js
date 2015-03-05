require.config({
    urlArgs: 'v=1',
    waitSeconds: 0,
    paths: {
        'jquery': 'lib/jquery',
        'jquery.ajaxfileupload': 'lib/jquery.ajaxfileupload',
        'jquery.datetimepicker': 'lib/jquery.datetimepicker',
        'underscore': 'lib/underscore',
        'backbone': 'lib/backbone',
        'backbone-query': 'lib/backbone-query.min',
        'text': 'lib/text',
        'i18n': 'lib/i18n',
        'moment': 'lib/moment',
        'moment-timezone': 'lib/moment-timezone.min',
        'jstz': 'lib/jstz.min',
        'wysihtml5': 'lib/wysihtml5.min',
        'wysihtml5-config': 'lib/wysihtml5-config'
    },
    shim: {
        'backbone-query': ['jquery', 'backbone'],
        'fullcalendar': ['jquery', 'moment'],
        'jquery.ajaxfileupload': ['jquery'],
        'jquery.datetimepicker': ['jquery'],
        'moment-timezone': ['moment'],
        'jstz': ['jquery']
    },
    locale: localStorage.getItem('locale') || 'en-us'
});

require([
    'jquery',
    'underscore',
    'backbone',
    'backbone-query',
    'channel',
    'jstz',
    'component',
    'view/component_headView',
    'view/signinView',
    'view/calendarView',
    'view/reviewView',
    'view/appView',
    'view/storageView',
    'view/supportView',
    'model/accountModel',
    'model/userModel'
], function ($, _, Backbone, Backbone_Query, Channel, jsTimezoneDetect, component) {

    if (!localStorage.getItem('timezone')) localStorage.setItem('timezone', jstz.determine().name());
    if (!localStorage.getItem('locale')) localStorage.setItem('locale', 'en-us');

    Backbone.$.ajaxSetup({
        statusCode: {
            401: function () {
                location.href = '/signin';
            }
        }
    });

    if (app.channel) {
        app.channel = new sae.Channel(app.channel);
        app.channel.onopen = Channel.onOpen;
        app.channel.onmessage = Channel.onMessage;
        app.channel.onerror = Channel.onError;
        app.channel.onclose = Channel.onClose;
    }

    app.instances = {
        collections: {},
        models: {},
        views: {}
    };

    component.api_call('/api/initialization', 'GET', null, function (_response) {
        app.instances.models.account = new app.models.account(_response.response.ACCOUNT, {parse: true});
        app.instances.models.user = new app.models.user(_response.response.ME, {parse: true});
        app.instances.collections.users = new app.collections.user(_response.response.USER, {parse: true});
        var router = Backbone.Router.extend({
            routes: {
                'calendar': 'initCalendar',
                'review': 'initReview',
                'app': 'initApp',
                'app/:id': 'initAppItem',
                'storage': 'initStorage',
                'support': 'initSupport',
                'signout': 'initSignOut',
                '*actions': 'initDefault'
            },
            initController: function (_name) {
                _.each(app.instances.views, function (_view, _index) {
                    _view.undelegateEvents();
                    delete app.instances.views[_index];
                });
                this.initHeader(_name);
                app.instances.views[_name] = new app.views[_name]();
                app.instances.views[_name].render();
            },
            initDefault: function (_actions) {
                if (!_actions) {
                    Backbone.history.navigate('calendar', {
                        trigger: true
                    });
                } else top.location.href = '/error/404';
            },
            initSignOut: function () {
                Backbone.history.navigate('signin', {
                    trigger: true
                });
            },
            initHeader: function (_section) {
                app.instances.views.component_head = new app.views.component_head();
                app.instances.views.component_head.render(_section);
            },
            initCalendar: function () {
                this.initController('calendar');
            },
            initReview: function () {
                this.initController('review');
            },
            initApp: function () {
                this.initController('app');
            },
            initAppItem: function (id) {
                this.initHeader('app');
                component.application(id, null);
            },
            initStorage: function () {
                this.initController('storage');
            },
            initSupport: function () {
                this.initController('support');
            }
        });
        app.router = new router;
        Backbone.history.start();
    });

});