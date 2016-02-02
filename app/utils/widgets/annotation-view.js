define([
    'jquery',
    'codemirror',
    'bootstrap',
    'app/core/utils/widgets/jquery-widget'
], function ($, CodeMirror, _boot, _widget) {
    $.widget('app.annotationView', {
        options: {
            value: ''
        },
        _init: function() {
            this.element.html(this._template);
            this.editor = CodeMirror($('.content-viewer', this.element)[0], {
                value: this.options.value,
                mode: 'text/html',
                readOnly: true,
                lineNumbers: true,
                lineWrapping: true,
                viewportMargin: 2
            });
            this._createCanvas();
            this.editor.on('cursorActivity', function(instance) {
                var range = instance.doc.sel.ranges[0];
            });
            var self = this;
            this.editor.on('scroll', this.refresh.bind(this));
            this.refresh();
        },
        // Public Functions
        // =======================================
        batchAddAnnotations: function(arrayOfOptions) {
            var self = this;
            this.editor.operation(function() {
                for (var i = 0; i < arrayOfOptions.length; i++) {
                    // Ensure we don't refresh when batching
                    arrayOfOptions[i].refresh = false;
                    self.addAnnotation(arrayOfOptions[i]);
                }
            });
            self.refresh();
        },
        addAnnotation: function(options) {
            var settings = $.extend({
                title: '',
                start: 0,
                end: 0,
                className: 'default-annotation',
                refresh: true
            }, options);

            var from = this.editor.doc.posFromIndex(settings.start);
            var to = this.editor.doc.posFromIndex(settings.end);
            var mark = this.editor.markText(from, to, {
                title: settings.title,
                className: 'annotation-view-annotation' + ' ' + settings.className
            });
            mark.tooltipTitle = settings.title;
            if (settings.refresh)
                this.refresh();
        },
        hideLines: function(options) {
            var settings = $.extend({
                from: 0,
                to: 0,
            }, options);
            this.editor.markText({line:settings.from},{line:settings.to},{"collapsed": true, "inclusiveLeft": true, "inclusiveRight": true});
        },
        showAllLines: function() {
            var markArray = this.editor.getAllMarks();
            for(var i = 0; i < markArray.length; i++) {
                markArray[i].clear();
            }
        },
        refresh: function() {
            var self = this;
            this._clearCanvas();
            var marks = this.editor.doc.getAllMarks();
            this._colorViewport();
            // Render the annotation markers
            $.each(marks, function(i, mark) {
                if (!mark.color) {
                    var $tmp = $("<div>").appendTo(self.element).addClass(mark.className);
                    mark.color = $tmp.css("background-color");
                    $tmp.remove();
                }
                // Each mark may span multiple lines
                $.each(mark.lines, function(j, line) {
                    self._colorGutterLine(line.lineNo(), mark.color);
                });
            });
            $('.annotation-view-annotation', this.element).tooltip({ container: 'body' });
            this._setGutterWidth();
        },
        // Private Functions
        // =======================================
        _colorViewport: function() {
            this.ctx.fillStyle = '#DDD';
            var scrollInfo = this.editor.getScrollInfo();
            var canvasHeight = this.$canvas.height();

            var scaledTop = scrollInfo.top * canvasHeight / scrollInfo.height;
            var scaledHeight = scrollInfo.clientHeight * canvasHeight / scrollInfo.height;

            // Don't show the viewport if it takes up the whole document.
            if (scaledHeight === canvasHeight) return;
            this.ctx.fillRect(0, scaledTop, this.$canvas.width(), scaledHeight);
        },
        _colorGutterLine: function(lineNo, color) {
            this.ctx.fillStyle = color || '#000';
            var lineHandle = this.editor.getLineHandle(lineNo);
            var scrollInfo = this.editor.getScrollInfo();
            var canvasHeight = this.$canvas.height();

            var scaledTop = this.editor.heightAtLine(lineNo, 'local') * canvasHeight / scrollInfo.height;
            var scaledHeight = lineHandle.height * canvasHeight / scrollInfo.height;

            this.ctx.fillRect(0, Math.round(scaledTop), this.$canvas.width(), Math.ceil(scaledHeight));
        },
        _canvasClick: function(e) {
            var scrollInfo = this.editor.getScrollInfo();
            var fullTop = e.offsetY * scrollInfo.height / this.$canvas.height();
            var halfHeight = scrollInfo.clientHeight / 2; 
            this.editor.scrollTo(0, fullTop - halfHeight);
        },
        _getLineInfo: function() {
            var height = this.$canvas.height();
            var lines = this.editor.doc.lineCount();
            return {
                height: height,
                width: this.$canvas.width(),
                lines: lines,
                lineHeight: height / lines
            };
        },
        _clearCanvas: function() {
            this.ctx.clearRect(0, 0, this.$canvas.width(), this.$canvas.height());
        },
        _createCanvas: function() {
            var $parent = $('.viewport-gutter', this.element);
            this.$canvas = $('<canvas class="gutter-canvas" height="' + $parent.height() + '" width="' + $parent.width() + '"></canvas>')
                               .appendTo($parent);
            this.ctx = this.$canvas[0].getContext('2d');
            this.$canvas.click(this._canvasClick.bind(this));
        },
        _changeColor: function(color, percent) {
            var num = parseInt(color.slice(1),16), amt = Math.round(2.55 * percent), R = (num >> 16) + amt, G = (num >> 8 & 0x00FF) + amt, B = (num & 0x0000FF) + amt;
            return "#" + (0x1000000 + (R<255?R<1?0:R:255)*0x10000 + (G<255?G<1?0:G:255)*0x100 + (B<255?B<1?0:B:255)).toString(16).slice(1);
        },
        _setGutterWidth: function() {
            var lineCount = this.editor.lineCount();
            switch (true) {
                case (lineCount >= 1000):
                    $('.CodeMirror-linenumber').css("min-width", "28px");
                    break;
                case (lineCount >= 100):
                    $('.CodeMirror-linenumber').css("min-width", "24px");
                    break;
                default: 
                    $('.CodeMirror-linenumber').css("min-width", "20px");
            }
        },
        _template: [
            '<div class="annotation-viewer">',
                '<div class="content-viewer"></div>',
                '<div class="viewport-gutter"></div>',
            '</div>'
        ].join('')
    });
});
