var Backbone = require('backbone');
var _ = require('underscore');
var $ = require('jquery');

module.exports = Backbone.Collection.extend({
	urlBase: 'http://moravianlives.org:8001/v2/locations',

	initialize: function() {
	},

	// /v2/locations(/)(year_range/:num1/:num2/?)(/)(range_type/:rangetype/?)(/)(relation/:relation/?)(/)(gender/:gender/?)(/)(name/:name/?)
	getPlaces: function(yearRange, rangeType, relation, gender, place, placeRelation, name, firstname, surname, archive) {
		this.url = this.urlBase+
			(yearRange != undefined && yearRange != null ? typeof yearRange == 'number' ? '/year_range/'+yearRange+'/'+yearRange : '/year_range/'+yearRange[0]+'/'+yearRange[1] : '')+
			(rangeType != undefined && rangeType != null ? '/range_type/'+rangeType : '')+
			(relation != undefined && relation != null ? '/relation/'+relation : '')+
			(gender != undefined && gender != null ? '/gender/'+gender : '')+
			(place != undefined && place != null ? '/place/'+place : '')+
			(placeRelation != undefined && placeRelation != null ? '/placerelation/'+placeRelation : '')+
			(name != undefined && name != null ? '/name/'+name : '')+
			(firstname != undefined && firstname != null ? '/firstname/'+firstname : '')+
			(surname != undefined && surname != null ? '/surname/'+surname : '')+
			(archive != undefined && archive != null ? '/archive/'+archive : '')

		;

		this.fetch({
			reset: true
		});

		this.trigger('fetch');
	},

	getMovements: function(yearRange, rangeType, gender) {
		this.url = this.urlBase+'/movements'+
			'/'+yearRange[0]+'/'+yearRange[1]+
			(rangeType != undefined && rangeType != null ? '/range_type/'+rangeType : '')+
			(gender != undefined && gender != null ? '/gender/'+gender : '')
		;

		this.fetch({
			reset: true
		});

		this.trigger('fetch');
	},

	getMovementPlaces: function() {
		var places = new Backbone.Collection();

		_.each(this.models, _.bind(function(model) {
			if (places.get(model.get('birthplace').id) == undefined) {
				places.add(model.get('birthplace'));
				places.get(model.get('birthplace').id).set('c', 1);
				places.get(model.get('birthplace').id).set('born', 1);
			}

			places.get(model.get('birthplace').id).set('c', places.get(model.get('birthplace').id).get('c')+1);
			places.get(model.get('birthplace').id).set('born', places.get(model.get('birthplace').id).get('born')+1);

			if (places.get(model.get('deathplace').id) == undefined) {
				places.add(model.get('deathplace'));
				places.get(model.get('deathplace').id).set('c', 1);
				places.get(model.get('deathplace').id).set('died', 1);
			}

			places.get(model.get('deathplace').id).set('c', places.get(model.get('deathplace').id).get('c')+1);
			places.get(model.get('deathplace').id).set('died', places.get(model.get('deathplace').id).get('died')+1);
		}, this));

		return places;
	},

	personCount: function() {
		return this.reduce(function(memo, num) {
			return memo + Number(num.get('c'));
		}, 0);
	},

	parse: function(data) {
		return data.data ? data.data : [];
	}
});
