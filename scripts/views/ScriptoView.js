var Backbone = require('backbone');
var _ = require('underscore');
var $ = require('jquery');

var panZoom = require('../lib/jquery.panzoom.min');

//var jsPanZoom = require('../lib/jquery.jspanzoom');
//var zoom = require('../lib/e-smart-zoom-jquery');

module.exports = Backbone.View.extend({
	germanChars: [
		'Ä',
		'ä',
		'Ö',
		'ö',
		'Ü',
		'ü',
		'ß'
	],

	events: {
		'click .chars-links-container a': 'charsLinkClick',
		'click .view-buttons button': 'viewButtonClick'
	},

	charsLinkClick: function(event) {
		event.preventDefault();

		function setSelectionRange(input, selectionStart, selectionEnd) {
		  if (input.setSelectionRange) {
		    input.focus();
		    input.setSelectionRange(selectionStart, selectionEnd);
		  }
		  else if (input.createTextRange) {
		    var range = input.createTextRange();
		    range.collapse(true);
		    range.moveEnd('character', selectionEnd);
		    range.moveStart('character', selectionStart);
		    range.select();
		  }
		}

		function setCaretToPos (input, pos) {
		  setSelectionRange(input, pos, pos);
		}

		var scrollPos = this.textArea.scrollTop();

		var cursorPos = this.textArea.prop('selectionStart');
		var v = this.textArea.val();
		var textBefore = v.substring(0,  cursorPos);
		var textAfter  = v.substring(cursorPos, v.length);

		this.textArea.val(textBefore + $(event.currentTarget).data('char') + textAfter);

		setCaretToPos(this.textArea[0], cursorPos+1);

		this.textArea.blur();
		this.textArea.focus();
	},

	viewButtonClick: function(event) {
		event.preventDefault();

		console.log(this.$el)

		if ($(event.currentTarget).data('action') == 'side-view') {
			this.$el.addClass('side-view');
		}
		if ($(event.currentTarget).data('action') == 'vertical-view') {
			this.$el.removeClass('side-view');
		}
		if ($(event.currentTarget).data('action') == 'fullscreen') {
			this.$el.toggleClass('fullscreen-view');
		}
	},

	initialize: function() {
		this.textArea = this.$el.find('textarea[name="scripto_transcription"]');

		this.$el.find('.image-viewer .image-container').panzoom({
			panOnlyWhenZoomed: false,
			
			$zoomIn: this.$el.find('.zoom-in-button'),
			$zoomOut: this.$el.find('.zoom-out-button')
		});

		this.$el.find('.image-viewer').on('mousewheel.focal', _.bind(function(e) {
			e.preventDefault();
			var delta = e.delta || e.originalEvent.wheelDelta;
			var zoomOut = delta ? delta < 0 : e.originalEvent.deltaY > 0;
			this.$el.find('.image-viewer .image-container').panzoom('zoom', zoomOut, {
				increment: 0.1,
				animate: false,
				focal: e
			});
		}, this));

		var charsHtml = _.map(this.germanChars, function(char) {
			return '<a href="#" data-char="'+char+'">'+char+'</a>';
		});

		this.$el.find('.chars-links-container').html(charsHtml.join(' '));
	}
});
