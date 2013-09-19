/*global jQuery, describe, beforeEach, it, expect, window*/

/**
 * jquery-video widget test
 * Copyright 2013 DACHCOM.DIGITAL AG
 * @author Volker Andres
 * @see https://github.com/dachcom-digital/jquery-video
 */
(function ($) {
    'use strict';

    window.onYouTubeIframeAPIReady = function () {
        var videos = $('.video').video();

        describe("The video widget ", function () {
            it("should render a :dcd-video class on the containers", function () {
                expect(videos.filter(':dcd-video').length).toBe(videos.length);
            });

            it("should render a :dcd-videoYoutube class on the youtube containers", function () {
                expect(videos.filter(':dcd-videoYoutube').length).toBe(videos.filter('[data-type="youtube"]').length);
            });

            it("should render a :dcd-videoVimeo class on the vimeo containers", function () {
                expect(videos.filter(':dcd-videoYoutube').length).toBe(videos.filter('[data-type="youtube"]').length);
            });

            it("should play the videos", function () {
                videos.video('play');

                $.each(videos, function () {
                    expect($(this).video('playing')).toBeTruthy();
                });
            });

            it("should pause the videos", function () {
                videos.video('play');
                videos.video('pause');

                $.each(videos, function () {
                    expect($(this).video('playing')).toBeFalsy();
                });
            });

            it("should stop the videos", function () {
                videos.video('play');
                videos.video('stop');

                $.each(videos, function () {
                    expect($(this).video('playing')).toBeFalsy();
                });
            });
        });
    };
}(jQuery));
