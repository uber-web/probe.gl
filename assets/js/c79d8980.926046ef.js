"use strict";(self.webpackChunkproject_website=self.webpackChunkproject_website||[]).push([[438],{3905:(e,t,n)=>{n.d(t,{Zo:()=>u,kt:()=>y});var r=n(7294);function l(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?a(Object(n),!0).forEach((function(t){l(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function o(e,t){if(null==e)return{};var n,r,l=function(e,t){if(null==e)return{};var n,r,l={},a=Object.keys(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||(l[n]=e[n]);return l}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(l[n]=e[n])}return l}var s=r.createContext({}),p=function(e){var t=r.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},u=function(e){var t=p(e.components);return r.createElement(s.Provider,{value:t},e.children)},c="mdxType",d={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},m=r.forwardRef((function(e,t){var n=e.components,l=e.mdxType,a=e.originalType,s=e.parentName,u=o(e,["components","mdxType","originalType","parentName"]),c=p(n),m=l,y=c["".concat(s,".").concat(m)]||c[m]||d[m]||a;return n?r.createElement(y,i(i({ref:t},u),{},{components:n})):r.createElement(y,i({ref:t},u))}));function y(e,t){var n=arguments,l=t&&t.mdxType;if("string"==typeof e||l){var a=n.length,i=new Array(a);i[0]=m;var o={};for(var s in t)hasOwnProperty.call(t,s)&&(o[s]=t[s]);o.originalType=e,o[c]="string"==typeof e?e:l,i[1]=o;for(var p=2;p<a;p++)i[p]=n[p];return r.createElement.apply(null,i)}return r.createElement.apply(null,n)}m.displayName="MDXCreateElement"},3493:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>s,contentTitle:()=>i,default:()=>d,frontMatter:()=>a,metadata:()=>o,toc:()=>p});var r=n(7462),l=(n(7294),n(3905));const a={},i="makeSpy",o={unversionedId:"modules/test-utils/make-spy",id:"modules/test-utils/make-spy",title:"makeSpy",description:"A spy utility that wraps a function. The wrapper is invisible: when called the wrapper calls the original function and returns the return value.",source:"@site/../docs/modules/test-utils/make-spy.md",sourceDirName:"modules/test-utils",slug:"/modules/test-utils/make-spy",permalink:"/probe.gl/docs/modules/test-utils/make-spy",draft:!1,editUrl:"https://github.com/uber-web/probe.gl/tree/master/website/../docs/modules/test-utils/make-spy.md",tags:[],version:"current",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"BrowserTestDriver",permalink:"/probe.gl/docs/modules/test-utils/browser-test-driver"},next:{title:"enableDOMLogging (experimental)",permalink:"/probe.gl/docs/modules/test-utils/log-to-dom"}},s={},p=[{value:"Usage",id:"usage",level:2},{value:"Function",id:"function",level:2},{value:"makeSpy",id:"makespy-1",level:3},{value:"Methods and fields on the Wrapped Function",id:"methods-and-fields-on-the-wrapped-function",level:2},{value:"spy.called",id:"spycalled",level:3},{value:"spy.callCount",id:"spycallcount",level:3},{value:"spy.reset()",id:"spyreset",level:3},{value:"spy.returns(returnValue)",id:"spyreturnsreturnvalue",level:3},{value:"spy.restore()",id:"spyrestore",level:3}],u={toc:p},c="wrapper";function d(e){let{components:t,...n}=e;return(0,l.kt)(c,(0,r.Z)({},u,n,{components:t,mdxType:"MDXLayout"}),(0,l.kt)("h1",{id:"makespy"},"makeSpy"),(0,l.kt)("p",null,"A spy utility that wraps a function. The wrapper is invisible: when called the wrapper calls the original function and returns the return value."),(0,l.kt)("p",null,"However it also updates certain metadata that can be inspected later, that:"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},"lets you determine if the wrapped function or method was actually called during exectution of other code."),(0,l.kt)("li",{parentName:"ul"},"allows you to inspect how many times it was called.")),(0,l.kt)("p",null,"Spies also have facilities for mocking, allowing the test suite to override the functions return value to trigger certain conditions."),(0,l.kt)("p",null,"There are also ",(0,l.kt)("inlineCode",{parentName:"p"},"restore")," and ",(0,l.kt)("inlineCode",{parentName:"p"},"reset")," methods that allows you to reset the test status."),(0,l.kt)("h2",{id:"usage"},"Usage"),(0,l.kt)("p",null,"Override function return value"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-js"},"import {makeSpy} from '@probe.gl/test-utils';\nconst spy = makeSpy(Class, 'method');\nspy.returns(false);\n// Call code that calls the wrapped method.\n")),(0,l.kt)("h2",{id:"function"},"Function"),(0,l.kt)("h3",{id:"makespy-1"},"makeSpy"),(0,l.kt)("p",null,"Signatures"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"spy()")," - just an empty function"),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"spy(func)")," - wraps a function"),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"spy(obj, func)")," - wraps a method")),(0,l.kt)("p",null,"Attach a spy to the function. The spy has the following methods and fields"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"called")," - whether spy was called"),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"callCount")," - number of calls"),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"restore()")," - remove spy completely"),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"reset()")," - reset call count")),(0,l.kt)("h2",{id:"methods-and-fields-on-the-wrapped-function"},"Methods and fields on the Wrapped Function"),(0,l.kt)("h3",{id:"spycalled"},"spy.called"),(0,l.kt)("p",null,"Boolean, true if function was called"),(0,l.kt)("h3",{id:"spycallcount"},"spy.callCount"),(0,l.kt)("p",null,"Number, number of times spy was called, ",(0,l.kt)("inlineCode",{parentName:"p"},"0")," if not called"),(0,l.kt)("h3",{id:"spyreset"},"spy.reset()"),(0,l.kt)("p",null,"Resets the ",(0,l.kt)("inlineCode",{parentName:"p"},"called")," and ",(0,l.kt)("inlineCode",{parentName:"p"},"callCount")," flags (to ",(0,l.kt)("inlineCode",{parentName:"p"},"false")," and ",(0,l.kt)("inlineCode",{parentName:"p"},"0"),")."),(0,l.kt)("h3",{id:"spyreturnsreturnvalue"},"spy.returns(returnValue)"),(0,l.kt)("p",null,"Makes the wrapper function return the given value without calling the wrapped function."),(0,l.kt)("h3",{id:"spyrestore"},"spy.restore()"),(0,l.kt)("p",null,"Removes the spy from the function being spied on."))}d.isMDXComponent=!0}}]);