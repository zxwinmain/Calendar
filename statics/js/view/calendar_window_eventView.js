define(["text!templet/calendar_window_event.html","moment","moment-timezone"],function(e,t){app.views.calendar_window_event=Backbone.View.extend({el:"#component_window_wrapper",model:null,initialize:function(e){e&&(this.model=e)},render:function(n){return this.template=_.template(e),this.$el.html(this.template({EVENT_NAME:this.model.get("name"),EVENT_START:t.unix(this.model.get("start")).format("YYYY-MM-DD"),EVENT_END:t.unix(this.model.get("end")).format("YYYY-MM-DD"),EVENT_INTRO:this.model.get("intro"),EVENT_CLASS:this.model.get("className"),EVENT_OWNER:this.model.get("id_user")})),this}})});