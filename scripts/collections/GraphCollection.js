var Backbone = require('backbone');
var _ = require('underscore');
var $ = require('jquery');

module.exports = Backbone.Collection.extend({
	urlBase: 'http://moravianlives.org:8001/v2/persons/per_year',

	getYearData: function(yearRange, rangeType, gender, place, placeRelation, name, firstname, surname, archive) {
		this.url = this.urlBase+
			(yearRange != undefined && yearRange != null ? typeof yearRange == 'number' ? '/year_range/'+yearRange+'/'+yearRange : '/year_range/'+yearRange[0]+'/'+yearRange[1] : '')+
			(rangeType != undefined && rangeType != null ? '/range_type/'+rangeType : '')+
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
	}
});
