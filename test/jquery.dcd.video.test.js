/*global jQuery, describe, beforeEach, it, expect, window, waitsFor, waits*/

/**
 * jquery-video widget test
 * Copyright 2013 DACHCOM.DIGITAL AG
 * @author Volker Andres
 * @see https://github.com/dachcom-digital/jquery-video
 */
(function ($) {
    'use strict';

    $(function () {
        var videos = $('.video').video();

        describe("The video widget", function () {
            it("should render a :dcd-video class on the containers", function () {
                expect(videos.filter(':dcd-video').length).toBe(videos.length);
            });

            it("should render a :dcd-videoYoutube class on the Youtube containers", function () {
                expect(videos.filter(':dcd-videoYoutube').length).toBe(videos.filter('[data-type="youtube"]').length);
            });

            it("should render a :dcd-videoVimeo class on the Vimeo containers", function () {
                expect(videos.filter(':dcd-videoVimeo').length).toBe(videos.filter('[data-type="vimeo"]').length);
            });

            it("should render a :dcd-videoDailymotion class on the Dailymotion containers", function () {
                expect(videos.filter(':dcd-videoDailymotion').length).toBe(videos.filter('[data-type="dailymotion"]').length);
            });

            it("should throw an exception, when configuring a wrong video type", function () {
                expect(function () {
                    $('.video-exception').video();
                }).toThrow('Unknown video type');
            });
        });

        describe("The Youtube video widget", function () {
            var loaded = false;
            $(window).on('youtubeapiready', function () {
                loaded = true;
            });

            waitsFor('API to be loaded', function () {
                return loaded;
            }, 2000);

            it("should play the videos", function () {
                var video = $(':dcd-videoYoutube');
                video.video('play');
                waits(2000);
                expect(video.video('playing')).toBeTruthy();
            });

            it("should pause the videos", function () {
                var video = $(':dcd-videoYoutube');
                video.video('play');
                waits(1000);
                video.video('pause');
                expect(video.video('playing')).toBeFalsy();
            });

            it("should stop the videos", function () {
                var video = $(':dcd-videoYoutube');
                video.video('play');
                waits(1000);
                video.video('stop');
                expect(video.video('playing')).toBeFalsy();
            });
        });

        describe("The Vimeo video widget", function () {
            it("should play the videos", function () {
                var video = $(':dcd-videoVimeo');
                video.video('play');
                waits(1000);
                expect(video.video('playing')).toBeTruthy();
            });

            it("should pause the videos", function () {
                var video = $(':dcd-videoVimeo');
                video.video('play');
                waits(1000);
                video.video('pause');
                expect(video.video('playing')).toBeFalsy();
            });

            it("should stop the videos", function () {
                var video = $(':dcd-videoVimeo');
                video.video('play');
                waits(1000);
                video.video('stop');
                expect(video.video('playing')).toBeFalsy();
            });
        });

        describe("The Dailymotion video widget", function () {
            var loaded = false;
            $(window).on('dailymotionapiready', function () {
                loaded = true;
            });

            waitsFor('API to be loaded', function () {
                return loaded;
            }, 2000);

            it("should play the videos", function () {
                var video = $(':dcd-videoDailymotion');
                video.video('play');
                waits(5000); // dailymotion loads extremly slow
                expect(video.video('playing')).toBeTruthy();
            });

            it("should pause the videos", function () {
                var video = $(':dcd-videoDailymotion');
                video.video('play');
                waits(1000);
                video.video('pause');
                expect(video.video('playing')).toBeFalsy();
            });

            it("should stop the videos", function () {
                var video = $(':dcd-videoDailymotion');
                video.video('play');
                waits(1000);
                video.video('stop');
                expect(video.video('playing')).toBeFalsy();
            });
        });
    });
}(jQuery));
