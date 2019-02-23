"use strict";module.link('./init');module.link('./utils/globals',{VERSION:"VERSION"},0);module.link('./env/globals',{self:"self",window:"window",global:"global",document:"document",process:"process",console:"console"},1);module.link('./env/is-browser',{default:"isBrowser",isBrowserMainThread:"isBrowserMainThread"},2);module.link('./env/get-browser',{default:"getBrowser",isMobile:"isMobile"},3);module.link('./env/is-electron',{default:"isElectron"},4);module.link('./utils/assert',{default:"assert"},5);module.link('./lib/stats',{default:"Stats"},6);module.link('./lib/log',{default:"Log"},7);module.link('./utils/color',{COLOR:"COLOR"},8);var Log;module.link('./lib/log',{default(v){Log=v}},9);module.link('./utils/color',{addColor:"addColor"},10);module.link('./utils/formatters',{leftPad:"leftPad",rightPad:"rightPad"},11);module.link('./utils/autobind',{autobind:"autobind"},12);module.link('./utils/local-storage',{default:"LocalStorage"},13);module.link('./utils/hi-res-timestamp',{default:"getHiResTimestamp"},14);



// ENVIRONMENT





// ENVIRONMENT'S ASSERT IS 5-15KB, SO WE PROVIDE OUR OWN


// STATS (PERFORMANCE PROFILING)


// LOGGING



// DEFAULT EXPORT IS A LOG INSTANCE

module.exportDefault(new Log({id: 'probe.gl'}));

// UTILITIES





