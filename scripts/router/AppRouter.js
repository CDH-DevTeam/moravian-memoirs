var Backbone = require('backbone');
var _ = require('underscore');
var $ = require('jquery');

module.exports = Backbone.Router.extend({
	routes: {
		"": "default",
		"places(/)(place/:place)(/)(year_range/:range)(/)(range_type/:rangetype)(/)(relation/:relation)(/)(gender/:gender)(/)(name/:name)": "places",
		"movements(/)(year_range/:range)(/)(range_type/:rangetype)(/)(gender/:gender)": "movements",
		"place/:place": "place"
	}
});
