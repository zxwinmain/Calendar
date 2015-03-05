define([
    'i18n!nls/locale',
    'component',
    'text!templet/component_headView.html',
    'model/userModel',
    'view/component_window_settingsView'
], function (locale, component, component_headView) {

    app.views.component_head = Backbone.View.extend({
        el: 'body',
        events: {
            'click #component_head ul.head a': 'windowSettingsClicked'
        },
        windowSettingsClicked: function (event) {
            if (event) event.preventDefault();
            component.component_window(null);
            new app.views.component_window_settings().render();
        },
        render: function (_activeMenu) {
            var activeMenu = function () {
                if (_activeMenu) {
                    $('#component_head ul.menu a').removeClass('active');
                    $('#component_head ul.menu a[href=#' + _activeMenu + ']').addClass('active');
                }
            };
            if (!$('#component_head').html()) {
                app.instances.models.user.unbind();
                app.instances.models.user.bind('change', this.renderHead);
                this.template = _.template(component_headView);
                this.$el.prepend(this.template({
                    USER_NAME: app.instances.models.user.get('name'),
                    USER_EMAIL: app.instances.models.user.get('email'),
                    USER_AVATAR: app.instances.models.user.get('avatar')
                }));
                activeMenu();
            }
            if (_activeMenu) activeMenu();
            return this;
        },
        renderHead: function () {
            var head = $('#component_head ul.head a');
            head.find('img').attr('src', app.instances.models.user.get('avatar'));
            head.find('strong').html(app.instances.models.user.get('name') + '<span>' + app.instances.models.user.get('email') + '</span>');
        }
    });

});