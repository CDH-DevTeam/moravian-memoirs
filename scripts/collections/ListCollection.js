var Backbone = require('backbone');
var _ = require('underscore');

module.exports = Backbone.Collection.extend({
	urlBase: 'http://moravianlives.org:8001/v2/persons',

	getPersons: function(yearRange, rangeType, gender, place, placeRelation, name, firstname, surname, archive) {
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
	},

	addPage: function(resultIndex) {
		if (this.at(resultIndex).get('from_index')+20 < this.at(resultIndex).get('total_hit_count')) {
			
			this.at(resultIndex).set('from_index', this.at(resultIndex).get('from_index')+20);
			this.searchData.fromIndex = this.at(resultIndex).get('from_index');

			var tempCollection = new Backbone.Collection();
			tempCollection.model = ListItemModel;
			tempCollection.url = this.url;
			tempCollection.on('reset', _.bind(function()  {

				this.at(resultIndex).set('hits', _.union(this.at(resultIndex).get('hits'), tempCollection.at(0).get('hits')));

				this.trigger('hitsupdate');
			}, this));

			var searchData = {
				searchPhrase: this.at(resultIndex).get('search_query')+' '+this.filtersToString(this.at(resultIndex).get('filters')),
				startDate: this.searchData.startDate,
				endDate: this.searchData.endDate,
				fromIndex: this.searchData.fromIndex
			};

			tempCollection.fetch({
				data: searchData,
				reset: true
			});
		}
	},

	parse: function(data) {
		this.metadata = data.metadata;

		return data.data;
	}
});
