define(["i18n!nls/locale","component"],function(e,t){var n=function(){},r=function(e){var t=$.parseJSON(e.data),n=t.response;o(n,function(e){switch(t.method){case"event_created":h(e);break;case"event_updated":p(e);break;case"event_deleted":d(e);break;case"user_created":a(e);break;case"user_updated":f(e);break;case"user_deleted":l(e)}})},i=function(){location.reload()},s=function(){location.reload()},o=function(e,n){e.LARGE_MESSAGE?t.api_call("callback/queue/message/"+e.LARGE_MESSAGE,"GET",null,function(e){e.response&&n(e.response)}):n(e)},u=function(e){var t="/statics/img/avatar_default.jpg";return e.BODY_AVATAR&&(t=e.BODY_AVATAR),{id:e.ID,email:e.BODY_EMAIL,name:e.BODY_NAME,avatar:t,intro:e.BODY_INTRO,is_administrator:e.IS_ADMINISTRATOR,time_created:e.TIME_CREATED,time_updated:e.TIME_UPDATED,time_deleted:e.TIME_DELETED}},a=function(e){app.instances.collections.users.add(u(e))},f=function(e){l(e),a(e)},l=function(e){var t=app.instances.collections.users.where({id:e.ID});t&&app.instances.collections.users.remove(t)},c=function(e){return{id:e.ID,id_user:e.ID_USER,name:e.BODY_NAME,start:e.BODY_START,end:e.BODY_END,intro:e.BODY_INTRO,className:e.BODY_CLASS,permission:e.BODY_PERMISSION,is_done:e.IS_DONE}},h=function(e){app.instances.collections.events&&app.instances.collections.events.add(c(e))},p=function(e){d(e),h(e)},d=function(e){if(app.instances.collections.events){var t=app.instances.collections.events.where({id:e.ID});t&&app.instances.collections.events.remove(t)}};return{onOpen:n,onMessage:r,onError:i,onClose:s}});