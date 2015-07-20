/*global window, $f, jQuery, YT, DM, document*/
/*jslint nomen: true*/

/**
 * jquery-video widget
 * Copyright 2015 DACHCOM.DIGITAL AG
 * @author Volker Andres, Marco Rieser
 * @see https://github.com/dachcom-digital/jquery-video
 * @version 0.2.0
 */
(function ($) {
    'use strict';

    /**
     * Small helper object for registering video apis
     */
    var videoRegister = {
        /**
         *
         */
        _register: {},

        /**
         * Checks, if api is already registered
         *
         * @param api
         * @returns {boolean}
         */
        isRegistered: function (api) {
            return this._register[api] !== undefined;
        },

        /**
         * Checks, if api is loaded
         *
         * @param api
         * @returns {boolean}
         */
        isLoaded: function (api) {
            return this._register[api] !== undefined && this._register[api] === true;
        },

        /**
         * Register new video api
         * @param api
         * @param loaded
         */
        register: function (api, loaded) {
            loaded = loaded || false;
            this._register[api] = loaded;
        }
    };

    $.widget('dcd.video', {
        /**
         * Initialization of the video widget
         * Calls API specific widgets
         * @private
         */
        _create: function () {
            switch (this.element.data('type')) {
                case 'youtube':
                    this.element.videoYoutube();
                    this._player = this.element.data('dcdVideoYoutube');
                    break;
                case 'vimeo':
                    this.element.videoVimeo();
                    this._player = this.element.data('dcdVideoVimeo');
                    break;
                case 'dailymotion':
                    this.element.videoDailymotion();
                    this._player = this.element.data('dcdVideoDailymotion');
                    break;
                default:
                    throw {
                        name: 'Video Error',
                        message: 'Unknown video type',
                        toString: function () {
                            return this.name + ": " + this.message;
                        }
                    };
            }
        },

        /**
         * Initializes variables
         * @private
         */
        _initialize: function () {
            this._params = this.element.data('params') || {};
            this._code = this.element.data('code');
            this._width = this.element.data('width');
            this._height = this.element.data('height');
            this._autoplay = this.element.data('autoplay');

            this._playing = this._autoplay || false;

            this._responsive = true;

            if (this.element.data('responsive') === false) {
                this._responsive = false;
            }

            if (this._responsive === true) {
                this.element.addClass('responsive');
            }

            this._calculateRatio();
        },

        /**
         * Abstract play command
         */
        play: function () {
            this._player.play();
        },

        /**
         * Abstract pause command
         */
        pause: function () {
            this._player.pause();
        },

        /**
         * Abstract stop command
         */
        stop: function () {
            this._player.stop();
        },

        /**
         * Abstract playing command
         */
        playing: function () {
            return this._player.playing();
        },

        /**
         * Calculates ratio for responsive videos
         * @private
         */
        _calculateRatio: function () {
            if (!this._responsive) {
                return;
            }
            this.element.css('paddingBottom', (this._height / this._width * 100) + '%');
        }
    });

    $.widget('dcd.videoYoutube', $.dcd.video, {
        /**
         * Initialization of the Youtube widget
         * @private
         */
        _create: function () {
            var self = this;
            this._initialize();

            this.element.append('<div/>');

            this._on(window, {
                'youtubeapiready': function () {
                    if (self._player !== undefined) {
                        return;
                    }

                    self._params.autoplay = self._autoplay;

                    self._player = new YT.Player(self.element.children(':first')[0], {
                        height: self._height,
                        width: self._width,
                        videoId: self._code,
                        playerVars: self._params,
                        events: {
                            onStateChange: function (data) {
                                switch (window.parseInt(data.data, 10)) {
                                    case 1:
                                        self._playing = true;
                                        break;
                                    default:
                                        self._playing = false;
                                        break;
                                }

                                self._trigger('statechange', {}, data);
                            }
                        }

                    });
                }
            });

            this._loadApi();
        },

        /**
         * Loads Youtube API and triggers event, when loaded
         * @private
         */
        _loadApi: function () {
            if (videoRegister.isRegistered('youtube')) {
                if (videoRegister.isLoaded('youtube')) {
                    $(window).trigger('youtubeapiready');
                }
                return;
            }
            videoRegister.register('youtube');

            var element = document.createElement('script'),
                scriptTag = document.getElementsByTagName('script')[0];

            element.async = true;
            element.src = document.location.protocol + "//www.youtube.com/iframe_api";
            scriptTag.parentNode.insertBefore(element, scriptTag);

            window.onYouTubeIframeAPIReady = function () {
                $(window).trigger('youtubeapiready');
                videoRegister.register('youtube', true);
            };
        },

        /**
         * Play command for Youtube
         */
        play: function () {
            this._player.playVideo();
            this._playing = true;
        },

        /**
         * Pause command for Youtube
         */
        pause: function () {
            this._player.pauseVideo();
            this._playing = false;
        },

        /**
         * Stop command for Youtube
         */
        stop: function () {
            this._player.stopVideo();
            this._playing = false;
        },

        /**
         * Playing command for Youtube
         */
        playing: function () {
            return this._playing;
        },

        /**
         * stops and unloads player
         * @private
         */
        _destroy: function () {
            this.stop();
            this._player.destroy();
        }
    });

    $.widget('dcd.videoVimeo', $.dcd.video, {
        /**
         * Initialize the Vimeo widget
         * @private
         */
        _create: function () {
            this._initialize();

            var timestamp = new Date().getTime();

            this.element.append(
                $('<iframe/>')
                    .attr('frameborder', 0)
                    .attr('id', 'vimeo' + this._code + timestamp)
                    .attr('width', this._width)
                    .attr('height', this._height)
                    .attr('src', 'http://player.vimeo.com/video/' + this._code + '?api=1&player_id=vimeo' + this._code + timestamp + '&autoplay=' + this._autoplay)
            );
            this._player = $f(this.element.children(":first")[0]);

            // Froogaloop throws error without a registered ready event
            this._player.addEvent('ready', function () {
            });
        },

        /**
         * Play command for Vimeo
         */
        play: function () {
            this._player.api('play');
            this._playing = true;
        },

        /**
         * Pause command for Vimeo
         */
        pause: function () {
            this._player.api('pause');
            this._playing = false;
        },

        /**
         * Stop command for Vimeo
         */
        stop: function () {
            this._player.api('unload');
            this._playing = false;
        },

        /**
         * Playing command for Vimeo
         */
        playing: function () {
            return this._playing;
        }
    });

    $.widget('dcd.videoDailymotion', $.dcd.video, {
        /**
         * Initialization of the Dailymotion widget
         * @private
         */
        _create: function () {
            var self = this;
            this._initialize();

            self._params.autoplay = self._autoplay;

            this.element.append('<div/>');

            this._on(window, {
                'dailymotionapiready': function () {
                    if (self._player !== undefined) {
                        return;
                    }
                    self._player = DM.player(self.element.children(':first')[0], {
                        height: self._height,
                        width: self._width,
                        video: self._code,
                        params: self.params
                    });
                }
            });

            this._loadApi();
        },

        /**
         * Loads Dailymotion API and triggers event, when loaded
         * @private
         */
        _loadApi: function () {
            if (videoRegister.isRegistered('dailymotion')) {
                if (videoRegister.isLoaded('dailymotion')) {
                    $(window).trigger('dailymotionapiready');
                }
                return;
            }
            videoRegister.register('dailymotion');

            var element = document.createElement('script'),
                scriptTag = document.getElementsByTagName('script')[0];

            element.async = true;
            element.src = document.location.protocol + '//api.dmcdn.net/all.js';

            scriptTag.parentNode.insertBefore(element, scriptTag);

            window.dmAsyncInit = function () {
                $(window).trigger('dailymotionapiready');
                videoRegister.register('dailymotion', true);
            };
        },

        /**
         * Play command for Dailymotion
         */
        play: function () {
            this._player.play();
            this._playing = true;
        },

        /**
         * Pause command for Dailymotion
         */
        pause: function () {
            this._player.pause();
            this._playing = false;
        },

        /**
         * Stop command for Dailymotion
         */
        stop: function () {
            this._player.pause();
            this._playing = false;
        },

        /**
         * Playing command for Dailymotion
         */
        playing: function () {
            return this._playing;
        }
    });
}(jQuery));
