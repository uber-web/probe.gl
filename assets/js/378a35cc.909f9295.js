"use strict";(self.webpackChunkproject_website=self.webpackChunkproject_website||[]).push([[549],{3905:(e,t,n)=>{n.d(t,{Zo:()=>g,kt:()=>k});var l=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);t&&(l=l.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,l)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function r(e,t){if(null==e)return{};var n,l,a=function(e,t){if(null==e)return{};var n,l,a={},o=Object.keys(e);for(l=0;l<o.length;l++)n=o[l],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(l=0;l<o.length;l++)n=o[l],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var s=l.createContext({}),p=function(e){var t=l.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},g=function(e){var t=p(e.components);return l.createElement(s.Provider,{value:t},e.children)},d="mdxType",u={inlineCode:"code",wrapper:function(e){var t=e.children;return l.createElement(l.Fragment,{},t)}},m=l.forwardRef((function(e,t){var n=e.components,a=e.mdxType,o=e.originalType,s=e.parentName,g=r(e,["components","mdxType","originalType","parentName"]),d=p(n),m=a,k=d["".concat(s,".").concat(m)]||d[m]||u[m]||o;return n?l.createElement(k,i(i({ref:t},g),{},{components:n})):l.createElement(k,i({ref:t},g))}));function k(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=n.length,i=new Array(o);i[0]=m;var r={};for(var s in t)hasOwnProperty.call(t,s)&&(r[s]=t[s]);r.originalType=e,r[d]="string"==typeof e?e:a,i[1]=r;for(var p=2;p<o;p++)i[p]=n[p];return l.createElement.apply(null,i)}return l.createElement.apply(null,n)}m.displayName="MDXCreateElement"},7568:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>s,contentTitle:()=>i,default:()=>u,frontMatter:()=>o,metadata:()=>r,toc:()=>p});var l=n(7462),a=(n(7294),n(3905));const o={},i="Log",r={unversionedId:"modules/log/log",id:"modules/log/log",title:"Log",description:"A simple console wrapper with a host of features",source:"@site/../docs/modules/log/log.md",sourceDirName:"modules/log",slug:"/modules/log/",permalink:"/probe.gl/docs/modules/log/",draft:!1,editUrl:"https://github.com/uber-web/probe.gl/tree/master/website/../docs/modules/log/log.md",tags:[],version:"current",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"About Testing",permalink:"/probe.gl/docs/articles/about-testing"},next:{title:"Stat",permalink:"/probe.gl/docs/modules/stats/stat"}},s={},p=[{value:"Installing",id:"installing",level:2},{value:"Usage",id:"usage",level:2},{value:"Types and Parameters",id:"types-and-parameters",level:2},{value:"Log Function Parameters",id:"log-function-parameters",level:3},{value:"Log Function Options",id:"log-function-options",level:3},{value:"Log Messages",id:"log-messages",level:3},{value:"Colors",id:"colors",level:3},{value:"Methods",id:"methods",level:2},{value:"constructor",id:"constructor",level:3},{value:"enable",id:"enable",level:3},{value:"getLevel",id:"getlevel",level:3},{value:"setLevel",id:"setlevel",level:3},{value:"log",id:"log-1",level:3},{value:"info",id:"info",level:3},{value:"once",id:"once",level:3},{value:"probe",id:"probe",level:3},{value:"warn",id:"warn",level:3},{value:"error",id:"error",level:3},{value:"assert(condition : Boolean , message: String)",id:"assertcondition--boolean--message-string",level:3},{value:"deprecated",id:"deprecated",level:3},{value:"table",id:"table",level:3},{value:"image",id:"image",level:3},{value:"settings",id:"settings",level:3},{value:"get(setting)",id:"getsetting",level:3},{value:"set(setting, value)",id:"setsetting-value",level:3},{value:"time",id:"time",level:3},{value:"timeEnd",id:"timeend",level:3},{value:"group",id:"group",level:3},{value:"groupCollapsed",id:"groupcollapsed",level:3},{value:"groupEnd",id:"groupend",level:3},{value:"Experimental APIs",id:"experimental-apis",level:2},{value:"withGroup",id:"withgroup",level:3},{value:"trace",id:"trace",level:3}],g={toc:p},d="wrapper";function u(e){let{components:t,...n}=e;return(0,a.kt)(d,(0,l.Z)({},g,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"log"},"Log"),(0,a.kt)("p",null,"A simple console wrapper with a host of features"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"Safely exposes advanced features of Chrome and Firefox console APIs, as well as Node.js color logging, by providing fallbacks for missing methods in other environments."),(0,a.kt)("li",{parentName:"ul"},"Conditional logging - includes a log levels system (aka priorities) that can be controller in the browser console, and settings persist through browser reloads."),(0,a.kt)("li",{parentName:"ul"},"Defeats log cascades - Caches warnings to ensure only one instance of each warning is emitted"),(0,a.kt)("li",{parentName:"ul"},"Links to log calls in browser console - Clicking on a log message shows the code that called the log function."),(0,a.kt)("li",{parentName:"ul"},"Image logging - In Chrome console, it is possible log images"),(0,a.kt)("li",{parentName:"ul"},"Improved ",(0,a.kt)("inlineCode",{parentName:"li"},"assert")," messages - Reformats errors from ",(0,a.kt)("inlineCode",{parentName:"li"},"assert")," to show actual error string")),(0,a.kt)("h2",{id:"installing"},"Installing"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre"},"yarn add @probe.gl/log\n")),(0,a.kt)("h2",{id:"usage"},"Usage"),(0,a.kt)("p",null,"Create a new Log"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-js"},"import {Log} from '@probe.gl/log';\nconst log = new Log({id: 'my-app'});\nlog.log('Hello world')();  // <<< Note: double function call, is necessary\n")),(0,a.kt)("p",null,"Add color (only affects output in Node.js)"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-js"},"import {Log, COLOR} from '@probe.gl/log';\n...\nlog.log({message: 'Hello world', color: COLOR.GREEN});\n")),(0,a.kt)("p",null,"Log using a message generating function, rather than string (avoid creating message when not needed)"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-js"},"log.log(2, () => `${expensiveFunction()}`)();\n")),(0,a.kt)("h2",{id:"types-and-parameters"},"Types and Parameters"),(0,a.kt)("h3",{id:"log-function-parameters"},"Log Function Parameters"),(0,a.kt)("p",null,"Log functions can be called with different parameter combinations"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"log.log(message, ...args)")," - logLevel defaults to 0"),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"log.log(logLevel, message, ...args)")," - sets logLevel"),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"log.log({message, ...options})")," - additional options can be set, logLevel is zero"),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"log.log({logLevel, message, args, ...options})")," - additional options can be set")),(0,a.kt)("h3",{id:"log-function-options"},"Log Function Options"),(0,a.kt)("p",null,"When using named parameters (passing an object as first parameter), the following options can be used:"),(0,a.kt)("table",null,(0,a.kt)("thead",{parentName:"table"},(0,a.kt)("tr",{parentName:"thead"},(0,a.kt)("th",{parentName:"tr",align:null},"Option"),(0,a.kt)("th",{parentName:"tr",align:null},"Type"),(0,a.kt)("th",{parentName:"tr",align:null},"Description"))),(0,a.kt)("tbody",{parentName:"table"},(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",{parentName:"tr",align:null},(0,a.kt)("inlineCode",{parentName:"td"},"logLevel")),(0,a.kt)("td",{parentName:"tr",align:null},(0,a.kt)("inlineCode",{parentName:"td"},"Number")),(0,a.kt)("td",{parentName:"tr",align:null},'This probe will only "fire" if the log\'s current logLevel is greater than or equal to this value.defaults to ',(0,a.kt)("inlineCode",{parentName:"td"},"0"),", which means that the probe is executed / printed regardless of log level.")),(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",{parentName:"tr",align:null},(0,a.kt)("inlineCode",{parentName:"td"},"time")),(0,a.kt)("td",{parentName:"tr",align:null},(0,a.kt)("inlineCode",{parentName:"td"},"Boolean")),(0,a.kt)("td",{parentName:"tr",align:null},"Add a timer since page load (default for ",(0,a.kt)("inlineCode",{parentName:"td"},"Log.probe"),")")),(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",{parentName:"tr",align:null},(0,a.kt)("inlineCode",{parentName:"td"},"once")),(0,a.kt)("td",{parentName:"tr",align:null},(0,a.kt)("inlineCode",{parentName:"td"},"Boolean")),(0,a.kt)("td",{parentName:"tr",align:null},"Logs this message only once (default for ",(0,a.kt)("inlineCode",{parentName:"td"},"Log.warn"),", ",(0,a.kt)("inlineCode",{parentName:"td"},"Log.once"))),(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",{parentName:"tr",align:null},(0,a.kt)("inlineCode",{parentName:"td"},"tag")),(0,a.kt)("td",{parentName:"tr",align:null},(0,a.kt)("inlineCode",{parentName:"td"},"String")),(0,a.kt)("td",{parentName:"tr",align:null},"Optional tag")),(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",{parentName:"tr",align:null},(0,a.kt)("inlineCode",{parentName:"td"},"color")),(0,a.kt)("td",{parentName:"tr",align:null},"`enum"),(0,a.kt)("td",{parentName:"tr",align:null},"String`")),(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",{parentName:"tr",align:null},(0,a.kt)("inlineCode",{parentName:"td"},"background")),(0,a.kt)("td",{parentName:"tr",align:null},"`enum"),(0,a.kt)("td",{parentName:"tr",align:null},"String`")))),(0,a.kt)("h3",{id:"log-messages"},"Log Messages"),(0,a.kt)("p",null,"The ",(0,a.kt)("inlineCode",{parentName:"p"},"message")," argument can be a string or a function returning a string."),(0,a.kt)("h3",{id:"colors"},"Colors"),(0,a.kt)("p",null,"To get access to color definitions:\n",(0,a.kt)("inlineCode",{parentName:"p"},"import {COLOR} from '@probe.gl/log'")),(0,a.kt)("p",null,"Available colors:"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"COLOR.BLACK"),", ",(0,a.kt)("inlineCode",{parentName:"li"},"COLOR.RED"),", ",(0,a.kt)("inlineCode",{parentName:"li"},"COLOR.GREEN"),", ",(0,a.kt)("inlineCode",{parentName:"li"},"COLOR.YELLOW"),", ",(0,a.kt)("inlineCode",{parentName:"li"},"COLOR.BLUE"),", ",(0,a.kt)("inlineCode",{parentName:"li"},"COLOR.MAGENTA"),", ",(0,a.kt)("inlineCode",{parentName:"li"},"COLOR.CYAN"),", ",(0,a.kt)("inlineCode",{parentName:"li"},"COLOR.WHITE")),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"COLOR.BRIGHT_BLACK"),", ",(0,a.kt)("inlineCode",{parentName:"li"},"COLOR.BRIGHT_RED"),", ",(0,a.kt)("inlineCode",{parentName:"li"},"COLOR.BRIGHT_GREEN"),", ",(0,a.kt)("inlineCode",{parentName:"li"},"COLOR.BRIGHT_YELLOW"),", ",(0,a.kt)("inlineCode",{parentName:"li"},"COLOR.BRIGHT_BLUE"),", ",(0,a.kt)("inlineCode",{parentName:"li"},"COLOR.BRIGHT_MAGENTA"),", ",(0,a.kt)("inlineCode",{parentName:"li"},"COLOR.BRIGHT_CYAN"),", ",(0,a.kt)("inlineCode",{parentName:"li"},"COLOR.BRIGHT_WHITE"))),(0,a.kt)("h2",{id:"methods"},"Methods"),(0,a.kt)("h3",{id:"constructor"},"constructor"),(0,a.kt)("p",null,"Creates a new ",(0,a.kt)("inlineCode",{parentName:"p"},"Log")," instance."),(0,a.kt)("p",null,(0,a.kt)("inlineCode",{parentName:"p"},"new Log({id})")),(0,a.kt)("h3",{id:"enable"},"enable"),(0,a.kt)("p",null,(0,a.kt)("inlineCode",{parentName:"p"},"log.enable(false)")),(0,a.kt)("p",null,"Accepts one argument ",(0,a.kt)("inlineCode",{parentName:"p"},"true")," or ",(0,a.kt)("inlineCode",{parentName:"p"},"false"),". When disabled, calling log methods do not print anything to the console."),(0,a.kt)("h3",{id:"getlevel"},"getLevel"),(0,a.kt)("p",null,(0,a.kt)("inlineCode",{parentName:"p"},"log.getLevel()")),(0,a.kt)("h3",{id:"setlevel"},"setLevel"),(0,a.kt)("p",null,(0,a.kt)("inlineCode",{parentName:"p"},"log.setLevel(newLevel)")),(0,a.kt)("h3",{id:"log-1"},"log"),(0,a.kt)("p",null,"Log a debug level message (uses ",(0,a.kt)("inlineCode",{parentName:"p"},"console.debug")," if available)"),(0,a.kt)("p",null,(0,a.kt)("inlineCode",{parentName:"p"},"log.log(message, ...args)"),"\n",(0,a.kt)("inlineCode",{parentName:"p"},"log.log(logLevel, message, ...args)"),"\n",(0,a.kt)("inlineCode",{parentName:"p"},"log.log({logLevel, message, args, ....options})")),(0,a.kt)("p",null,"Returns: a function closure that should be called immediately."),(0,a.kt)("h3",{id:"info"},"info"),(0,a.kt)("p",null,"Log a normal message (uses ",(0,a.kt)("inlineCode",{parentName:"p"},"console.info")," if available)"),(0,a.kt)("p",null,(0,a.kt)("inlineCode",{parentName:"p"},"log.info(message, ...args)"),"\n",(0,a.kt)("inlineCode",{parentName:"p"},"log.info(logLevel, message, ...args)"),"\n",(0,a.kt)("inlineCode",{parentName:"p"},"log.info({logLevel, message, args, ....options})")),(0,a.kt)("p",null,"Returns: a function closure that should be called immediately."),(0,a.kt)("h3",{id:"once"},"once"),(0,a.kt)("p",null,"Log a normal message, but only once, no console flooding"),(0,a.kt)("p",null,(0,a.kt)("inlineCode",{parentName:"p"},"once(logLevel|opts, arg, ...args)")),(0,a.kt)("p",null,"Returns: a function closure that should be called immediately."),(0,a.kt)("h3",{id:"probe"},"probe"),(0,a.kt)("p",null,"Log a message with time since page load"),(0,a.kt)("p",null,(0,a.kt)("inlineCode",{parentName:"p"},"log.probe(message, ...args)"),"\n",(0,a.kt)("inlineCode",{parentName:"p"},"log.probe(logLevel, message, ...args)"),"\n",(0,a.kt)("inlineCode",{parentName:"p"},"log.probe({logLevel, message, args, ....options})")),(0,a.kt)("p",null,"Returns: a function closure that should be called immediately."),(0,a.kt)("h3",{id:"warn"},"warn"),(0,a.kt)("p",null,"Logs a warning (uses the ",(0,a.kt)("inlineCode",{parentName:"p"},"console.warn")," method if available). Logs each warning only once to avoid console flooding."),(0,a.kt)("p",null,(0,a.kt)("inlineCode",{parentName:"p"},"log.warn(message, ...args)"),"\n",(0,a.kt)("inlineCode",{parentName:"p"},"log.warn({message, args, ....options})")),(0,a.kt)("p",null,"Returns: a function closure that should be called immediately."),(0,a.kt)("h3",{id:"error"},"error"),(0,a.kt)("p",null,"Print an error, using the console's error method"),(0,a.kt)("p",null,(0,a.kt)("inlineCode",{parentName:"p"},"log.error(message, ...args)"),"\n",(0,a.kt)("inlineCode",{parentName:"p"},"log.error({message, args, ....options})")),(0,a.kt)("p",null,"Returns: a function closure that should be called immediately."),(0,a.kt)("h3",{id:"assertcondition--boolean--message-string"},"assert(condition : Boolean ","[, message: String]",")"),(0,a.kt)("p",null,"Throws an error with the supplied message (or a default message) if condition is false"),(0,a.kt)("h3",{id:"deprecated"},"deprecated"),(0,a.kt)("p",null,"Generates a deprecation warning (using ",(0,a.kt)("inlineCode",{parentName:"p"},"log.warn"),'):\n"',(0,a.kt)("inlineCode",{parentName:"p"},"oldUsage")," is deprecated and will be removed in a later version. Use ",(0,a.kt)("inlineCode",{parentName:"p"},"newUsage"),' instead."'),(0,a.kt)("p",null,(0,a.kt)("inlineCode",{parentName:"p"},"log.deprecated(oldUsage, newUsage)")),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"oldUsage")," - name of deprecated function or parameter"),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"newUsage")," - name of new function or parameter")),(0,a.kt)("p",null,"Returns: a function closure that should be called immediately."),(0,a.kt)("h3",{id:"table"},"table"),(0,a.kt)("p",null,"Logs a table (using ",(0,a.kt)("inlineCode",{parentName:"p"},"console.table")," if available)."),(0,a.kt)("p",null,(0,a.kt)("inlineCode",{parentName:"p"},"log.table(logLevel|opts, table)")),(0,a.kt)("p",null,"Returns: a function closure that should be called immediately."),(0,a.kt)("h3",{id:"image"},"image"),(0,a.kt)("p",null,"Logs an image (under Chrome)"),(0,a.kt)("p",null,(0,a.kt)("inlineCode",{parentName:"p"},"log.image({logLevel, image, message = '', scale = 1})")),(0,a.kt)("h3",{id:"settings"},"settings"),(0,a.kt)("p",null,"Logs the current settings as a table"),(0,a.kt)("p",null,(0,a.kt)("inlineCode",{parentName:"p"},"log.settings()")),(0,a.kt)("h3",{id:"getsetting"},"get(setting)"),(0,a.kt)("p",null,"Returns the current value of setting"),(0,a.kt)("p",null,(0,a.kt)("inlineCode",{parentName:"p"},"log.get('logLevel')")),(0,a.kt)("h3",{id:"setsetting-value"},"set(setting, value)"),(0,a.kt)("p",null,"Updates the value of setting"),(0,a.kt)("p",null,(0,a.kt)("inlineCode",{parentName:"p"},"log.set('logLevel', 3)")),(0,a.kt)("h3",{id:"time"},"time"),(0,a.kt)("p",null,(0,a.kt)("inlineCode",{parentName:"p"},"log.time(logLevel, label)")),(0,a.kt)("h3",{id:"timeend"},"timeEnd"),(0,a.kt)("p",null,(0,a.kt)("inlineCode",{parentName:"p"},"log.timeEnd(logLevel, label)")),(0,a.kt)("h3",{id:"group"},"group"),(0,a.kt)("p",null,(0,a.kt)("inlineCode",{parentName:"p"},"log.group(logLevel, label)")),(0,a.kt)("h3",{id:"groupcollapsed"},"groupCollapsed"),(0,a.kt)("p",null,(0,a.kt)("inlineCode",{parentName:"p"},"log.group(logLevel, label)")),(0,a.kt)("h3",{id:"groupend"},"groupEnd"),(0,a.kt)("p",null,(0,a.kt)("inlineCode",{parentName:"p"},"log.groupEnd(logLevel)")),(0,a.kt)("h2",{id:"experimental-apis"},"Experimental APIs"),(0,a.kt)("h3",{id:"withgroup"},"withGroup"),(0,a.kt)("p",null,"Provides an exception safe way to run some code within a group"),(0,a.kt)("p",null,(0,a.kt)("inlineCode",{parentName:"p"},"log.withGroup(logLevel, label, func)")),(0,a.kt)("h3",{id:"trace"},"trace"),(0,a.kt)("p",null,"Prints a stack trace"))}u.isMDXComponent=!0}}]);