'use strict';
/*global define*/

define('ui', ['gapi'], function(GAPI) {

    var UI = {

        components: {
            searchInput: document.querySelector('#searchInput'),
            searchButton: document.querySelector('#searchButton'),
            searchImages: document.querySelector('#cat_link_img'),
            searchWeb: document.querySelector('#cat_link_web'),
            searchMorphButton: document.querySelector('#searchMorphButton'),
            mainHeaderContainer: document.querySelector('.main_header'),
            searchContainer: document.querySelector('.search_container'),
            resultsContainer: document.querySelector('.results_container'),
            webResults: document.querySelector('.web_results'),
            imageResults: document.querySelector('.image_results'),
            paginator: document.querySelector('.paginator'),
            prevPage: document.querySelector('#prevPage'),
            nextPage: document.querySelector('#nextPage')
        },
        addListener: function(el, event, action) {
            el.addEventListener(event, action, false);
        },
        init: function() {
            //Add Listeners
            var ref = this;

            function _searchProcess(type) {
                var searchText = ref.components.searchInput.value;
                if (!searchText.length) {
                    return false;
                }
                GAPI.search(searchText, type)
                    .then(function(response) {
                        var responseParsed = JSON.parse(response);
                        //Generate results
                        document.getElementById('time_web')
                            .innerHTML = 'About ' + responseParsed.searchInformation.totalResults + ' results (' +
                            responseParsed.searchInformation.formattedSearchTime + ' seconds)';
                        // "searchInformation": {
                        //     "searchTime": 0.441968,
                        //     "formattedSearchTime": "0.44",
                        //     "totalResults": "22900000",
                        //     "formattedTotalResults": "22,900,000"
                        // },
                        ref.refreshResults();
                        if (!responseParsed.items) {
                            alert('No results');
                            return false;
                        }
                        responseParsed.items.forEach(function(element) {
                            if (type === 'image') {
                                ref.createImagesResultItem(element);
                            } else {
                                ref.createWebResultItem(element);
                            }
                        });
                        ref.show(ref.components.resultsContainer);
                        ref.showTypeOfResults(type);
                    })
                    .catch(function(responseError) {
                        var responseErrorParsed = JSON.parse(responseError);
                        console.log(responseErrorParsed);
                    });
            }
            this.addListener(this.components.searchButton, 'click', function(event) {
                event.preventDefault();
                _searchProcess();
            });
            this.addListener(this.components.searchMorphButton, 'click', function(event) {
                event.preventDefault();
                _searchProcess();
            });

            this.addListener(this.components.nextPage, 'click', function(event) {
                var searchText = ref.components.searchInput.value;
                event.preventDefault();
                if (!searchText.length) {
                    return false;
                }
                var type;
                if (ref.components.searchImages.classList.contains('active')) {
                    type = 'image';
                };
                GAPI.nextPage(type)
                    .then(function(response) {
                        var responseParsed = JSON.parse(response);
                        ref.refreshResults();
                        responseParsed.items.forEach(function(element) {
                            if (type === 'image') {
                                ref.createImagesResultItem(element);
                            } else {
                                ref.createWebResultItem(element);
                            }
                        });
                    })
                    .catch(function(responseError) {
                        var responseErrorParsed = JSON.parse(responseError);
                        console.log(responseErrorParsed);
                    });
            });


            this.addListener(this.components.prevPage, 'click', function(event) {
                var searchText = ref.components.searchInput.value;
                event.preventDefault();
                if (!searchText.length) {
                    return false;
                }
                var type;
                if (ref.components.searchImages.classList.contains('active')) {
                    type = 'image';
                };
                GAPI.prevPage(type)
                    .then(function(response) {
                        var responseParsed = JSON.parse(response);
                        ref.refreshResults();
                        responseParsed.items.forEach(function(element) {
                            if (type === 'image') {
                                ref.createImagesResultItem(element);
                            } else {
                                ref.createWebResultItem(element);
                            }
                        });
                    })
                    .catch(function(responseError) {
                        var responseErrorParsed = JSON.parse(responseError);
                        console.log(responseErrorParsed);
                    });
            });

            function _checkMorph(value) {

                if (value > 0) {
                    ref.components.searchContainer.classList.add('morph');
                    ref.components.mainHeaderContainer.classList.add('morph');
                } else {
                    ref.components.searchContainer.classList.remove('morph');
                    ref.components.mainHeaderContainer.classList.remove('morph');
                    ref.hide(ref.components.resultsContainer);
                }
            };
            this.addListener(this.components.searchInput, 'input', function() {
                _checkMorph(this.value.length);
            });

            this.addListener(this.components.searchImages, 'click', function() {
                ref.components.searchWeb.classList.remove('active');
                this.classList.add('active');
                _searchProcess('image');
            });

            this.addListener(this.components.searchWeb, 'click', function() {
                ref.components.searchImages.classList.remove('active');
                this.classList.add('active');
                _searchProcess();
            });

            this.addListener(document, 'keydown', function(event) {
                if (event.keyCode === '13' && this.components.searchInput.value.length) {
                    GAPI.search(this.components.searchInput.value);
                }
            });

        },
        show: function(el) {
            el.classList.remove('hidden');
            el.classList.add('visible');
        },
        hide: function(el) {
            el.classList.remove('visible');
            el.classList.add('hidden');
        },
        _createElement: function(type, text, parentElement) {
            var el = document.createElement(type);
            if (text) {
                var t = document.createTextNode(text);
                el.appendChild(t);
            }
            parentElement.appendChild(el);
            return el;
        },
        refreshResults: function() {
            while (this.components.webResults.firstChild) {
                this.components.webResults.removeChild(this.components.webResults.firstChild);
            }
            while (this.components.imageResults.firstChild) {
                this.components.imageResults.removeChild(this.components.imageResults.firstChild);
            }
        },
        createWebResultItem: function(data) {
            var webResultsItem = this._createElement('div', null, this.components.webResults);
            webResultsItem.classList.add('web_result');
            var fEl = this._createElement('span', null, webResultsItem);
            fEl.insertAdjacentHTML('afterend', '<p class="description">' + data.htmlSnippet + '</p>');
            fEl.insertAdjacentHTML('afterend', '<p class="trad"><a href="">Translate this page</a></p>');
            fEl.insertAdjacentHTML('afterend', '<img src="app/images/ArrowGreen.png" />');
            fEl.insertAdjacentHTML('afterend', '<p class="cont">' + data.htmlFormattedUrl + '</p>');
            fEl.insertAdjacentHTML('afterend', '<p class="title"><a href="' + data.link + '">' + data.title + '</a></p>');
        },
        createImagesResultItem: function(data) {
            var imageResultsItem = this._createElement('a', null, this.components.imageResults);
            imageResultsItem.classList.add('image_result');
            imageResultsItem.classList.add('image_link');
            imageResultsItem.href = data.link;
            var fEl = this._createElement('div', null, imageResultsItem);
            fEl.classList.add('image_container');
            fEl.style.width = data.image.thumbnailWidth + 'px';
            fEl.style.height = data.image.thumbnailHeight + 'px';
            fEl.style.backgroundImage = 'url(' + data.image.thumbnailLink + ')';

            var tooltip = this._createElement('span', null, fEl);
            tooltip.classList.add('tooltip');
            tooltip.innerHTML = data.image.width + ' x ' + data.image.width + ' - ' + data.displayLink;

            // "items": [{
            //     "kind": "customsearch#result",
            //     "title": "Thanksgiving Recipes from Google",
            //     "htmlTitle": "Thanksgiving Recipes from Google",
            //     "link": "http://www.google.com/landing/thanksgiving/img/thumb_turkey.jpg",
            //     "displayLink": "www.google.com",
            //     "snippet": "Herb and Apple Stuffing",
            //     "htmlSnippet": "Herb and <b>Apple</b> Stuffing",
            //     "mime": "image/jpeg",
            //     "image": {
            //         "contextLink": "http://www.google.com/landing/thanksgiving/",
            //         "height": 100,
            //         "width": 100,
            //         "byteSize": 4772,
            //         "thumbnailLink": "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQLkUkLcY8E1ayWjZlA9SyvKW-Fk1myFMbLKbes_tSP76b14L-HboH_FA",
            //         "thumbnailHeight": 82,
            //         "thumbnailWidth": 82
            //     }
            // }]

        },
        showTypeOfResults: function(type) {
            if (type === 'image') {
                this.hide(this.components.webResults);
                this.show(this.components.imageResults);
            } else {
                this.hide(this.components.imageResults);
                this.show(this.components.webResults);
            }
        }

    };

    return UI;

});
