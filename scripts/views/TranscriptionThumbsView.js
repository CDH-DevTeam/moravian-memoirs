var Backbone = require('backbone');
var _ = require('underscore');
var $ = require('jquery');

module.exports = Backbone.View.extend({
//	mediaWikiUrl: 'http://localhost/mediawiki_test/api.php',
	mediaWikiUrl: 'http://moravianlives.org/transcriptions/api.php',

	initialize: function() {
		this.thumbsEls = this.$el.find('.thumb');

		this.pageId = this.$el.data('id');

		_.each(this.thumbsEls, _.bind(function(thumb) {
			var imageId = $(thumb).data('id');

			var model = new Backbone.Model();
			model.url = this.mediaWikiUrl;
			model.on('change', _.bind(function() {
				if (model.get('query').pages['-1']) {
					console.log(this.encodeBaseTitle(imageId, this.pageId)+' has no revisions');
				}
				else {
					console.log(this.encodeBaseTitle(imageId, this.pageId)+' has revisions');

					$(thumb).append('<div class="indicator green"></div>');
				}
			}, this));

			model.fetch({
				data: {				
					action: 'query',
					titles: this.encodeBaseTitle(imageId, this.pageId),
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

		return '.'+base64UrlEncode(pageId)+'.'+base64UrlEncode(documentId);
	}
});
