"use strict";module.export({VERSION:()=>VERSION,isBrowser:()=>isBrowser},true);var checkIfBrowser;module.link('../env/is-browser',{default(v){checkIfBrowser=v}},0);module.link('../env/globals',{self:"self",window:"window",global:"global",document:"document",process:"process",console:"console"},1);



// Extract injected version from package.json (injected by babel plugin)
/* global __VERSION__ */
const VERSION = typeof __VERSION__ !== 'undefined' ? __VERSION__ : 'untranspiled source';

const isBrowser = checkIfBrowser();
