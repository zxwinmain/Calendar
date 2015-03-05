require.config({
    paths: {
        'jquery': 'lib/jquery',
        'underscore': 'lib/underscore',
        'backbone': 'lib/backbone',
        'text': 'lib/text',
        'i18n': 'lib/i18n',
        'moment': 'lib/moment'
    },
    locale: localStorage.getItem('locale') || 'en-us'
});

require([
    'jquery',
    'underscore',
    'backbone',
    'component',
    'view/signinView',
], function ($, _, Backbone, component, signin) {
    if (!localStorage.getItem('locale')) localStorage.setItem('locale', 'en-us');
    new app.views.signin().render();
});