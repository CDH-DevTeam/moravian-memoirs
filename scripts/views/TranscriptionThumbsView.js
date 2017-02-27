var Backbone = require('backbone');
var _ = require('underscore');
var $ = require('jquery');

module.exports = Backbone.View.extend({

	initialize: function() {
		this.isSinglePage = this.$el.hasClass('post-transcriptions');
		this.thumbsEls = this.isSinglePage ? this.$el.find('a') : this.$el.find('.thumb');

		this.pageId = this.$el.data('id');

		_.each(this.thumbsEls, _.bind(function(thumb) {
			var imageId = this.isSinglePage ? $(thumb).data('image') : $(thumb).data('id');
			var pageId = this.isSinglePage ? $(thumb).data('post') : this.pageId;

			var model = new Backbone.Model();
			model.url = window.mediaWikiUrl;
			model.on('change', _.bind(function() {
				if (!model.get('query').pages['-1']) {
					$(thumb).append('<div class="transcription-indicator green"></div>');
				}
			}, this));

			model.fetch({
				data: {				
					action: 'query',
					titles: this.encodeBaseTitle(imageId, pageId),
					prop: 'revisions',
					format: 'json',
					rvprop: 'content'
				}
			});
		}, this));
	},

	encodeBaseTitle: function(documentId, pageId) {
		var base64UrlEncode = function(str) {
			return btoa(str).replace(/=/g, '');
		}

		return '.'+pageId+'.'+documentId;
	}
});
