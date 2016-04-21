var Backbone = require('backbone');
var $ = require('jquery');
var _ = require('underscore');
var ListCollection = require('./../collections/ListCollection');
var ListItemView = require('./ListItemView.js');

module.exports = Backbone.View.extend({
	initialize: function(options) {
		this.options = options;
		this.collection = new ListCollection();
		this.collection.on('reset', this.render, this);
		this.collection.on('hitsupdate', this.hitsUpdate, this)

		this.renderUi();
	},

	events: {
		'click .item-title': 'itemTitleClick',
		'click .result-tabs a.tab': 'resultTabClick',
		'click .load-more-button': 'loadMoreClick'
	},

	itemTitleClick: function(event) {
		$(event.currentTarget).parent().toggleClass('item-open');
	},

	loadMoreClick: function() {
		this.collection.addPage(this.resultIndex);
	},

	renderUi: function() {
		var template = _.template($("#hitlistUiTemplate").html());

		this.$el.html(template({}));
	},

	lastQuery: '',
	timeRange: [],

	resultIndex: 0,

	search: function(query, timeRange) {
		this.lastQuery = query;
		this.timeRange = timeRange;

		this.collection.search(query, timeRange);

		this.$el.find('.list-header-label').text('"'+query+'", '+timeRange[0]+'-'+timeRange[1]);

		this.$el.addClass('loading');
	},

	render: function() {
		this.resultIndex = 0;

		this.renderList();
	},

	hitsUpdate: function() {
		var newHits = this.collection.at(this.resultIndex).get('hits');
		newHits = _.rest(newHits, this.collection.at(this.resultIndex).get('from_index'));

		_.each(newHits, _.bind(function(model, index) {
			var newEl = $('<div class="list-item"/>');
			this.$el.find('.list-container').append(newEl);

			var itemView = new ListItemView({
				el: newEl,
				model: new Backbone.Model(model),
				router: this.options.router,
				parties: this.options.parties
			});		
		}, this));

		this.$el.find('.page-info').html(' '+(
			Number(this.collection.metadata.page+20) > this.collection.metadata.total ? 
			this.collection.metadata.total :
			Number(this.collection.metadata.page+20)
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
					router: this.options.routet
				});		
			}, this));
		}


		this.$el.find('.page-info').html(' '+(
			Number(this.collection.metadata.page) > this.collection.metadata.total ? 
			this.collection.metadata.total :
			Number(this.collection.metadata.page)
		)+' of '+this.collection.metadata.total);

		this.$el.removeClass('loading');
	}
});