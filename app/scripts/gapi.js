'use strict';
/*global define*/

define('gapi', [], function() {

    var GoogleAPI = {
        base: 'https://www.googleapis.com/customsearch/v1',
        currentQuery: null,
        resultsStartIndex: 1,
        resultsCount: 10,
        initConfig: function(config, mode) {
            if (config && config.AJAX_API_key && (config.CSE_ID || config.CX_ID)) {
                var pseudoUrl = this.base + '?key=' + config.AJAX_API_key;
                if (mode === 'CSE') {
                    this.base = pseudoUrl + '&cse=' + config.CSE_ID;
                } else if (mode === 'CX') {
                    this.base = pseudoUrl + '&cx=' + config.CX_ID;
                }

                if (config.countPerPage) {
                    this.resultsCount = config.countPerPage;
                }

            } else {
                throw 'gapi Error Config';
            }
        },
        search: function(query, type) {
            this.currentQuery = this._urlencode(query);
            if (type === 'image') {
                this.currentQuery += '&searchType=image&fileType=jpg&imgSize=small&alt=json';
            }
            return this.send(this.currentQuery);
        },
        prevPage: function() {
            this.resultsStartIndex -= this.resultsCount;
            return this.send(this.currentQuery + '&num=' + this.resultsCount + '&start=' + this.resultsStartIndex);
        },
        nextPage: function() {
            this.resultsStartIndex += this.resultsCount;
            return this.send(this.currentQuery + '&num=' + this.resultsCount + '&start=' + this.resultsStartIndex);
        },
        _queryBuilder: function(query) {
            return this.base + '&q=' + query;
        },
        send: function(query) {
            var req = new XMLHttpRequest();
            var ref = this;
            return new Promise(function(resolve, reject) {
                req.open('GET', ref._queryBuilder(query), true);
                //req.open('GET', 'http://localhost:9000/app/google_search_result_images.json', true);
                req.onreadystatechange = function() {
                    if (req.readyState === 4) {
                        console.log(req.responseText);
                        if (req.status === 200) {
                            resolve(req.responseText);
                        } else if (req.status === 404) {
                            window.alert('Resource not found');
                            reject(req.responseText);
                        } else if (req.status === 403) {
                            window.alert('Quota exceed');
                            reject(req.responseText);
                        } else {
                            window.alert('Quota exceed');
                            window.alert('Resource not found');
                            reject(req.responseText);
                        }
                    }
                };
                req.send(null);

            });

        },
        _urlencode: function(str) {
            return window.encodeURI(str);
        }

    };

    return GoogleAPI;

});
