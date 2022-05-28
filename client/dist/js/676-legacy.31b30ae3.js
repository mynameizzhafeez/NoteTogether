"use strict";(self["webpackChunkNoteTogether"]=self["webpackChunkNoteTogether"]||[]).push([[676],{9676:function(e,t,r){r.r(t),r.d(t,{default:function(){return b}});var s=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{staticClass:"register"},[r("register")],1)},a=[],n=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{staticClass:"container"},[r("div",{staticClass:"row"},[r("div",{staticClass:"col-lg-6 offset-lg-3 col-sm-10 offset-sm-1"},[r("form",{staticClass:"text-center border border-primary p-5",staticStyle:{"margin-top":"70px",height:"auto","padding-top":"100px !important"},on:{submit:function(t){return t.preventDefault(),e.registerUser(t)}}},[r("input",{directives:[{name:"model",rawName:"v-model",value:e.register.username,expression:"register.username"}],staticClass:"form-control mb-5",attrs:{type:"text",id:"username",placeholder:"Username",required:"",minlength:"3",maxlength:"16"},domProps:{value:e.register.username},on:{input:function(t){t.target.composing||e.$set(e.register,"username",t.target.value)}}}),r("input",{directives:[{name:"model",rawName:"v-model",value:e.register.email,expression:"register.email"}],staticClass:"form-control mb-5",attrs:{type:"email",id:"email",placeholder:"Email",required:"",maxlength:"254"},domProps:{value:e.register.email},on:{input:function(t){t.target.composing||e.$set(e.register,"email",t.target.value)}}}),r("input",{directives:[{name:"model",rawName:"v-model",value:e.register.password,expression:"register.password"}],staticClass:"form-control mb-5",attrs:{type:"password",id:"password",placeholder:"Password",minlength:"6",maxlength:"20"},domProps:{value:e.register.password},on:{input:function(t){t.target.composing||e.$set(e.register,"password",t.target.value)}}}),r("input",{staticClass:"form-control mb-5",attrs:{type:"password",id:"confirmPassword",placeholder:"Confirm Password",minlength:"6",maxlength:"20"}}),r("p",[e._v(" Already have an account? "),r("router-link",{attrs:{to:"/"}},[e._v("Login")]),r("center",[r("button",{staticClass:"btn btn-primary btn-block w-75 my-4",attrs:{type:"submit"}},[e._v(" Sign Up ")])])],1)])])])])},o=[],i=r(7906),l=r(6198),u=r(6737),c=r.n(u),m={data:function(){return{register:{username:"",email:"",password:""}}},methods:{registerUser:function(){var e=this;return(0,l.Z)((0,i.Z)().mark((function t(){var r,s,a;return(0,i.Z)().wrap((function(t){while(1)switch(t.prev=t.next){case 0:if(t.prev=0,document.getElementById("password").value===document.getElementById("confirmPassword").value){t.next=5;break}c()("Error","Password fields do not match","error"),t.next=10;break;case 5:return t.next=7,e.$http.post("/user/register",e.register);case 7:r=t.sent,s=r.data.token,s?(localStorage.setItem("jwt",s),e.$router.push("/"),c()("Success","Registration Was successful","success")):c()("Error","Oops, Something Went Wrong","error");case 10:t.next=16;break;case 12:t.prev=12,t.t0=t["catch"](0),a=t.t0.response,409==a.status?c()("Error",a.data.message,"error"):c()("Error",a.data.err.message,"error");case 16:case"end":return t.stop()}}),t,null,[[0,12]])})))()}}},p=m,d=r(1001),g=(0,d.Z)(p,n,o,!1,null,null,null),v=g.exports,f={components:{register:v}},h=f,w=(0,d.Z)(h,s,a,!1,null,null,null),b=w.exports}}]);
//# sourceMappingURL=676-legacy.31b30ae3.js.map