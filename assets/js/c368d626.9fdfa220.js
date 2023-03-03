"use strict";(self.webpackChunkproject_website=self.webpackChunkproject_website||[]).push([[783],{3905:(e,t,r)=>{r.d(t,{Zo:()=>u,kt:()=>h});var n=r(7294);function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function o(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function i(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?o(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):o(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function s(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},o=Object.keys(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var l=n.createContext({}),p=function(e){var t=n.useContext(l),r=t;return e&&(r="function"==typeof e?e(t):i(i({},t),e)),r},u=function(e){var t=p(e.components);return n.createElement(l.Provider,{value:t},e.children)},c="mdxType",d={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},m=n.forwardRef((function(e,t){var r=e.components,a=e.mdxType,o=e.originalType,l=e.parentName,u=s(e,["components","mdxType","originalType","parentName"]),c=p(r),m=a,h=c["".concat(l,".").concat(m)]||c[m]||d[m]||o;return r?n.createElement(h,i(i({ref:t},u),{},{components:r})):n.createElement(h,i({ref:t},u))}));function h(e,t){var r=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=r.length,i=new Array(o);i[0]=m;var s={};for(var l in t)hasOwnProperty.call(t,l)&&(s[l]=t[l]);s.originalType=e,s[c]="string"==typeof e?e:a,i[1]=s;for(var p=2;p<o;p++)i[p]=r[p];return n.createElement.apply(null,i)}return n.createElement.apply(null,r)}m.displayName="MDXCreateElement"},7186:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>l,contentTitle:()=>i,default:()=>d,frontMatter:()=>o,metadata:()=>s,toc:()=>p});var n=r(7462),a=(r(7294),r(3905));const o={},i="BrowserDriver",s={unversionedId:"modules/test-utils/browser-driver",id:"modules/test-utils/browser-driver",title:"BrowserDriver",description:"A Chrome Browser test automation driver class (based on the Chrome DevTools protocol via the puppeteer module. The BrowserDriver class is primarily intended for automating browser based applications from shell scripts.",source:"@site/../docs/modules/test-utils/browser-driver.md",sourceDirName:"modules/test-utils",slug:"/modules/test-utils/browser-driver",permalink:"/probe.gl/docs/modules/test-utils/browser-driver",draft:!1,editUrl:"https://github.com/uber-web/probe.gl/tree/master/website/../docs/modules/test-utils/browser-driver.md",tags:[],version:"current",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"Bench",permalink:"/probe.gl/docs/modules/bench/"},next:{title:"BrowserTestDriver",permalink:"/probe.gl/docs/modules/test-utils/browser-test-driver"}},l={},p=[{value:"Usage",id:"usage",level:2},{value:"Constructor",id:"constructor",level:2},{value:"Methods",id:"methods",level:2},{value:"startBrowser(options : Object)",id:"startbrowseroptions--object",level:3},{value:"openPage(options : Object)",id:"openpageoptions--object",level:3},{value:"stopBrowser()",id:"stopbrowser",level:3},{value:"startServer(config : Object)",id:"startserverconfig--object",level:3},{value:"stopServer()",id:"stopserver",level:3},{value:"exit(statusCode : Number)",id:"exitstatuscode--number",level:3}],u={toc:p},c="wrapper";function d(e){let{components:t,...r}=e;return(0,a.kt)(c,(0,n.Z)({},u,r,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"browserdriver"},"BrowserDriver"),(0,a.kt)("p",{class:"badges"},(0,a.kt)("img",{src:"https://img.shields.io/badge/Node.js-v8.0+-blue.svg?style=flat-square",alt:"Node"}),(0,a.kt)("img",{src:"https://img.shields.io/badge/Chrome-v64+-blue.svg?style=flat-square",alt:"Node"})),(0,a.kt)("p",null,"A Chrome Browser test automation driver class (based on the ",(0,a.kt)("a",{parentName:"p",href:"https://chromedevtools.github.io/devtools-protocol/"},"Chrome ",(0,a.kt)("inlineCode",{parentName:"a"},"DevTools")," protocol")," via the ",(0,a.kt)("a",{parentName:"p",href:"https://github.com/GoogleChrome/puppeteer"},(0,a.kt)("inlineCode",{parentName:"a"},"puppeteer"))," module. The ",(0,a.kt)("inlineCode",{parentName:"p"},"BrowserDriver")," class is primarily intended for automating browser based applications from shell scripts."),(0,a.kt)("p",null,"A ",(0,a.kt)("inlineCode",{parentName:"p"},"BrowserDriver")," is typically used to do the following:"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"Launch/close a Chromium browser instance"),(0,a.kt)("li",{parentName:"ul"},"Start/stop a local web service."),(0,a.kt)("li",{parentName:"ul"},"Opens a browser page with a URL in the browser.")),(0,a.kt)("p",null,"To use this class, ",(0,a.kt)("a",{parentName:"p",href:"https://www.npmjs.com/package/puppeteer"},"puppeteer")," must be installed as a dev dependency."),(0,a.kt)("h2",{id:"usage"},"Usage"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-js"},"const {BrowserDriver} = require('@probe.gl/test-utils');\nnew BrowserDriver({id: 'browser-test'});\n")),(0,a.kt)("h2",{id:"constructor"},"Constructor"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-js"},"const browserDriver = new BrowserDriver(opts);\n")),(0,a.kt)("p",null,"Parameters:"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"opts")," (Object)",(0,a.kt)("ul",{parentName:"li"},(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"id")," (String) - an id for this ",(0,a.kt)("inlineCode",{parentName:"li"},"BrowserDriver")," instance. Default ",(0,a.kt)("inlineCode",{parentName:"li"},"browser-driver"),".")))),(0,a.kt)("h2",{id:"methods"},"Methods"),(0,a.kt)("h3",{id:"startbrowseroptions--object"},"startBrowser(options : Object)"),(0,a.kt)("p",null,"Launch a new browser instance."),(0,a.kt)("p",null,(0,a.kt)("inlineCode",{parentName:"p"},"options")," are directly passed to ",(0,a.kt)("a",{parentName:"p",href:"https://github.com/GoogleChrome/puppeteer/blob/v1.11.0/docs/api.md#puppeteerlaunchoptions"},"puppeteer.launch"),"."),(0,a.kt)("p",null,"Returns a ",(0,a.kt)("inlineCode",{parentName:"p"},"Promise")," that resolves when the browser has started."),(0,a.kt)("h3",{id:"openpageoptions--object"},"openPage(options : Object)"),(0,a.kt)("p",null,"Open a new tab in the browser. Only works after a browser instance is started:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-js"},"browserDriver.startBrowser().openPage({url: 'http://localhost'});\n")),(0,a.kt)("p",null,"Parameters:"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"url")," (String) - The url to load in the page. Default ",(0,a.kt)("inlineCode",{parentName:"li"},"http://localhost"),"."),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"exposeFunctions")," (Object) - keys are function names to be added to the page's ",(0,a.kt)("inlineCode",{parentName:"li"},"window")," object, and the values are callback functions to execute in Node.js. See ",(0,a.kt)("a",{parentName:"li",href:"https://github.com/GoogleChrome/puppeteer/blob/v1.11.0/docs/api.md#pageexposefunctionname-puppeteerfunction"},"exposeFunction")," for details."),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"onLoad")," (Function) - callback when the page is loaded"),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"onConsole")," (Function) - callback when the page logs to console"),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"onError")," (Function) - callback if the puppeteer page crashes")),(0,a.kt)("p",null,"Returns a ",(0,a.kt)("inlineCode",{parentName:"p"},"Promise")," that resolves when the page is open."),(0,a.kt)("h3",{id:"stopbrowser"},"stopBrowser()"),(0,a.kt)("p",null,"Terminate the browser instance."),(0,a.kt)("p",null,"Returns a ",(0,a.kt)("inlineCode",{parentName:"p"},"Promise")," that resolves when the browser is closed."),(0,a.kt)("h3",{id:"startserverconfig--object"},"startServer(config : Object)"),(0,a.kt)("p",null,"Runs a server in a new child process, that the browser can connect to."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-js"},"driver.startServer({\n  command: './node_modules/.bin/webpack-dev-server',\n  arguments: ['--config', 'webpack.config.js'],\n  wait: 2000\n})\n")),(0,a.kt)("p",null,"Parameters:"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"command")," (string) - the command to run, default ",(0,a.kt)("inlineCode",{parentName:"li"},"'webpack-dev-server'"),"."),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"arguments")," (string[]) - a list of string arguments."),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"options")," (Object) - options for the new process. Default ",(0,a.kt)("inlineCode",{parentName:"li"},"{maxBuffer: 5000 * 1024}"),". See ",(0,a.kt)("a",{parentName:"li",href:"https://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options"},"child_process.spawn")," for details."),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"port")," (",(0,a.kt)("inlineCode",{parentName:"li"},"'auto'"),"|",(0,a.kt)("inlineCode",{parentName:"li"},"false"),") - ",(0,a.kt)("inlineCode",{parentName:"li"},"startServer")," can attempt to bind the service to an available port if ",(0,a.kt)("inlineCode",{parentName:"li"},"port")," is set to ",(0,a.kt)("inlineCode",{parentName:"li"},"'auto'"),". In this case, the command receives additional arguments ",(0,a.kt)("inlineCode",{parentName:"li"},"--port <port>"),". Default ",(0,a.kt)("inlineCode",{parentName:"li"},"'auto'"),"."),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"wait")," (Number) - time in milliseconds to wait after executing the command. If any error is generated from the child process during this period, the ",(0,a.kt)("inlineCode",{parentName:"li"},"Promise")," will reject. Otherwise, the service is considered available. Default ",(0,a.kt)("inlineCode",{parentName:"li"},"2000"),".")),(0,a.kt)("p",null,"Returns a ",(0,a.kt)("inlineCode",{parentName:"p"},"Promise")," that resolves to the service URL when the server is available."),(0,a.kt)("h3",{id:"stopserver"},"stopServer()"),(0,a.kt)("p",null,"Stops the server (kills the child process)."),(0,a.kt)("p",null,"Returns: a ",(0,a.kt)("inlineCode",{parentName:"p"},"Promise")," that resolves when the server is closed."),(0,a.kt)("h3",{id:"exitstatuscode--number"},"exit(statusCode : Number)"),(0,a.kt)("p",null,"Exit the process after safely closing down any running browser and server instances."),(0,a.kt)("p",null,"Parameter:"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"statusCode")," - the status code to use when exit the process. Default ",(0,a.kt)("inlineCode",{parentName:"li"},"0"),".")))}d.isMDXComponent=!0}}]);