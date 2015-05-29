'use strict';
/*global requirejs*/
requirejs.config({
    baseUrl: 'app/scripts',
    paths: {
        components: '../../bower_components'
    }
});

if (!window.requireTestMode) {
    require(['app']);
}
