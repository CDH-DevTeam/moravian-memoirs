var Backbone = require('backbone');
var _ = require('underscore');
var $ = require('jquery');

var noUiSlider = require('../lib/nouislider.min');

var MapView = require('./MapView');
var AppRouter = require('../router/AppRouter');

module.exports = Backbone.View.extend({
	initialize: function() {

		this.searchCriterias = {};

		this.render();

		this.router = new AppRouter();

		this.router.on('route:places', _.bind(function(place, yearRange, rangeType, relation, gender, name) {
			this.setAppMode('places');

			if (yearRange != null) {				
				this.getPlaces(yearRange.split(';'), rangeType, relation, gender);

				if (place != null && place != this.currentPlace) {
					this.getPlace(place);
				}
			}
		}, this));

		this.router.on('route:movements', _.bind(function(yearRange, rangeType, gender, name) {
			this.setAppMode('movements');

			if (yearRange != null) {
				this.getMovements(yearRange.split(';'), rangeType, gender);				
			}
		}, this));

		this.router.on('route:default', _.bind(function() {
			this.setAppMode('places');
		}, this));

		Backbone.history.start();
	},

	events: {
		'click .viewmode-buttons a': 'viewModeButtonClick',
		'click .update-map-button': 'updateMapButtonClick'
	},

	initSlider: function() {
		this.slider = noUiSlider.create($('#yearRangeSlider')[0], {
			start: [1750, 1800],
			step: 1,
			behaviour: 'drag',
			connect: true,
			range: {
				'min': 1500,
				'max':  2015
			}
		});

		this.slider.on('slide', _.bind(function(event, ui) {
			$('#yearRangeSlider .noUi-handle-lower').html('<div class="handle-number">'+Math.round(this.slider.get()[0])+'</div>');
			$('#yearRangeSlider .noUi-handle-upper').html('<div class="handle-number">'+Math.round(this.slider.get()[1])+'</div>');
		}, this));
	},

	viewModeButtonClick: function(event) {
		event.preventDefault();

		this.$el.find('.viewmode-buttons a').removeClass('selected');
		$(event.currentTarget).addClass('selected');
		this.mapView.setViewmode($(event.currentTarget).data('viewmode'));
	},

	getPlaces: function(yearRange, rangeType, relationType, gender) {
		this.searchCriterias.yearRange = yearRange;
		this.searchCriterias.rangeType = rangeType;
		this.searchCriterias.relationType = relationType;
		this.searchCriterias.gender = gender;

		this.updateMap();
	},

	getMovements: function(yearRange, rangeType, gender) {
		this.searchCriterias.yearRange = yearRange;
		this.searchCriterias.rangeType = rangeType;
		this.searchCriterias.gender = gender;

		this.updateMap();
	},

	updateMapButtonClick: function() {
		this.router.navigate(
				this.appMode+
				(this.appMode == 'places' && this.currentPlace != undefined ? '/place/'+this.currentPlace : '')+
				('/year_range/'+([Math.round(Number(this.slider.get()[0])), Math.round(Number(this.slider.get()[1]))]).join(';'))+
				(this.$el.find('#yearRangeOption').val() != 'initial' ? '/range_type/'+this.$el.find('#yearRangeOption').val() : '')+
				(this.$el.find('#relationOption').val() && this.$el.find('#relationOption').val() != 'initial' ? '/relation/'+this.$el.find('#relationOption').val() : '')+
				(this.$el.find('#genderOption').val() != 'initial' ? '/gender/'+this.$el.find('#genderOption').val() : ''),
			{
				trigger: true
			}
		);
	},

	updateMap: function() {
		/*
				('/year_range/'+([Math.round(Number(this.slider.get()[0])), Math.round(Number(this.slider.get()[1]))]).join(';'))+
				(this.$el.find('#yearRangeOption').val() != 'initial' ? '/range_type/'+this.$el.find('#yearRangeOption').val() : '')+
				(this.$el.find('#relationOption').val() != 'initial' ? '/relation/'+this.$el.find('#relationOption').val() : '')+
				(this.$el.find('#genderOption').val() != 'initial' ? '/gender/'+this.$el.find('#genderOption').val() : ''),
		*/
		if (this.searchCriterias.yearRange && this.searchCriterias.yearRange != [Math.round(Number(this.slider.get()[0])), Math.round(Number(this.slider.get()[1]))]) {
			this.slider.set(this.searchCriterias.yearRange);
		}
		if (this.searchCriterias.rangeType && this.searchCriterias.rangeType != this.$el.find('#yearRangeOption').val()) {
			this.$el.find('#yearRangeOption').val(this.searchCriterias.rangeType);
		}
		if (this.searchCriterias.relationType && this.searchCriterias.relationType != this.$el.find('#relationOption').val()) {
			this.$el.find('#relationOption').val(this.searchCriterias.relationType);
		}
		if (this.searchCriterias.gender && this.searchCriterias.gender != this.$el.find('#genderOption').val()) {
			this.$el.find('#genderOption').val(this.searchCriterias.gender);
		}

		this.$el.find('.update-map-button').attr('disabled', 'disabled');

		if (this.appMode == 'places') {
			this.mapView.collection.getPlaces(
				this.searchCriterias.yearRange,
				this.searchCriterias.rangeType == 'initial' || this.searchCriterias.rangeType == 'all' ? null : this.searchCriterias.rangeType,
				this.searchCriterias.relationType == 'initial' ? null : this.searchCriterias.relationType,
				this.searchCriterias.gender == 'initial' ? null : this.searchCriterias.gender
			);

			if (this.currentPlace != undefined) {
				this.placeView.collection.getPersons(
					this.currentPlace,
					this.searchCriterias.yearRange,
					this.searchCriterias.rangeType == 'initial' || this.searchCriterias.rangeType == 'all' ? null : this.searchCriterias.rangeType,
					this.searchCriterias.relationType == 'initial' ? null : this.searchCriterias.relationType,
					this.searchCriterias.gender == 'initial' ? null : this.searchCriterias.gender
				);
			}
		}

		if (this.appMode == 'movements') {
			this.mapView.collection.getMovements(
				this.searchCriterias.yearRange,
				this.searchCriterias.rangeType == 'initial' || this.searchCriterias.rangeType == 'all' ? null : this.searchCriterias.rangeType,
				this.searchCriterias.gender == 'initial' ? null : this.searchCriterias.gender
			);
		}
	},

	renderSearchCriteria: function() {

		var criteriaDesc =
			(this.appMode == 'movements' ? 'Movements' : this.searchCriterias.relationType == 'initial' || this.searchCriterias.relationType == null ? 'Birth and death places' : this.searchCriterias.relationType == 'birth' ? 'Birth places' : this.searchCriterias.relationType == 'death' ? 'Death places' : '')+
			' of '+
			(this.searchCriterias.gender == 'male' ? 'males' : this.searchCriterias.gender == 'female' ? 'females' : 'persons')+
			(this.searchCriterias.rangeType == 'initial' || this.searchCriterias.rangeType == null ? ' living ' : this.searchCriterias.rangeType == 'birth' ? ' born ' : this.searchCriterias.rangeType == 'death' ? ' who died ' : '')+
			' between '+
			this.searchCriterias.yearRange[0]+' and '+this.searchCriterias.yearRange[1]
		;

		this.$el.find('.search-result-label .search-info').html(criteriaDesc+': ');
	},

	showMessage: function(msg) {
		this.$el.find('.overlay-container').html('<div class="message">'+msg+'</div>');
		setTimeout(_.bind(function() {
			this.$el.find('.overlay-container').html('');
		}, this), 1500);
	},

	getPlace: function(placeId) {
		console.log('getPlace');
		if (this.placeView == null) {
			var PlaceView = require('../views/PlaceView');
			this.placeView = new PlaceView({
				el: this.$el.find('#placeViewContainer')
			});

			this.placeView.on('render', _.bind(function() {
				if (this.newPlace) {					
					$("html, body").animate({
						scrollTop: this.$el.offset().top+300
					});
					this.newPlace = false;
				}
			}, this));
		}

		this.currentPlace = placeId;

		this.placeView.collection.getPersons(
			placeId,
			this.searchCriterias.yearRange,
			this.searchCriterias.rangeType == 'initial' || this.searchCriterias.rangeType == 'all' ? null : this.searchCriterias.rangeType,
			this.searchCriterias.relationType == 'initial' ? null : this.searchCriterias.relationType,
			this.searchCriterias.gender == 'initial' ? null : this.searchCriterias.gender
		);
	},

	setAppMode: function(appMode) {
		this.mapView.appMode = appMode;

		if (!this.appMode || this.appMode != appMode) {
			this.appMode = appMode;

			var templateName = '';
			if (this.appMode == 'places') {
				templateName = 'placesMapControlsTemplate';
			}
			if (this.appMode == 'movements') {
				templateName = 'movementsMapControlsTemplate';
			}

			var template = _.template($("#"+templateName).html());
			this.$el.find('.map-toolbar').html(template());				

			this.$el.find('.header-tabs-container a').removeClass('selected');
			this.$el.find('.header-tabs-container a.'+this.appMode).addClass('selected');
		}
	},

	render: function() {
		this.mapView = new MapView({
			el: this.$el.find('#mapContainer')[0],
			legendsEl: $(this.$el.find('#legends')[0]),
			router: this.router
		});
		this.mapView.collection.on('fetch', _.bind(function() {
			this.$el.find('.map-progress').addClass('visible');
		}, this));
		this.mapView.on('viewPlace', _.bind(function(event) {
			this.newPlace = true;
			this.router.navigate(
					'places'+
					('/place/'+event.placeId)+
					('/year_range/'+this.searchCriterias.yearRange.join(';'))+
					(this.searchCriterias.rangeType && this.searchCriterias.rangeType != 'initial' ? '/range_type/'+this.searchCriterias.rangeType : '')+
					(this.searchCriterias.relationType && this.searchCriterias.relationType != 'initial' ? '/relation/'+this.searchCriterias.relationType : '')+
					(this.searchCriterias.gender && this.searchCriterias.gender != 'initial' ? '/gender/'+this.searchCriterias.gender : '')
			);
			this.getPlace(event.placeId);
		}, this));

		this.mapView.collection.on('reset', _.bind(function() {
			this.$el.find('.map-progress').removeClass('visible');

			if (this.appMode == 'places') {				
				this.$el.find('.search-result-label .results-info').html('<b>'+
					this.mapView.collection.length+'</b> places, <b>'+
					this.mapView.collection.personCount()+'</b> persons.'
				);
			}

			if (this.appMode == 'movements') {				
				this.$el.find('.search-result-label .results-info').html('<b>'+
					this.mapView.collection.length+'</b> persons.'
				);
			}

			this.renderSearchCriteria();

			this.$el.find('.update-map-button').removeAttr('disabled');

			this.$el.find('.json-button').attr('href', this.mapView.collection.url);
		}, this));

		this.initSlider();
/*
		setTimeout(_.bind(function() {
			$('html, body').animate({
				scrollTop: this.$el.offset().top
			}, 1000);
		}, this), 500);
*/
		$(window).scroll(_.bind(function(event) {
			var scrollTop = $(window).scrollTop();

			if (scrollTop < 320) {
				this.$el.removeClass('fixed-map-ui');
			}
			else {
				this.$el.addClass('fixed-map-ui');
			}
		}, this));

		var scrollTop = $(window).scrollTop();
		if (scrollTop > 320) {
			this.$el.addClass('fixed-map-ui');
		}

		return this;
	}
});
