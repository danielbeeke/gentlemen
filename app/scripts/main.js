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
    },
    facebook: {
      appId: '416165065177712',
      accessToken: '416165065177712|8xxchCfRQlqeD4IDfC56eJH24Wo'
    }
  }

  var functions = {
    // Init.
    init: function () {
      functions.getPicasaFeedToBackstretch()
      functions.initFacebook()
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
    initFacebook: function () {

      $.getJSON('https://graph.facebook.com/gentlemenmusicnl/events?access_token=' + settings.facebook.accessToken, function (json) {
        functions.createEvents(json.data)
      })

      $.getJSON('https://graph.facebook.com/gentlemenmusicnl/posts?access_token=' + settings.facebook.accessToken, function (json) {
        functions.createPosts(json.data)
      })

    },
    createEvents: function (events) {
      $.each(events, function (index, event) {
        console.log(event)
        $('#tour').append(templates.event.render(event))
      })
    },
    createPosts: function (posts) {
      $.each(posts, function (index, post) {
        if (post.picture) {
          post.mediumPicture = post.picture.replace('_s.jpg', '_n.jpg')
        }

        if (post.message) {
          $('#blogs').append(templates.post.render(post))
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
    event: twig({data: '<article class="event">' +
      '<div class="meta">' +
      '<div class="date-wrapper">' +
      '<span class="day">{{ start_time | date("j") }}</span> ' +
      '<span class="month">{{ start_time | date("M") }}</span>' +
      '</div>' +
      '</div>' +
      '<div class="content">' +
      '<a class="event-link" target="_blank" href="http://facebook.com/{{ id }}">{{ name }}</a>' +
      '</div>' +
      '</article>'}),

    post: twig({data: '<article class="post">' +
      '<div class="meta">' +
      '<div class="author"><img src="https://graph.facebook.com/{{ from.id }}/picture"></div>' +
      '<div class="date-wrapper">' +
      '<span class="day">{{ created_time | date("j") }}</span> ' +
      '<span class="month">{{ created_time | date("M") }}</span>' +
      '</div>' +
      '</div>' +
      '<div class="content">' +
      '<p>{{ message }}</p>' + 
      '{% if mediumPicture %}' +
      '<img src="{{ mediumPicture }}" />' +
      '{% endif %}' +
      '<a class="read-more" target="_blank" href="{{ link }}">Lees meer en reageer facebook</a>' +
      '</div>' +
      '</article>'})
  }

  functions.init()

})(jQuery);


          