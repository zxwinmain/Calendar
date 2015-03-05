define([
    'i18n!nls/locale',
    'component',
    'text!templet/storageView.html',
    'text!templet/storageFolderItemView.html',
    'text!templet/storageFileItemView.html',
    'moment',
    'moment-timezone'
], function (locale, component, storageView, storageFolderItemView, storageFileItemView, moment) {

    app.views.storage = Backbone.View.extend({
        el: '#workspace',
        folder: '',
        parentFolder: null,
        events: {
            'click #button_home': 'onClickHome',
            'click #button_back': 'onClickBack',
            'click #button_save_folder': 'onClickCreateFolder',
            'click #button_upload': 'onClickUpload',
            'click a.folder': 'onClickFolder',
            'click a.deleteFolder': 'onClickDeleteFolder',
            'click a.deleteFile': 'onClickDeleteFile',
            'click a.renameFolder': 'onClickRenameFolder',
            'click a.renameFile': 'onClickRenameFile'
        },
        onClickHome: function () {
            this.folder = '';
            this.renderFiles();
        },
        onClickBack: function () {
            this.folder = this.parentFolder;
            this.renderFiles();
        },
        onClickCreateFolder: function () {
            if (!$('#input_folder').val()) {
                component.alert({
                    'TITLE': locale.root.dialog.title_error,
                    'MESSAGE': locale.root.dialog.content_not_completed,
                    'BUTTON_TRUE_TITLE': locale.root.dialog.button_true
                });
            } else {
                component.api_call('/api/storage/folders', 'POST', {
                    'ID_FOLDER': this.folder,
                    'BODY_NAME': $('#input_folder').val()
                }, function (_response) {
                    app.instances.views.storage.renderFiles();
                    $('#input_folder').val('');
                });
            }
        },
        onClickUpload: function () {
            $('#input_file').click();
        },
        onClickFolder: function (_event) {
            var element = $(_event.currentTarget);
            this.folder = element.parents('tr').attr('id');
            this.renderFiles();
        },
        onClickDeleteFolder: function (_event) {
            var element = $(_event.currentTarget),
                element_id = element.parents('tr').attr('id');
            component.confirm({
                'TITLE': locale.root.dialog.title_confirm,
                'MESSAGE': locale.root.component_window.common.title_delete_confirm,
                'BUTTON_TRUE_TITLE': locale.root.dialog.button_true,
                'BUTTON_FALSE_TITLE': locale.root.dialog.button_false,
                'CALLBACK_TRUE': _.bind(function () {
                    component.dialogRemove();
                    this.deleteFolder(element_id);
                    component.component_window_remove();
                }, this)
            });
        },
        onClickDeleteFile: function (_event) {
            var element = $(_event.currentTarget),
                element_id = element.parents('tr').attr('id');
            component.confirm({
                'TITLE': locale.root.dialog.title_confirm,
                'MESSAGE': locale.root.component_window.common.title_delete_confirm,
                'BUTTON_TRUE_TITLE': locale.root.dialog.button_true,
                'BUTTON_FALSE_TITLE': locale.root.dialog.button_false,
                'CALLBACK_TRUE': _.bind(function () {
                    component.dialogRemove();
                    this.deleteFile(element_id);
                    component.component_window_remove();
                }, this)
            });
        },
        onClickRenameFolder: function (_event) {
            var element = $(_event.currentTarget),
                element_id = element.parents('tr').attr('id');
            component.prompt({
                'TITLE': locale.root.dialog.storage_new_folder_name,
                'MESSAGE': element.parents('tr').find('td.name a').html(),
                'BUTTON_TRUE_TITLE': locale.root.dialog.button_true,
                'BUTTON_FALSE_TITLE': locale.root.dialog.button_false,
                'CALLBACK_TRUE': _.bind(function () {
                    this.renameFolder(element_id, $('#callback_input').val());
                    component.dialogRemove();
                    component.component_window_remove();
                }, this)
            });
        },
        onClickRenameFile: function (_event) {
            var element = $(_event.currentTarget),
                element_id = element.parents('tr').attr('id');
            component.prompt({
                'TITLE': locale.root.dialog.storage_new_file_name,
                'MESSAGE': element.parents('tr').find('td.name').html(),
                'BUTTON_TRUE_TITLE': locale.root.dialog.button_true,
                'BUTTON_FALSE_TITLE': locale.root.dialog.button_false,
                'CALLBACK_TRUE': _.bind(function () {
                    this.renameFile(element_id, $('#callback_input').val());
                    component.dialogRemove();
                    component.component_window_remove();
                }, this)
            });
        },
        renameFolder: function (_id, _name) {
            component.api_call('/api/storage/folders/' + _id, 'PUT', {
                'NAME': _name
            }, function (_response) {
                if (app.instances.views.storage) app.instances.views.storage.renderFiles();
            });
        },
        renameFile: function (_id, _name) {
            component.api_call('/api/storage/files/' + _id, 'PUT', {
                'NAME': _name
            }, function (_response) {
                if (app.instances.views.storage) app.instances.views.storage.renderFiles();
            });
        },
        deleteFolder: function (_id) {
            component.api_call('/api/storage/folders/' + _id, 'DELETE', {}, function (_response) {
                if (app.instances.views.storage) app.instances.views.storage.renderFiles();
            });
        },
        deleteFile: function (_id) {
            component.api_call('/api/storage/files/' + _id, 'DELETE', {}, function (_response) {
                if (app.instances.views.storage) app.instances.views.storage.renderFiles();
            });
        },
        renderLoading: function () {
            $('table.storageList tbody').html('').append($('#span_loading').html());
        },
        renderFiles: function () {
            this.renderLoading();
            component.api_call('/api/storage/files', 'GET', {
                'ID_FOLDER': this.folder
            }, function (_response) {
                if (app.instances.views.storage) {

                    $('table.storageList tbody').html('');

                    if (_response.response.ID_FOLDER) {
                        app.instances.views.storage.parentFolder = _response.response.ID_FOLDER;
                        $('#button_back').css('visibility', 'visible');
                    } else {
                        app.instances.views.storage.parentFolder = null;
                        $('#button_back').css('visibility', 'hidden');
                    }

                    if (!app.instances.views.storage.parentFolder && app.instances.views.storage.folder) {
                        $('#button_back').css('visibility', 'visible');
                    }

                    if (!_response.response.FOLDERS.length && !_response.response.FILES.length) $('table.storageList tbody').html('').append($('#span_null').html());
                    else {
                        var folderTemplet = _.template(storageFolderItemView),
                        fileTemplet = _.template(storageFileItemView);
                        for (var index = 0; index < _response.response.FOLDERS.length; index++) {
                            $('table.storageList tbody').append(folderTemplet({
                                'ID': _response.response.FOLDERS[index].ID,
                                'NAME': _response.response.FOLDERS[index].BODY_NAME
                            }));
                        }
                        for (var index = 0; index < _response.response.FILES.length; index++) {
                            var userItem = app.instances.collections.users.where({
                                'id': _response.response.FILES[index].ID_USER
                            });
                            var lastUpdated = moment.unix(_response.response.FILES[index].TIME_CREATED).tz(localStorage.getItem('timezone')).format('YYYY-MM-DD HH:mm:ss');
                            if (parseInt(_response.response.FILES[index].TIME_UPDATED) > 0)
                                lastUpdated = moment.unix(_response.response.FILES[index].TIME_UPDATED).tz(localStorage.getItem('timezone')).format('YYYY-MM-DD HH:mm:ss');
                            $('table.storageList tbody').append(fileTemplet({
                                'ID': _response.response.FILES[index].ID,
                                'NAME': _response.response.FILES[index].BODY_NAME,
                                'USER': userItem[0].get('name'),
                                'SIZE': component.bytes_to_size(_response.response.FILES[index].BODY_SIZE),
                                'TIME': lastUpdated
                            }));
                        }
                    }

                }
            });
        },
        render: function () {
            this.template = _.template(storageView);
            this.$el.html(this.template());
            this.renderFiles();

            $('#input_file').AjaxFileUpload({
                action: '/api/upload',
                onSubmit: function () {
                    $('#button_upload').attr('disabled', 'disabled').addClass('disabled');
                },
                onComplete: function (filename, response) {
                    $('#button_upload').removeAttr('disabled').removeClass('disabled');
                    if (response.succeed) {
                        component.api_call('/api/storage/files', 'POST', {
                            'ID_FOLDER': app.instances.views.storage.folder,
                            'FILE_NAME': filename,
                            'FILE_URL': response.response
                        }, function (_response) {
                            if (app.instances.views.storage) app.instances.views.storage.renderFiles();
                        });
                    } else {
                        if (response.response == 'INVALID_FILE_TYPE') component.alert({
                            'TITLE': locale.root.dialog.title_error,
                            'MESSAGE': locale.root.dialog.file_invalid,
                            'BUTTON_TRUE_TITLE': locale.root.dialog.button_true
                        });
                        if (response.response == 'NO_FILE_UPLOADED') component.alert({
                            'TITLE': locale.root.dialog.title_error,
                            'MESSAGE': locale.root.dialog.file_no_uploaded,
                            'BUTTON_TRUE_TITLE': locale.root.dialog.button_true
                        });
                    }
                }
            });

            return this;
        }
    });

});