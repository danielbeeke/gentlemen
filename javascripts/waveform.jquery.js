;(function ( $, window, document, undefined ) {
    var pluginName = "waveform",
        defaults = {
            redrawOnResize: true,
            waveformImageUrl: '',
            backgroundColor: 'transparent',
            foregroundColor: 'black',
        };

    function Plugin( element, options ) {
        this.element = element

        this.options = $.extend( {}, defaults, options)

        this._defaults = defaults
        this._name = pluginName

        this.init(this.element, this.options)
    }

    Plugin.prototype = {

        init: function(el, options) {
            var that = this

            $(el).addClass('waveform-initiated').append('<canvas>')

            this.updateSize(el, options)
            this.patchCanvasForIE(el, options)
            this.getAndSetCleanData(el, options)

            if (options.redrawOnResize) {
                var resizeTimeout

                $(window).resize(function () {
                    clearTimeout(resizeTimeout)

                    resizeTimeout = setTimeout(function () {
                        that.updateSize(el, options)
                        that.setInterpolateData(el, options)
                        that.redraw(el, options)
                    }, 200)
                })
            }
        },
        updateSize: function (el, options) {
            var height = parseInt($('canvas', el).height(), 10)
            var width = parseInt($('canvas', el).width(), 10)

            var canvas = $('canvas', el)[0]

            canvas.width = width
            canvas.height = height
        },
        getAndSetCleanData: function (el, options) {
            var that = this

            $.ajax({
                url: 'http://www.waveformjs.org/w',
                data: {
                    url: options.waveformImageUrl
                },
                dataType: 'JSONP',
                success: function (data) {
                    el.cleanData = data
                    that.setInterpolateData(el, options)
                    that.redraw(el, options)
                }
            })
        },
        redraw: function (el, options) {
            var canvas = $('canvas', el)[0]
            var context = canvas.getContext("2d")
            var height = parseInt($('canvas', el).height(), 10)
            var width = parseInt($('canvas', el).width(), 10)

            var d, i, middle, t, _i, _len, _ref, _results
            this.clear(el, options)
            context.fillStyle = options.foregroundColor;
            middle = height / 2;

            i = 0;
            _ref = el.interpolateData;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                d = _ref[_i];
                t = width / el.interpolateData.length;

                context.clearRect(t * i, middle - middle * d, t, middle * d * 2);
                context.fillRect(t * i, middle - middle * d, t, middle * d * 2);
                i++;
            }
        },
        setInterpolateData: function(el, options) {
            var width = parseInt($('canvas', el).width(), 10)

            var fitCount = width

            var after, atPoint, before, i, newData, springFactor, tmp;
            newData = new Array();
            springFactor = new Number((el.cleanData.length - 1) / (fitCount - 1));
            newData[0] = el.cleanData[0];
            i = 1;
            while (i < fitCount - 1) {
                tmp = i * springFactor;
                before = new Number(Math.floor(tmp)).toFixed();
                after = new Number(Math.ceil(tmp)).toFixed();
                atPoint = tmp - before;
                newData[i] = this.linearInterpolate(el.cleanData[before], el.cleanData[after], atPoint);
                i++;
            }
            newData[fitCount - 1] = el.cleanData[el.cleanData.length - 1];
            el.interpolateData = newData;
        },
        linearInterpolate: function(before, after, atPoint) {
            return before + (after - before) * atPoint;
        },
        patchCanvasForIE: function (el, options) {
            var canvas = $('canvas', el)[0]

            var oldGetContext;
            if (typeof window.G_vmlCanvasManager !== "undefined") {
                canvas = window.G_vmlCanvasManager.initElement(canvas);
                oldGetContext = canvas.getContext;
                return canvas.getContext = function(a) {
                    var ctx;
                    ctx = oldGetContext.apply(canvas, arguments);
                    canvas.getContext = oldGetContext;
                    return ctx;
                };
            }
        },
        clear: function (el, options) {
            var height = parseInt($('canvas', el).height(), 10)
            var width = parseInt($('canvas', el).width(), 10)

            var canvas = $('canvas', el)[0]
            var context = canvas.getContext("2d")

            context.fillStyle = options.backgroundColor;
            context.clearRect(0, 0, width, height);
            context.fillRect(0, 0, width, height);
        }
    };

    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName,
                new Plugin( this, options ));
            }
        });
    };

})( jQuery, window, document );
