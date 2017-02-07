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

		this.collection.url = window.apiUrl+'transcriptions/wp_search';
		this.collection.fetch({
			reset: true
		});

		this.renderUi();

		this.languageSelect = this.$el.find('.search-language');

		var languageCollection = new Backbone.Collection();
		languageCollection.url = window.wpRestApiUrl+'memoir-language';
		languageCollection.on('reset', _.bind(function() {
			_.each(languageCollection.models, _.bind(function(model) {
				this.languageSelect.append('<option value="'+model.get('id')+'" data-slug="'+model.get('slug')+'">'+model.get('name')+'</option>');
			}, this));
		}, this));

		languageCollection.fetch({
			reset: true
		});

		this.countrySelect = this.$el.find('.search-country');

		var countryCollection = new Backbone.Collection();
		countryCollection.url = window.wpRestApiUrl+'memoir-countries';
		countryCollection.on('reset', _.bind(function() {
			_.each(countryCollection.models, _.bind(function(model) {
				this.countrySelect.append('<option value="'+model.get('id')+'" data-slug="'+model.get('slug')+'">'+model.get('name')+'</option>');
			}, this));
		}, this));

		countryCollection.fetch({
			reset: true
		});

		this.archiveSelect = this.$el.find('.search-archive');

		var archiveCollection = new Backbone.Collection();
		archiveCollection.url = window.wpRestApiUrl+'memoir-archive';
		archiveCollection.on('reset', _.bind(function() {
			_.each(archiveCollection.models, _.bind(function(model) {
				this.archiveSelect.append('<option value="'+model.get('id')+'" data-slug="'+model.get('slug')+'">'+model.get('name')+'</option>');
			}, this));
		}, this));

		archiveCollection.fetch({
			reset: true
		});
	},

	events: {
		'click .search-button': 'searchButtonClick',
		'keydown .search-input': 'searchInputKeydown',
		'change select': 'selectChangeHandler'
	},

	searchInputKeydown: function(event) {
		if (event.keyCode == 13) {
			this.searchButtonClick();
		}
	},

	searchButtonClick: function() {
		this.collection.url = window.apiUrl+'transcriptions/wp_search/'+(this.$el.find('.search-input').val() != '' ? 'search/'+this.$el.find('.search-input').val() : '');
		this.collection.fetch({
			reset: true
		});
		this.$el.find('select').val('all');

		this.searchUpdated();
	},

	selectChangeHandler: function(event) {
		var currentClass = $(event.currentTarget).attr('class');

		this.$el.find('select:not(.'+currentClass+')').val('all');

		this.$el.find('.search-input').val('');

		this.collection.url = window.apiUrl+'transcriptions/wp_search/'+$(event.currentTarget).data('search-key')+'/'+$(event.currentTarget).val();
		this.collection.fetch({
			reset: true
		});

		this.searchUpdated();
	},

	searchUpdated: function() {
		var showAllButton = this.$el.find('.show-all-button');

		if (this.$el.find('select.search-language').val() != 'all') {

			showAllButton.attr('href', window.wpUrl+'memoirs/language/'+this.$el.find('select.search-language').find(':selected').data('slug'))
			showAllButton.text('Show all, language: '+this.$el.find('select.search-language').find(':selected').text());

		} else if (this.$el.find('select.search-country').val() != 'all') {

			showAllButton.attr('href', window.wpUrl+'memoirs/country/'+this.$el.find('select.search-country').find(':selected').data('slug'))
			showAllButton.text('Show all, country: '+this.$el.find('select.search-country').find(':selected').text());

		} else if (this.$el.find('select.search-archive').val() != 'all') {

			showAllButton.attr('href', window.wpUrl+'memoirs/archive/'+this.$el.find('select.search-archive').find(':selected').data('slug'))
			showAllButton.text('Show all, archive: '+this.$el.find('select.search-archive').find(':selected').text());

		} else {
			showAllButton.attr('href', window.wpUrl+'memoirs');
			showAllButton.text('Show all');
		}
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

		this.searchUpdated();
	}
});