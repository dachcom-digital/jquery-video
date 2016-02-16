/*global jQuery, describe, beforeEach, it, expect, window, waitsFor, waits*/

/**
 * jquery-video widget test
 * Copyright 2013-2016 DACHCOM.DIGITAL AG
 * @author Volker Andres
 * @see https://github.com/dachcom-digital/jquery-video
 */
(function ($) {
    'use strict';

    $(function () {
        describe("The video widget", function () {
            var videos;

            beforeEach(function (done) {
                videos = $('.video:not([data-autoplay=true])').video();
                setTimeout(function () {
                    done();
                }, 1000);
            });

            afterAll(function () {
                videos.video('destroy');
                videos = undefined;
            });

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
                }).toThrow();
            });
        });

        describe("The Youtube video widget", function () {
            var videos;

            beforeEach(function (done) {
                videos = $('.video[data-type="youtube"]').video();
                setTimeout(function () {
                    done();
                }, 1000);
            });

            afterAll(function () {
                videos.video('destroy');
                videos = undefined;
            });

            it("should play automatically", function (done) {
                var video = $('[data-autoplay=true]:dcd-videoYoutube');
                expect(video.video('playing')).toBeTruthy();
                setTimeout(function () {
                    video.video('pause');
                    done();
                }, 1000);
            });

            it("should append the rel property if configured", function () {
                var video = $(':not([data-rel=true]):dcd-videoYoutube');
                expect(video.find('iframe').attr('src')).toMatch('rel=0');
            });

            it("should not append the rel property if configured", function () {
                var video = $('[data-rel=true]:dcd-videoYoutube');
                expect(video.find('iframe').attr('src')).not.toMatch('rel=0');
            });

            it("should play the videos", function () {
                var video = $(':dcd-videoYoutube');
                video.video('play');
                expect(video.video('playing')).toBeTruthy();
            });

            it("should pause the videos", function () {
                var video = $(':dcd-videoYoutube');
                video.video('play');
                video.video('pause');
                expect(video.video('playing')).toBeFalsy();
            });

            it("should stop the videos", function () {
                var video = $(':dcd-videoYoutube');
                video.video('play');
                video.video('stop');
                expect(video.video('playing')).toBeFalsy();
            });

        });

        describe("The Vimeo video widget", function () {
            var videos;

            beforeEach(function (done) {
                videos = $('.video[data-type="vimeo"]').video();
                setTimeout(function () {
                    done();
                }, 1000);
            });

            afterAll(function () {
                videos.video('destroy');
                videos = undefined;
            });

            it("should play automatically", function () {
                var video = $('[data-autoplay=true]:dcd-videoVimeo');
                expect(video.video('playing')).toBeTruthy();
                video.video('pause');
            });

            it("should play the videos", function () {
                var video = $(':dcd-videoVimeo');
                video.video('play');
                expect(video.video('playing')).toBeTruthy();
            });

            it("should pause the videos", function () {
                var video = $(':dcd-videoVimeo');
                video.video('play');
                video.video('pause');
                expect(video.video('playing')).toBeFalsy();
            });

            it("should stop the videos", function () {
                var video = $(':dcd-videoVimeo');
                video.video('play');
                video.video('stop');
                expect(video.video('playing')).toBeFalsy();
            });
        });

        describe("The Dailymotion video widget", function () {
            var videos;

            beforeEach(function (done) {
                videos = $('.video[data-type="dailymotion"]').video();
                setTimeout(function () {
                    done();
                }, 2000);
            });

            afterAll(function () {
                videos.video('destroy');
                videos = undefined;
            });

            it("should play automatically", function () {
                var video = $('[data-autoplay=true]:dcd-videoDailymotion');
                expect(video.video('playing')).toBeTruthy();
                video.video('pause');
            });

            it("should append the rel property if configured", function () {
                var video = $(':not([data-rel=true]):dcd-videoDailymotion');
                expect(video.find('iframe').attr('src')).toMatch('related=0');
            });

            it("should not append the rel property if configured", function () {
                var video = $('[data-rel=true]:dcd-videoDailymotion');
                expect(video.find('iframe').attr('src')).not.toMatch('related=0');
            });

            it("should play the videos", function () {
                var video = $(':dcd-videoDailymotion');
                video.video('play');
                expect(video.video('playing')).toBeTruthy();
            });

            it("should pause the videos", function () {
                var video = $(':dcd-videoDailymotion');
                video.video('play');
                video.video('pause');
                expect(video.video('playing')).toBeFalsy();
            });

            it("should stop the videos", function () {
                var video = $(':dcd-videoDailymotion');
                video.video('play');
                video.video('stop');
                expect(video.video('playing')).toBeFalsy();
            });
        });
    });
}(jQuery));
