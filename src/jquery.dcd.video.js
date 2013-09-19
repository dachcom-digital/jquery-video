/*global window, $f, jQuery, YT*/
/*jslint nomen: true*/

/**
 * jquery-video widget
 * Copyright 2013 DACHCOM.DIGITAL AG
 * @author Volker Andres
 * @see https://github.com/dachcom-digital/jquery-video
 */
(function ($) {
    'use strict';

    $.widget('dcd.video', {
        /**
         * Initialization of the video widget
         * Calls API specific widgets
         * @private
         */
        _init: function () {
            switch (this.element.data('type')) {
            case 'youtube':
                this.element.videoYoutube();
                this._player = this.element.data('dcdVideoYoutube');
                break;
            case 'vimeo':
                this.element.videoVimeo();
                this._player = this.element.data('dcdVideoVimeo');
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
            this._playing = false;

            this._code = this.element.data('code');
            this._width = this.element.data('width');
            this._height = this.element.data('height');

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
        _init: function () {
            this._initialize();
            this.element.append('<div/>');

            this._player = new YT.Player(this.element.children(':first')[0], {
                height: this._height,
                width: this._width,
                playerVars: { 'autoplay': 0, 'controls': 1 },
                videoId: this._code
            });
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
        }
    });

    $.widget('dcd.videoVimeo', $.dcd.video, {
        /**
         * Initialize the Vimeo widget
         * @private
         */
        _init: function () {
            this._initialize();

            this.element.append(
                $('<iframe/>')
                    .attr('frameborder', 0)
                    .attr('id', 'vimeo' + this.element.data('code'))
                    .attr('width', this._width)
                    .attr('height', this._height)
                    .attr('src', 'http://player.vimeo.com/video/' + this.element.data('code') + '?api=1&player_id=vimeo' + this.element.data('code'))
            );
            this._player = $f(this.element.children(":first")[0]);
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
}(jQuery));
