jquery-video
============

[![Join the chat at https://gitter.im/dachcom-digital/jquery-video](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/dachcom-digital/jquery-video?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
Unifies the iframe APIs of Youtube, Vimeo and Dailymotion. Build as responsive jQuery UI widget.

Features
============
- Play, Pause and Stop command
- for Youtube, Vimeo and Dailymotion Player
- supports >=IE8, Firefox, Chrome, Safari, Opera
- Responsive with CSS inspired by http://alistapart.com/article/creating-intrinsic-ratios-for-video

Demo
============
Demo can be found here: http://jquery-video.dachcom.ch/demo/

You can also checkout the project and open the index.html in the demo folder (use a webserver).

Dependencies
============
- jQuery: http://jquery.com/
- jQuery UI Widget: http://jqueryui.com/
- Vimeo API (Froogaloop2): https://github.com/vimeo/player-api/tree/master/javascript
- Youtube API: https://developers.google.com/youtube/iframe_api_reference
- Dailymotion API: http://www.dailymotion.com/doc/api/player.html
- Jasmine (Testing): http://pivotal.github.io/jasmine/

Installation
============

```html
<!-- 1. Place containers with data attributes for configuration -->
<div class="container">
    <div class="video" data-type="vimeo" data-code="29950141" data-width="500" data-height="280"></div>
    <div class="video" data-type="youtube" data-autoplay="true" data-code="ubKinQvpc6w" data-responsive="false" data-width="960" data-height="720"></div>
    <div class="video" data-type="dailymotion" data-code="x14b8od" data-width="500" data-height="280"></div>
</div>

<!-- 2. Include libraries -->
<script src="../lib/jquery.js" type="text/javascript"></script>
<script src="../lib/jquery.ui.widget.js" type="text/javascript"></script>
<script src="../lib/froogaloop.js" type="text/javascript"></script>

<!-- 3. Include widget -->
<script src="../src/jquery.dcd.video.js" type="text/javascript"></script>

<!-- 4. Bind widget to containers -->
<script type="text/javascript">
    $(function () {
        $('.video').video();
    });
</script>
```

Options
============

- **type**: API used `[Required:(youtube|vimeo|dailymotion)]`
- **code**: the video code `[Required]`
- **width**: the width of the video `[Required:Integer]`
- **height**: the height of the video `[Required:Integer]`
- **responsive**: should the video be included responsively `[Optional:(true|false), Default:true]`
- **autoplay**: should the video play automatically `[Optional:(true|false), Default:false]`
- **rel**: should the player suggest related videos when video ends `[Optional:(true|false), Default:false]`

Methods
============
- **play**: play video
- **pause**: pause video
- **stop**: stop video
- **playing**: returns status of video

Examples
------------
```javascript
     $(':dcd-videoYoutube').video('play'); // plays all youtube videos
     $('[data-type="youtube"]').video('play'); // plays also all youtube videos
     $('.video').video('pause'); // pauses all videos with class video
     $('[data-code="29950141"]').video('play'); // plays video with code 29950141
     $('.video').video('stop'); // stops all videos with class video
     $('[data-code="29950141"]').video('playing'); // returns true when video is playing, false if video is paused
```

Wishlist
============
- find better way to include and initialize youtube api
- find better way for video factory and inheritance
- include full test suite
- make 'responsive' class configurable
- implement more API commands
- implement more APIs (<del>Dailymotion</del>, MyVideo, ...)

Known Issues
============
- Youtube and Dailymotion API are throwing exceptions
- <del>You can't have more than one Vimeo video with the same code on one page</del>
