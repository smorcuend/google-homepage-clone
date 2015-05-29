'use strict';
/*global define*/
// to depend on a bower installed component:
// define(['bower_components/componentName/file'])

define('app', ['gapi', 'ui'], function(GAPI, UI) {

    var APIConfig = {
        AJAX_API_key: 'AIzaSyB2-nwkGlgxajzwfJEaV4cMTYr-VAfrmac',
        CSE_ID: 'ENTER_YOUR_CSE_ID_HERE',
        CX_ID: '014892851322095714376:xjjrjz4x4n8',
        countPerPage: 10
    };
    var gapiMode = 'CX';

    GAPI.initConfig(APIConfig, gapiMode);
    UI.init();
});
