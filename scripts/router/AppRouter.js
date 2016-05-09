var Backbone = require('backbone');
var _ = require('underscore');
var $ = require('jquery');

module.exports = Backbone.Router.extend({
	routes: {
		"": "default",
		"places(/)(year_range/:range)(/)(range_type/:rangetype)(/)(relation/:relation)(/)(gender/:gender)(/)(place/:place)(/)(placerelation/:placerelation)(/)(name/:name)(/)(firstname/:firstname)(/)(surname/:surname)(/)(archive/:archive)": "places",
		"movements(/)(year_range/:range)(/)(range_type/:rangetype)(/)(gender/:gender)(/)(place/:place)(/)(placerelation/:placerelation)(/)(name/:name)(/)(firstname/:firstname)(/)(surname/:surname)(/)(archive/:archive)": "movements",
		"place/:place": "place"
	}
});
