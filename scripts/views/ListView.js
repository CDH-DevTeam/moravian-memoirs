var Backbone = require('backbone');
var $ = require('jquery');
window._ = require('underscore');
var ListCollection = require('./../collections/ListCollection');
var ListItemView = require('./ListItemView.js');

module.exports = Backbone.View.extend({
	initialize: function(options) {
		this.options = options;
		this.collection = new ListCollection();
		this.collection.on('reset', this.render, this);
		this.collection.on('update', this.hitsUpdate, this)

		this.renderUi();
	},

	events: {
		'click .result-tabs a.tab': 'resultTabClick',
		'click .load-more-button': 'loadMoreClick'
	},

	loadMoreClick: function() {
		this.collection.addPage();
	},

	renderUi: function() {
		var template = _.template($("#hitlistUiTemplate").html());

		this.$el.html(template({}));
	},

	render: function() {
		this.renderList();
	},

	hitsUpdate: function() {
		var newModels = _.rest(this.collection.models, this.collection.metadata.page);

		_.each(newModels, _.bind(function(model, index) {
			var newEl = $('<div class="list-item"/>');
			this.$el.find('.list-container').append(newEl);

			var itemView = new ListItemView({
				el: newEl,
				model: model,
				router: this.options.router
			});		
		}, this));

		this.$el.find('.page-info').html(' '+(
			Number(this.collection.metadata.page+40) > this.collection.metadata.total ? 
			this.collection.metadata.total :
			Number(this.collection.metadata.page+40)
		)+' of '+this.collection.metadata.total);
	},

	renderList: function() {
		this.$el.find('.list-container').html('');

		if (this.collection.length == 0) {
			this.$el.addClass('no-results');
		}
		else {
			this.$el.removeClass('no-results');
			_.each(this.collection.models, _.bind(function(model, index) {
				var newEl = $('<div class="list-item"/>');

				this.$el.find('.list-container').append(newEl);

				var itemView = new ListItemView({
					el: newEl,
					model: model,
					router: this.options.router
				});		
			}, this));
		}

		this.$el.find('.page-info').html(' '+(
			Number(this.collection.metadata.page+40) > this.collection.metadata.total ? 
			this.collection.metadata.total :
			Number(this.collection.metadata.page+40)
		)+' of '+this.collection.metadata.total);

		this.$el.removeClass('loading');

		if (this.collection.length == 1) {
			this.$el.find('.list-container .list-item').addClass('item-open');
		}
	}
});