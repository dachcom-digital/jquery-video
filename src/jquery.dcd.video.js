/*global window, $f, jQuery, YT, DM, document*/
/*jslint nomen: true*/

/**
 * @preserve
 *
 * jquery-video widget
 * Copyright 2015-2016 DACHCOM.DIGITAL AG
 *
 * @author Volker Andres
 * @author Marco Rieser
 * @see https://github.com/dachcom-digital/jquery-video
 * @license MIT
 * @version 0.3.1
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
        options: {
            classResponsive: 'responsive'
        },

        /**
         * Initialization of the video widget
         * Calls API specific widgets
         * @private
         */
        _create: function () {
            var self = this;

            switch (this.element.data('type')) {
                case 'youtube':
                    this.element.videoYoutube(this.options);
                    this._player = this.element.data('dcd-videoYoutube');
                    this.element.on('videoyoutubeready videoyoutubeplay videoyoutubepause videoyoutubeend', function (event, data) {
                        self._trigger(data.event, event, [data]);
                    });
                    break;
                case 'vimeo':
                    this.element.videoVimeo(this.options);
                    this._player = this.element.data('dcd-videoVimeo');
                    this.element.on('videovimeoready videovimeoplay videovimeopause videovimeoend', function (event, data) {
                        self._trigger(data.event, event, [data]);
                    });
                    break;
                case 'dailymotion':
                    this.element.videoDailymotion(this.options);
                    this._player = this.element.data('dcd-videoDailymotion');
                    this.element.on('videodailymotionready videodailymotionplay videodailymotionpause videodailymotionend', function (event, data) {
                        self._trigger(data.event, event, [data]);
                    });
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
            this._autoplay = !!this.element.data('autoplay');
            this._rel = !!this.element.data('rel');
            this._playing = this._autoplay || false;
            this._responsive = this.element.data('responsive') !== false;

            if (this._responsive === true) {
                this.element.addClass(this.options.classResponsive);
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
        },

        /**
         * stops and unloads player
         * @private
         */
        _destroy: function () {
            this.element.off();
            this.element.removeAttr('style');
            this._player.destroy();
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

                    if (self._autoplay) {
                        self._params.autoplay = 1;
                    }

                    if (!self._rel) {
                        self._params.rel = 0;
                    }

                    self._player = new YT.Player(self.element.children(':first')[0], {
                        height: self._height,
                        width: self._width,
                        videoId: self._code,
                        playerVars: self._params,
                        events: {
                            onReady: function () {
                                self._trigger('ready', {}, [{type: 'youtube', event: 'ready'}]);
                            },
                            onStateChange: function (data) {
                                switch (window.parseInt(data.data, 10)) {
                                    case 0:
                                        self._playing = false;
                                        self._trigger('end', {}, [{type: 'youtube', event: 'end'}]);
                                        break;
                                    case 1:
                                        self._playing = true;
                                        self._trigger('play', {}, [{type: 'youtube', event: 'play'}]);
                                        break;
                                    case 2:
                                        self._playing = false;
                                        self._trigger('pause', {}, [{type: 'youtube', event: 'pause'}]);
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
            this._trigger('end', {}, [{type: 'youtube', event: 'end'}]);
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
            this.element.removeAttr('style');
            this.stop();
            this._player.destroy();
            this.element.off().empty();
        }
    });

    $.widget('dcd.videoVimeo', $.dcd.video, {
        /**
         * Initialize the Vimeo widget
         * @private
         */
        _create: function () {
            var self = this;

            this._initialize();

            var timestamp = new Date().getTime(),
                additionalParams = '';

            if (this._autoplay) {
                additionalParams += '&autoplay=1';
            }

            this.element.append(
                $('<iframe/>')
                    .attr('frameborder', 0)
                    .attr('id', 'vimeo' + this._code + timestamp)
                    .attr('width', this._width)
                    .attr('height', this._height)
                    .attr('src', document.location.protocol + '//player.vimeo.com/video/' + this._code + '?api=1&player_id=vimeo' + this._code + timestamp + additionalParams)
            );
            this._player = $f(this.element.children(":first")[0]);

            // Froogaloop throws error without a registered ready event
            this._player.addEvent('ready', function () {
                self._trigger('ready', {}, [{type: 'vimeo', event: 'ready'}]);

                self._player.addEvent('play', function () {
                    self._playing = true;
                    self._trigger('play', {}, [{type: 'vimeo', event: 'play'}]);
                });
                self._player.addEvent('pause', function () {
                    self._playing = false;
                    self._trigger('pause', {}, [{type: 'vimeo', event: 'pause'}]);
                });
                self._player.addEvent('finish', function () {
                    self._playing = false;
                    self._trigger('end', {}, [{type: 'vimeo', event: 'end'}]);
                });
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
            this._trigger('end', {}, [{type: 'vimeo', event: 'end'}]);
        },

        /**
         * Playing command for Vimeo
         */
        playing: function () {
            return this._playing;
        },

        /**
         * stops and unloads player
         * @private
         */
        _destroy: function () {
            this.element.removeAttr('style');
            this.stop();
            this.element.off().empty();
        }
    });

    $.widget('dcd.videoDailymotion', $.dcd.video, {
        /**
         * property for detecting the stop of a video
         */
        _stopping: false,

        /**
         * Initialization of the Dailymotion widget
         * @private
         */
        _create: function () {
            var self = this;
            this._initialize();

            if (self._autoplay) {
                self._params.autoplay = 1;
            }
            if (!self._rel) {
                self._params.related = 0;
            }
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
                        params: self._params
                    });

                    self._player.addEventListener('apiready', function () {
                        self._trigger('ready', {}, [{type: 'dailymotion', event: 'ready'}]);
                    });
                    self._player.addEventListener('play', function () {
                        self._playing = true;
                        self._trigger('play', {}, [{type: 'dailymotion', event: 'play'}]);
                    });
                    self._player.addEventListener('pause', function () {
                        self._playing = false;
                        if (self._stopping === true) {
                            self._stopping = false;
                            return;
                        }
                        self._trigger('pause', {}, [{type: 'dailymotion', event: 'pause'}]);
                    });
                    self._player.addEventListener('end', function () {
                        self._playing = false;
                        self._trigger('end', {}, [{type: 'dailymotion', event: 'end'}]);
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
            if (this.playing()) {
                this._stopping = true;
                this._player.pause();
                this._player.seek(0);
            }
            this._playing = false;
            this._trigger('end', {}, [{type: 'dailymotion', event: 'end'}]);
        },

        /**
         * Playing command for Dailymotion
         */
        playing: function () {
            return this._playing;
        },

        /**
         * stops and unloads player
         * @private
         */
        _destroy: function () {
            this.element.removeAttr('style');
            this.stop();
            this.element.off().empty();
        }
    });
}(jQuery));
