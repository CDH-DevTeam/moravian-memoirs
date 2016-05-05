var Backbone = require('backbone');
var _ = require('underscore');

module.exports = Backbone.Collection.extend({
	urlBase: 'http://moravianlives.org:8001/v2/persons',

	getPersons: function(yearRange, rangeType, gender, place, placeRelation, name, firstname, surname, archive) {
		this.searchQuery = {
			yearRange: yearRange,
			rangeType: rangeType,
			gender: gender,
			place: place,
			placeRelation: placeRelation,
			name: name,
			firstname: firstname,
			surname: surname,
			archive: archive
		};

		this.url = this.urlBase+
			(this.searchQuery.yearRange != undefined && this.searchQuery.yearRange != null ? typeof this.searchQuery.yearRange == 'number' ? '/year_range/'+this.searchQuery.yearRange+'/'+this.searchQuery.yearRange : '/year_range/'+this.searchQuery.yearRange[0]+'/'+this.searchQuery.yearRange[1] : '')+
			(this.searchQuery.rangeType != undefined && this.searchQuery.rangeType != null ? '/range_type/'+this.searchQuery.rangeType : '')+
			(this.searchQuery.gender != undefined && this.searchQuery.gender != null ? '/gender/'+this.searchQuery.gender : '')+
			(this.searchQuery.place != undefined && this.searchQuery.place != null ? '/place/'+this.searchQuery.place : '')+
			(this.searchQuery.placeRelation != undefined && this.searchQuery.placeRelation != null ? '/placerelation/'+this.searchQuery.placeRelation : '')+
			(this.searchQuery.name != undefined && this.searchQuery.name != null ? '/name/'+this.searchQuery.name : '')+
			(this.searchQuery.firstname != undefined && this.searchQuery.firstname != null ? '/firstname/'+this.searchQuery.firstname : '')+
			(this.searchQuery.surname != undefined && this.searchQuery.surname != null ? '/surname/'+this.searchQuery.surname : '')+
			(this.searchQuery.archive != undefined && this.searchQuery.archive != null ? '/archive/'+this.searchQuery.archive : '')
		;

		this.fetch({
			reset: true
		});

		this.trigger('fetch');
	},

	addPage: function() {
		this.url = this.urlBase+
			(this.searchQuery.yearRange != undefined && this.searchQuery.yearRange != null ? typeof this.searchQuery.yearRange == 'number' ? '/year_range/'+this.searchQuery.yearRange+'/'+this.searchQuery.yearRange : '/year_range/'+this.searchQuery.yearRange[0]+'/'+this.searchQuery.yearRange[1] : '')+
			(this.searchQuery.rangeType != undefined && this.searchQuery.rangeType != null ? '/range_type/'+this.searchQuery.rangeType : '')+
			(this.searchQuery.gender != undefined && this.searchQuery.gender != null ? '/gender/'+this.searchQuery.gender : '')+
			(this.searchQuery.place != undefined && this.searchQuery.place != null ? '/place/'+this.searchQuery.place : '')+
			(this.searchQuery.placeRelation != undefined && this.searchQuery.placeRelation != null ? '/placerelation/'+this.searchQuery.placeRelation : '')+
			(this.searchQuery.name != undefined && this.searchQuery.name != null ? '/name/'+this.searchQuery.name : '')+
			(this.searchQuery.firstname != undefined && this.searchQuery.firstname != null ? '/firstname/'+this.searchQuery.firstname : '')+
			(this.searchQuery.surname != undefined && this.searchQuery.surname != null ? '/surname/'+this.searchQuery.surname : '')+
			(this.searchQuery.archive != undefined && this.searchQuery.archive != null ? '/archive/'+this.searchQuery.archive : '')+
			'/page/'+(this.metadata.page+40)
		;

		this.fetch({
			add: true,
			remove: false,
			success: _.bind(function() {
				this.trigger('collectionUpdated');
			}, this)
		});

	},

	parse: function(data) {
		data.metadata.page = Number(data.metadata.page);
		this.metadata = data.metadata;

		return data.data ? data.data : [];
	}
});
