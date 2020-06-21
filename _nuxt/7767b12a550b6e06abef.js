(window.webpackJsonp=window.webpackJsonp||[]).push([[38],{343:function(e,t,n){"use strict";n.r(t);n(40),n(120),n(34);var c=n(7),l=n(21),r=n(118),o=n(22),d=n(23),h=n(9),m=(n(19),n(20),n(13),n(8)),v=n(55);function f(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,c=Object(h.a)(e);if(t){var l=Object(h.a)(this).constructor;n=Reflect.construct(c,arguments,l)}else n=c.apply(this,arguments);return Object(d.a)(this,n)}}var y=function(e,t,n,desc){var c,l=arguments.length,r=l<3?t:null===desc?desc=Object.getOwnPropertyDescriptor(t,n):desc;if("object"===("undefined"==typeof Reflect?"undefined":Object(m.a)(Reflect))&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,n,desc);else for(var i=e.length-1;i>=0;i--)(c=e[i])&&(r=(l<3?c(r):l>3?c(t,n,r):c(t,n))||r);return l>3&&r&&Object.defineProperty(t,n,r),r},D=new(n(269).a.Tour)({defaultStepOptions:{classes:"shadow-md bg-purple-dark",scrollTo:!0}});D.addStep({text:"Which days do you want your assistant to schedule meetings on?",attachTo:{element:".card .field:nth-child(1)",on:"left"},buttons:[{text:"Next",action:D.next}]}),D.addStep({text:"If you use a calendar service, you can add a calendar URL here (<a href='#' target='_blank'>Learn how to find your URL</a>)",attachTo:{element:".card .field:nth-child(5)",on:"left"},buttons:[{text:"Next",action:D.next}]}),D.addStep({text:"Save your settings and click on How to use to continue",attachTo:{element:"[data-label='How to use']",on:"left"}});var T=function(time){return time>9?time.toString():"0".concat(time)},k=function(e){Object(o.a)(v,e);var t,n,d,h,m=f(v);function v(){var e;return Object(l.a)(this,v),(e=m.apply(this,arguments)).schedulingDays=[],e.schedulingTimeStart=new Date,e.schedulingTimeEnd=new Date,e.loading=!1,e.loadingSave=!1,e.team={},e}return Object(r.a)(v,[{key:"created",value:(h=Object(c.a)(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return this.schedulingTimeStart.setHours(9),this.schedulingTimeStart.setMinutes(30),this.schedulingTimeEnd.setHours(17),this.schedulingTimeEnd.setMinutes(0),e.abrupt("return",this.get());case 5:case"end":return e.stop()}}),e,this)}))),function(){return h.apply(this,arguments)})},{key:"mounted",value:(d=Object(c.a)(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:localStorage.getItem("tour-finished")||D.start();case 1:case"end":return e.stop()}}),e)}))),function(){return d.apply(this,arguments)})},{key:"beforeDestroy",value:function(){D.complete()}},{key:"get",value:(n=Object(c.a)(regeneratorRuntime.mark((function e(){var t,data;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return this.loading=!0,e.prev=1,e.next=4,this.$axios.get("/organizations/".concat(this.$route.params.username));case 4:t=e.sent,data=t.data,this.team=data,this.schedulingDays=data.schedulingDays.split(",").map((function(i){return i.trim()})),this.schedulingTimeStart=new Date,this.schedulingTimeStart.setHours(data.schedulingTimeStart.split(":")[0]),this.schedulingTimeStart.setMinutes(data.schedulingTimeStart.split(":")[1]),this.schedulingTimeEnd=new Date,this.schedulingTimeEnd.setHours(data.schedulingTimeEnd.split(":")[0]),this.schedulingTimeEnd.setMinutes(data.schedulingTimeEnd.split(":")[1]),e.next=18;break;case 16:e.prev=16,e.t0=e.catch(1);case 18:this.loading=!1;case 19:case"end":return e.stop()}}),e,this,[[1,16]])}))),function(){return n.apply(this,arguments)})},{key:"save",value:(t=Object(c.a)(regeneratorRuntime.mark((function e(){var t,n,data;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return this.loadingSave=!0,e.prev=1,e.next=4,this.$axios.patch("/organizations/".concat(this.$route.params.username),{schedulingDays:this.schedulingDays.join(","),schedulingTimeStart:"".concat(T(this.schedulingTimeStart.getHours()),":").concat(T(this.schedulingTimeStart.getMinutes()),":00"),schedulingTimeEnd:"".concat(T(this.schedulingTimeEnd.getHours()),":").concat(T(this.schedulingTimeEnd.getMinutes()),":00"),schedulingPadding:this.team.schedulingPadding,customCalendarUrl:null!==(t=this.team.customCalendarUrl)&&void 0!==t?t:"",schedulingDuration:this.team.schedulingDuration,schedulingType:this.team.schedulingType});case 4:n=e.sent,data=n.data,this.team=data.updated,e.next=11;break;case 9:e.prev=9,e.t0=e.catch(1);case 11:this.loadingSave=!1;case 12:case"end":return e.stop()}}),e,this,[[1,9]])}))),function(){return t.apply(this,arguments)})}]),v}(v.b),x=k=y([Object(v.a)({middleware:"authenticated",layout:"teams"})],k),_=n(14),component=Object(_.a)(x,(function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",[n("h1",{staticClass:"is-size-4"},[e._v("Scheduling settings")]),e._v(" "),n("form",{staticStyle:{"margin-top":"1rem"},on:{submit:function(t){return t.preventDefault(),e.save(t)}}},[n("b-field",{attrs:{label:"Scheduling days"}},[n("div",{staticClass:"block"},[n("b-checkbox",{attrs:{"native-value":"1"},model:{value:e.schedulingDays,callback:function(t){e.schedulingDays=t},expression:"schedulingDays"}},[e._v("\n          Mon\n        ")]),e._v(" "),n("b-checkbox",{attrs:{"native-value":"2"},model:{value:e.schedulingDays,callback:function(t){e.schedulingDays=t},expression:"schedulingDays"}},[e._v("\n          Tue\n        ")]),e._v(" "),n("b-checkbox",{attrs:{"native-value":"3"},model:{value:e.schedulingDays,callback:function(t){e.schedulingDays=t},expression:"schedulingDays"}},[e._v("\n          Wed\n        ")]),e._v(" "),n("b-checkbox",{attrs:{"native-value":"4"},model:{value:e.schedulingDays,callback:function(t){e.schedulingDays=t},expression:"schedulingDays"}},[e._v("\n          Thu\n        ")]),e._v(" "),n("b-checkbox",{attrs:{"native-value":"5"},model:{value:e.schedulingDays,callback:function(t){e.schedulingDays=t},expression:"schedulingDays"}},[e._v("\n          Fri\n        ")]),e._v(" "),n("b-checkbox",{attrs:{"native-value":"6"},model:{value:e.schedulingDays,callback:function(t){e.schedulingDays=t},expression:"schedulingDays"}},[e._v("\n          Sat\n        ")]),e._v(" "),n("b-checkbox",{attrs:{"native-value":"0"},model:{value:e.schedulingDays,callback:function(t){e.schedulingDays=t},expression:"schedulingDays"}},[e._v("\n          Sun\n        ")])],1)]),e._v(" "),n("div",{staticClass:"columns"},[n("b-field",{staticClass:"column",staticStyle:{"margin-bottom":"0"},attrs:{label:"Scheduling start time"}},[n("b-timepicker",{attrs:{placeholder:"Click to select...",icon:"clock","hour-format":"12",incrementMinutes:15,inline:""},model:{value:e.schedulingTimeStart,callback:function(t){e.schedulingTimeStart=t},expression:"schedulingTimeStart"}})],1),e._v(" "),n("b-field",{staticClass:"column",staticStyle:{"margin-bottom":"0"},attrs:{label:"Scheduling end time"}},[n("b-timepicker",{attrs:{placeholder:"Click to select...",icon:"clock","hour-format":"12",incrementMinutes:15,inline:""},model:{value:e.schedulingTimeEnd,callback:function(t){e.schedulingTimeEnd=t},expression:"schedulingTimeEnd"}})],1)],1),e._v(" "),n("b-field",{attrs:{label:"Slot padding",message:"Time to leave between meetings in minutes"}},[n("b-input",{attrs:{type:"text",required:""},model:{value:e.team.schedulingPadding,callback:function(t){e.$set(e.team,"schedulingPadding",t)},expression:"team.schedulingPadding"}})],1),e._v(" "),n("h2",{staticClass:"is-size-5",staticStyle:{margin:"1rem 0"}},[e._v("\n      Calendar connection\n    ")]),e._v(" "),n("b-field",{attrs:{label:"Custom calendar URL"}},[n("b-input",{attrs:{type:"text"},model:{value:e.team.customCalendarUrl,callback:function(t){e.$set(e.team,"customCalendarUrl",t)},expression:"team.customCalendarUrl"}})],1),e._v(" "),n("h2",{staticClass:"is-size-5",staticStyle:{margin:"1rem 0"}},[e._v("\n      Default appointment details\n    ")]),e._v(" "),n("b-field",{attrs:{label:"Meeting duration"}},[n("div",{staticClass:"block"},[n("b-radio",{attrs:{name:"schedulingDuration","native-value":15},model:{value:e.team.schedulingDuration,callback:function(t){e.$set(e.team,"schedulingDuration",t)},expression:"team.schedulingDuration"}},[e._v("\n          15 minutes\n        ")]),e._v(" "),n("b-radio",{attrs:{name:"schedulingDuration","native-value":30},model:{value:e.team.schedulingDuration,callback:function(t){e.$set(e.team,"schedulingDuration",t)},expression:"team.schedulingDuration"}},[e._v("\n          30 minutes\n        ")]),e._v(" "),n("b-radio",{attrs:{name:"schedulingDuration","native-value":60},model:{value:e.team.schedulingDuration,callback:function(t){e.$set(e.team,"schedulingDuration",t)},expression:"team.schedulingDuration"}},[e._v("\n          1 hour\n        ")])],1)]),e._v(" "),n("b-field",{attrs:{label:"Meeting type"}},[n("div",{staticClass:"block"},[n("b-radio",{attrs:{name:"schedulingType","native-value":"VIDEO_CALL"},model:{value:e.team.schedulingType,callback:function(t){e.$set(e.team,"schedulingType",t)},expression:"team.schedulingType"}},[e._v("\n          Video call\n        ")]),e._v(" "),n("b-radio",{attrs:{name:"schedulingType","native-value":"PHONE_CALL"},model:{value:e.team.schedulingType,callback:function(t){e.$set(e.team,"schedulingType",t)},expression:"team.schedulingType"}},[e._v("\n          Phone call\n        ")]),e._v(" "),n("b-radio",{attrs:{name:"schedulingType","native-value":"IN_PERSON"},model:{value:e.team.schedulingType,callback:function(t){e.$set(e.team,"schedulingType",t)},expression:"team.schedulingType"}},[e._v("\n          In-person meeting\n        ")])],1)]),e._v(" "),n("div",[n("b-button",{attrs:{type:"is-primary","native-type":"submit",loading:e.loadingSave}},[e._v("\n        Update scheduling settings\n      ")])],1),e._v(" "),n("b-loading",{attrs:{"is-full-page":!1,active:e.loading},on:{"update:active":function(t){e.loading=t}}})],1)])}),[],!1,null,null,null);t.default=component.exports}}]);