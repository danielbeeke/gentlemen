(function ($) {

  var settings = {
    soundcloud: {
      user: 'daniel-beeke',
      key: 'd9083d7dfaae2205dc95628922df4da5'
    }
  }

  var functions = {
    // Init.
    init: function () {
      SC.initialize({
        client_id: settings.soundcloud.key
      })

      SC.get('/resolve', { url: 'https://soundcloud.com/' + settings.soundcloud.user + '/tracks' }, function(tracks) {
        $.each(tracks, function (index, track) {
          $('#songs').append(templates.track.render(track))

          $('.waveform', '#track-' + track.id).waveform({
            waveformImageUrl: track.waveform_url,
          })

        })
      })

    },
  }

  var templates = {
    track: twig({
      data:
      '<div id="track-{{ id }}">' +
        '<h3>{{ title }}</h3>' +
        '<div class="waveform"></div>' +
      '</div>'
    })
  }

  functions.init()

})(jQuery);
