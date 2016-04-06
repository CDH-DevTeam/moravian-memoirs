define(function(require){

	var Backbone = require('backbone');
	var _ = require('underscore');
	var $ = require('jquery');

	var DataListView = require('views/DataListView');

	return DataListView.extend({
		initialize: function(options) {
			this.options = options;
			this.render();

			this.$el.find('.combine-controls .combine-button').click(_.bind(this.combinePlacesButtonClick, this));
			this.on('listCheckChanged', _.bind(this.placeCheckClick, this));
		},

		checkedPlaces: [],

		placeCheckClick: function(event) {
			this.checkedPlaces = _.map(this.$el.find('.item-check:checked'), _.bind(function(checkBox) {
				return $(checkBox).data('id');
			}, this));

			if (this.checkedPlaces.length > 1) {
				this.$el.find('.combine-controls').css('display', 'block');
				this.$el.find('.combine-controls .checked-number').text(this.checkedPlaces.length);

				var selectOptions = _.map(this.checkedPlaces, _.bind(function(placeId) {
					return '<option value="'+placeId+'">'+_.find(this.model.get('places'), function(place) {
						return place.id == placeId;
					}).name+' ['+_.find(this.model.get('places'), function(place) {
						return place.id == placeId;
					}).area+']</option>';
				}, this));
				this.$el.find('.combine-controls .combine-places-select').html(selectOptions);
			}
			else {
				this.$el.find('.combine-controls').css('display', 'none');
			}
		},

		combinePlacesButtonClick: function() {
			var finalPlace = this.$el.find('.combine-controls .combine-places-select option:selected').attr('value');

			$.ajax({
				url: 'http://moravianlives.org:8001admin/places/combine/'+finalPlace,
				type: 'POST',
				data: {
					ids: this.checkedPlaces
				},
				complete: _.bind(function() {
					this.destroy();
				}, this)
			});
		},

		render: function() {
			var template = _.template($("#duplicatePlaceListItemTemplate").html());
			this.$el.html(template({
				model: this.model
			}));
			
			this.map = L.map(this.$el.find('.map-container')[0]).setView([this.model.get('lat'), this.model.get('lng')], 7);

			L.tileLayer('http://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
				attribution: 'Imagery from <a href="http://mapbox.com/about/maps/">MapBox</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
				subdomains: 'abcd',
				id: 'mapbox.outdoors',
				accessToken: 'pk.eyJ1IjoidHJhdXN0aWQiLCJhIjoib0tQVlcxRSJ9.886zIW04YDanKiDXRWG_SA'
			}).addTo(this.map);

			this.marker = L.marker([this.model.get('lat'), this.model.get('lng')]).addTo(this.map);

			this.$el.find('.item-check').click(_.bind(this.placeCheckClick, this));
			this.placeCheckClick();			
		}
	});
});