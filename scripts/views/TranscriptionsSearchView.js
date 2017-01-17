var Backbone = require('backbone');
var $ = require('jquery');
var _ = require('underscore');

var DataCollection = require('../collections/DataCollection');
var TranscriptionThumbsView = require('./TranscriptionThumbsView');

module.exports = Backbone.View.extend({
	initialize: function(options) {
		this.options = options;
		this.collection = new DataCollection();
		this.collection.on('reset', this.render, this);

		this.collection.url = window.apiUrl+'/transcriptions/wp_search';
		this.collection.fetch({
			reset: true
		});

		this.renderUi();
	},

	events: {
		'click .search-button': 'searchButtonClick',
		'keydown .search-input': 'searchInputKeydown'
	},

	searchInputKeydown: function(event) {
		if (event.keyCode == 13) {
			this.searchButtonClick();
		}
	},

	searchButtonClick: function() {
		this.collection.url = window.apiUrl+'/transcriptions/wp_search/'+this.$el.find('.search-input').val();
		this.collection.fetch({
			reset: true
		});
	},

	renderUi: function() {
		var template = _.template($("#transcriptionSearchUITemplate").html());

		this.$el.html(template({}));
	},

	render: function() {
		this.$el.find('.list-container').html('');

		if (this.collection.length == 0) {
			this.$el.addClass('no-results');
		}
		else {
			var template = _.template($("#transcriptionSearchListTemplate").html());

			this.$el.find('.list-container').html(template({
				models: this.collection.models
			}));

			if (this.$el.find('.transcription-archive-thumbs').length > 0) {
				_.each(this.$el.find('.transcription-archive-thumbs'), function(archiveThumbs) {
					new TranscriptionThumbsView({
						el: $(archiveThumbs)
					});
				});
			}
		}
	}
});