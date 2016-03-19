var Backbone = require('backbone');
var _ = require('underscore');
var $ = require('jquery');

module.exports = Backbone.Collection.extend({
	urlBase: 'http://sagnagrunnur.com/lebenslauf/api/v2/persons',

	initialize: function() {
	},

	// /v2/locations(/)(year_range/:num1/:num2/?)(/)(range_type/:rangetype/?)(/)(relation/:relation/?)(/)(gender/:gender/?)(/)(name/:name/?)
	getPersons: function(place, yearRange, rangeType, relation, gender, name) {
		this.url = this.urlBase+
			(place != undefined && place != null ? '/place/'+place : '')+
			(relation != undefined && relation != null ? '/relation/'+relation : '')+
			(yearRange != undefined && yearRange != null ? typeof yearRange == 'number' ? '/year_range/'+yearRange+'/'+yearRange : '/year_range/'+yearRange[0]+'/'+yearRange[1] : '')+
			(rangeType != undefined && rangeType != null ? '/range_type/'+rangeType : '')+
			(gender != undefined && gender != null ? '/gender/'+gender : '')+
			(name != undefined && name != null ? '/name/'+name : '')
		;

		this.fetch({
			reset: true
		});
	},

	parse: function(data) {
		this.metadata = data.metadata;
		return data.data ? data.data : [];
	}
});