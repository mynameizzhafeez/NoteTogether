"use strict";(self["webpackChunkNoteTogether"]=self["webpackChunkNoteTogether"]||[]).push([[676],{9676:function(e,t,r){r.r(t),r.d(t,{default:function(){return v}});var s=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{staticClass:"register"},[r("register")],1)},a=[],o=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{staticClass:"container"},[r("div",{staticClass:"row"},[r("div",{staticClass:"col-lg-6 offset-lg-3 col-sm-10 offset-sm-1"},[r("form",{staticClass:"text-center border border-primary p-5",staticStyle:{"margin-top":"70px",height:"auto","padding-top":"100px !important"},on:{submit:function(t){return t.preventDefault(),e.registerUser(t)}}},[r("input",{directives:[{name:"model",rawName:"v-model",value:e.register.username,expression:"register.username"}],staticClass:"form-control mb-5",attrs:{type:"text",id:"username",placeholder:"Username",required:"",minlength:"3",maxlength:"16"},domProps:{value:e.register.username},on:{input:function(t){t.target.composing||e.$set(e.register,"username",t.target.value)}}}),r("input",{directives:[{name:"model",rawName:"v-model",value:e.register.email,expression:"register.email"}],staticClass:"form-control mb-5",attrs:{type:"email",id:"email",placeholder:"Email",required:"",maxlength:"254"},domProps:{value:e.register.email},on:{input:function(t){t.target.composing||e.$set(e.register,"email",t.target.value)}}}),r("input",{directives:[{name:"model",rawName:"v-model",value:e.register.password,expression:"register.password"}],staticClass:"form-control mb-5",attrs:{type:"password",id:"password",placeholder:"Password",minlength:"6",maxlength:"20"},domProps:{value:e.register.password},on:{input:function(t){t.target.composing||e.$set(e.register,"password",t.target.value)}}}),r("input",{staticClass:"form-control mb-5",attrs:{type:"password",id:"confirmPassword",placeholder:"Confirm Password",minlength:"6",maxlength:"20"}}),r("p",[e._v(" Already have an account? "),r("router-link",{attrs:{to:"/"}},[e._v("Login")]),r("center",[r("button",{staticClass:"btn btn-primary btn-block w-75 my-4",attrs:{type:"submit"}},[e._v(" Sign Up ")])])],1)])])])])},n=[],i=r(6737),l=r.n(i),m={data(){return{register:{username:"",email:"",password:""}}},methods:{async registerUser(){try{if(document.getElementById("password").value!==document.getElementById("confirmPassword").value)l()("Error","Password fields do not match","error");else{let e=await this.$http.post("/user/register",this.register),t=e.data.token;t?(localStorage.setItem("jwt",t),this.$router.push("/"),l()("Success","Registration Was successful","success")):l()("Error","Oops, Something Went Wrong","error")}}catch(e){let t=e.response;409==t.status?l()("Error",t.data.message,"error"):l()("Error",t.data.err.message,"error")}}}},u=m,c=r(1001),d=(0,c.Z)(u,o,n,!1,null,null,null),p=d.exports,g={components:{register:p}},h=g,f=(0,c.Z)(h,s,a,!1,null,null,null),v=f.exports}}]);
//# sourceMappingURL=676.83fb3dc8.js.map