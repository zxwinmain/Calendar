define([],function(){app.models.event=Backbone.Model.extend({url:function(){var e="/api/events";return this.get("id")?e+"/"+encodeURIComponent(this.get("id")):e},defaults:{id:null,id_user:null,name:null,intro:null,start:null,end:null,className:"fc-green",is_done:0},parse:function(e,t){return e.response?this.parseObject(e.response):this.parseObject(e)},parseObject:function(e){return{id:e.ID,id_user:e.ID_USER,name:e.BODY_NAME,intro:e.BODY_INTRO,start:e.BODY_START,end:e.BODY_END,className:e.BODY_CLASS,permission:e.BODY_PERMISSION,is_done:e.IS_DONE}}}),app.collections.event=Backbone.QueryCollection.extend({model:app.models.event,url:"/api/events",parse:function(e,t){return e.response}})});