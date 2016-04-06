var Backbone = require('backbone');
var _ = require('underscore');
var $ = require('jquery');
require('../lib/leaflet');

var PopulationCollection = require('../collections/PopulationCollection');

module.exports = Backbone.View.extend({
	initialize: function(options) {
		this.options = options;

		this.collection = new PopulationCollection();
		this.collection.on('reset', this.render, this);
	},

	render: function() {
		if (this.collection.length > 0) {
			var template = _.template($("#placeViewTemplate").html());
			this.$el.html(template({
				models: this.collection.models,
				metadata: this.collection.metadata,
				collectionUrl: this.collection.url
			}));				
		}
		else {
			this.$el.html('');
		}

		this.trigger('render');

		return this;
	}
});