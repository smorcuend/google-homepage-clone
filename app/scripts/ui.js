'use strict';
/*global define*/


define('ui', ['gapi'], function(GAPI) {

    var UI = {

        components: {
            searchInput: document.querySelector('#searchInput'),
            searchButton: document.querySelector('#searchButton'),
            searchImages: document.querySelector('#cat_link_img'),
            searchMorphButton: document.querySelector('#searchMorphButton'),
            mainHeaderContainer: document.querySelector('.main_header'),
            searchContainer: document.querySelector('.search_container'),
            headerResultsContainer: document.querySelector('.header_results_container'),
            webResultsContainer: document.querySelector('.web_results_container'),
            webResultsItems: document.querySelector('.web_results'),
            imageResultsContainer: document.querySelector('.images_results_container'),
            imageResultsItems: document.querySelector('.image_results'),
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
                        ref.show(ref.components.headerResultsContainer);
                        if (type === 'image') {
                            ref.show(ref.components.imageResultsContainer);
                            ref.hide(ref.components.webResultsContainer);
                        } else {
                            ref.show(ref.components.webResultsContainer);
                            ref.hide(ref.components.imageResultsContainer);
                        }
                        ref.show(ref.components.paginator);
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
                GAPI.nextPage()
                    .then(function(response) {
                        var responseParsed = JSON.parse(response);
                        ref.refreshResults();
                        responseParsed.items.forEach(function(element) {
                            ref.createWebResultItem(element);
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
                GAPI.prevPage()
                    .then(function(response) {
                        var responseParsed = JSON.parse(response);
                        ref.refreshResults();
                        responseParsed.items.forEach(function(element) {
                            ref.createWebResultItem(element);
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
                    ref.hide(ref.components.headerResultsContainer);
                    ref.hide(ref.components.webResultsContainer);
                    ref.hide(ref.components.imageResultsContainer);
                    ref.hide(ref.components.paginator);
                }
            };
            this.addListener(this.components.searchInput, 'input', function() {
                _checkMorph(this.value.length);
            });

            this.addListener(this.components.searchImages, 'click', function() {
                _searchProcess('image');
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
            while (this.components.webResultsItems.firstChild) {
                this.components.webResultsItems.removeChild(this.components.webResultsItems.firstChild);
            }
            while (this.components.imageResultsItems.firstChild) {
                this.components.imageResultsItems.removeChild(this.components.imageResultsItems.firstChild);
            }
        },
        createWebResultItem: function(data) {
            var webResultsItem = this._createElement('div', null, this.components.webResultsItems);
            webResultsItem.classList.add('web_result');
            var fEl = this._createElement('span', null, webResultsItem);
            fEl.insertAdjacentHTML('afterend', '<p class="description">' + data.htmlSnippet + '</p>');
            fEl.insertAdjacentHTML('afterend', '<p class="trad"><a href="">Translate this page</a></p>');
            fEl.insertAdjacentHTML('afterend', '<img src="app/images/ArrowGreen.png" />');
            fEl.insertAdjacentHTML('afterend', '<p class="cont">' + data.htmlFormattedUrl + '</p>');
            fEl.insertAdjacentHTML('afterend', '<p class="title"><a href="' + data.link + '">' + data.title + '</a></p>');

            // {
            //     cacheId: "YbLXEdOjqkIJ"
            //     displayLink: "www.cs.ubc.ca"
            //     formattedUrl: "https://www.cs.ubc.ca/~davet/music/.../CLUBANTH_201-05.html"
            //     htmlFormattedUrl: "https://www.cs.ubc.ca/~davet/music/.../CLUBANTH_201-05.html"
            //     htmlSnippet: "Song Information. Song Artist(s): Armand Van Helden Featuring Mita. Song Title: <br>↵Entra <b>Mi Casa</b> &middot; Year: 2001. Album Information. Album: Club Anthems 2001."
            //     htmlTitle: "Armand Van Helden Featuring Mita :: Entra <b>Mi Casa</b> <b>...</b>"
            //     kind: "customsearch#result"
            //     link: "https://www.cs.ubc.ca/~davet/music/track/CLUBANTH_201/CLUBANTH_201-05.html"
            //     snippet: "Song Information. Song Artist(s): Armand Van Helden Featuring Mita. Song Title: ↵Entra Mi Casa · Year: 2001. Album Information. Album: Club Anthems 2001."
            //     title: "Armand Van Helden Featuring Mita :: Entra Mi Casa ..."
            // }

            // <div class="web_result">
            //     < p class = "title" > < a href = "" > With zero coding experience, artist building 180 webpages... < /a></p >
            //     <p class="description">arstechnica.com/.../with-zero-coding-experience-artist...</p>
            //     <img src="app/images/ArrowGreen.png" />
            //     <p class="trad"><a href="">Traduire cette page</a></p>
            //     <p class="cont">117 days ago, having never done any programming in her life, Jennifer Dewalt <strong>built</strong> her first <strong>webpage</strong>. The next day, she <strong>built</strong> another, and she ...</p>
            // </div>
        },
        createImagesResultItem: function(data) {
            var imageResultsItem = this._createElement('a', null, this.components.imageResultsItems);
            imageResultsItem.classList.add('image_result');
            imageResultsItem.classList.add('image_link');
            imageResultsItem.href = data.link;
            var fEl = this._createElement('div', null, imageResultsItem);
            fEl.classList.add('image_container');
            fEl.style.width = data.image.thumbnailWidth + 'px';
            fEl.style.height = data.image.thumbnailHeight + 'px';
            fEl.style.backgroundImage = 'url(' + data.link + ')';

            var tooltip = this._createElement('span', null, fEl);
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

            // <div class="image_result">
            //     <a href="" > With zero coding experience, artist building 180 webpages...
            //     <p class="description">arstechnica.com/.../with-zero-coding-experience-artist...</p>
            //     </a>
            // </div>
        }

    };

    return UI;

});
