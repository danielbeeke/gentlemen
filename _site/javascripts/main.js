(function ($) {

  var settings = {
    soundcloud: {
      user: 'daniel-beeke',
      key: 'd9083d7dfaae2205dc95628922df4da5'
    },
    picasa: {
      user: '101483921397620996759',
      albumId: '5939519178061989441',
      authKey: 'Gv1sRgCPOg19a6sv2kYA'
    }
  }

  var functions = {
    // Init.
    init: function () {
      functions.getPicasaFeedToBackstretch()
      // functions.initSoundCloud()
      functions.initMenu()
      functions.initScroller()
    },
    initMenu: function () {
      $('#switch-menu').click(function () {
        $('body').toggleClass('expanded-menu').toggleClass('collapsed-menu')
        return false
      })

      $('a.innerlink').click(function () {
        var id = $(this).attr('href')
        $('.panel:not(' + id + ')').removeClass('active')

        if ($(this).hasClass('active')) {
          $('a.innerlink.active').removeClass('active')
          $('a.innerlink[href="' + id + '"]').removeClass('active')
          $(id).removeClass('active')
        }
        else {
          $('a.innerlink.active').removeClass('active')
          $('a.innerlink[href="' + id + '"]').addClass('active')
          $(id).addClass('active')
        }

        $.backstretch("next")

        return false
      })
    },
    initScroller: function () {
      $(window).scroll(function () {
        if ($(window).scrollTop() > $('#logo').height()) {
          if (!$('body').hasClass('sticky-menu')) {
            $('body').addClass('sticky-menu')
          }
          // Only auto collapse menu on mobile.
          if ($(window).width() < 480 && $('body').hasClass('expanded-menu')) {
            $('body').removeClass('expanded-menu').addClass('collapsed-menu')
          }
        }
        else {
          if ($('body').hasClass('sticky-menu')) {
            $('body').removeClass('sticky-menu')
          }
        }
      })
    },
    initBackstretch: function (photos) {
      $.backstretch(photos, {
        duration: 3000,
        fade: 750
      })
    },
    getPicasaFeedToBackstretch: function () {
      var url = 'https://picasaweb.google.com/data/feed/base/user/' +
        settings.picasa.user +
        '/albumid/' +
        settings.picasa.albumId +
        '?alt=json&kind=photo&hl=nl&authkey=' +
        settings.picasa.authKey

      var photos = []

      $.ajax({
        url: url,
        success: function (feedData) {
          $.each(feedData.feed.entry, function (index, item) {
            var photoUrl = item.content.src
            var photoUrlExploded = photoUrl.split('/')
            var filename = photoUrlExploded.pop()

            photoUrlExploded.push('s1600')
            photoUrlExploded.push(filename)

            photoUrl = photoUrlExploded.join('/')

            photos.push(photoUrl)
          })

          functions.initBackstretch(photos)
        }
      })
    },
    initSoundCloud: function () {
      $.getScript('http://connect.soundcloud.com/sdk.js', function () {
        SC.initialize({
          client_id: settings.soundcloud.key
        })

        SC.get('/resolve', { url: 'https://soundcloud.com/' + settings.soundcloud.user + '/tracks' }, function(tracks) {
          $.each(tracks, function (index, track) {
            console.log(track)
          })
        })
      })
    }
  }

  var templates = {
    // template: twig({data: '<html>'})
  }

  functions.init()

})(jQuery);
