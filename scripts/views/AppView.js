var Backbone = require('backbone');
var _ = require('underscore');
var $ = require('jquery');

var noUiSlider = require('../lib/nouislider.min');

var MapView = require('./MapView');
var ListView = require('./ListView');
var GraphView = require('./GraphView');
var AppRouter = require('../router/AppRouter');

module.exports = Backbone.View.extend({
	initialize: function() {

		this.searchCriterias = {};

		this.router = new AppRouter();

		this.render();

		this.router.on('route:places', _.bind(function(yearRange, rangeType, relation, gender, place, placeRelation, name, firstname, surname, archive, documentId) {
			this.setAppMode('places');

			$('html').removeClass('has-overlay');
			$('#textViewer').removeClass('visible');

			if (documentId != null) {
				this.getPlaces(null, null, null, null, null, null, null, null, null, null, documentId);

				$('html, body').animate({
					scrollTop: $('.hitlist-container').offset().top
				}, 1000);
			}
			else if (yearRange != null) {
				this.getPlaces(yearRange.split(';'), rangeType, relation, gender, place, placeRelation, name, firstname, surname, archive);
			}
		}, this));

		this.router.on('route:movements', _.bind(function(yearRange, rangeType, gender, place, placeRelation, name, firstname, surname, archive) {
			this.setAppMode('movements');

			$('html').removeClass('has-overlay');
			$('#textViewer').removeClass('visible');

			if (yearRange != null) {
				this.getMovements(yearRange.split(';'), rangeType, gender, place, placeRelation, name, firstname, surname, archive);				
			}
		}, this));

		this.router.on('route:default', _.bind(function() {
			this.setAppMode('places');

			$('html').removeClass('has-overlay');
			$('#textViewer').removeClass('visible');
		}, this));

		Backbone.history.start();
	},

	events: {
		'click .viewmode-buttons a': 'viewModeButtonClick',
		'click .update-map-button': 'updateMapButtonClick',
		'click .more-form-button': 'moreFormButtonClick',
		'keyup .map-search-control': 'searchControlKeyUp',
		'mouseover .map-toolbar': 'toolbarMouseEnter',
		'mouseout .map-toolbar': 'toolbarMouseLeave'
	},

	initSlider: function() {
		this.slider = noUiSlider.create($('#yearRangeSlider')[0], {
			start: [1600, 2015],
			step: 1,
			behaviour: 'drag',
			connect: true,
			range: {
				'min': 1600,
				'max':  2015
			}
		});

		this.slider.on('slide', _.bind(function(event, ui) {
			$('#yearRangeSlider .noUi-handle-lower').html('<div class="handle-number number-top">'+Math.round(this.slider.get()[0])+'</div>');
			$('#yearRangeSlider .noUi-handle-upper').html('<div class="handle-number">'+Math.round(this.slider.get()[1])+'</div>');

			this.graphView.setTimeOverlay(this.slider.get());
		}, this));
	},

	viewModeButtonClick: function(event) {
		event.preventDefault();

		this.$el.find('.viewmode-buttons a').removeClass('selected');
		$(event.currentTarget).addClass('selected');
		this.mapView.setViewmode($(event.currentTarget).data('viewmode'));
	},

	moreFormButtonClick: function() {
		this.$el.find('.map-toolbar .form-extra').toggleClass('visible');
	},

	searchControlKeyUp: function(event) {
		if (event.keyCode == 13) {
			this.updateMapButtonClick();
		}
	},

	toolbarMouseEnter: function() {
		this.mouseOnForm = true;
	},

	toolbarMouseLeave: function() {
		this.mouseOnForm = false;

		setTimeout(_.bind(function() {
			if (!this.mouseOnForm) {
				this.$el.find('.map-toolbar .form-extra').removeClass('visible');
			}
		}, this), 2000);
	},

	getPlaces: function(yearRange, rangeType, relationType, gender, place, placeRelation, name, firstname, surname, archive, documentId) {
		this.searchCriterias.yearRange = yearRange;
		this.searchCriterias.rangeType = rangeType;
		this.searchCriterias.relationType = relationType;
		this.searchCriterias.gender = gender;
		this.searchCriterias.place = place;
		this.searchCriterias.placeRelation = placeRelation;
		this.searchCriterias.name = name;
		this.searchCriterias.firstname = firstname;
		this.searchCriterias.surname = surname;
		this.searchCriterias.archive = archive;
		this.searchCriterias.documentId = documentId;

		this.updateMap();
	},

	getMovements: function(yearRange, rangeType, gender, place, placeRelation, name, firstname, surname, archive) {
		this.searchCriterias.yearRange = yearRange;
		this.searchCriterias.rangeType = rangeType;
		this.searchCriterias.gender = gender;
		this.searchCriterias.place = place;
		this.searchCriterias.placeRelation = placeRelation;
		this.searchCriterias.name = name;
		this.searchCriterias.firstname = firstname;
		this.searchCriterias.surname = surname;
		this.searchCriterias.archive = archive;

		this.updateMap();
	},

	updateMapButtonClick: function() {
		this.router.navigate(
				this.appMode+
				(this.appMode == 'places' && this.currentPlace != undefined ? '/place/'+this.currentPlace : '')+
				('/year_range/'+([Math.round(Number(this.slider.get()[0])), Math.round(Number(this.slider.get()[1]))]).join(';'))+
				(this.$el.find('#yearRangeOption').val() != 'initial' ? '/range_type/'+this.$el.find('#yearRangeOption').val() : '')+
				(this.$el.find('#relationOption').val() && this.$el.find('#relationOption').val() != 'initial' ? '/relation/'+this.$el.find('#relationOption').val() : '')+
				(this.$el.find('#genderOption').val() != 'initial' ? '/gender/'+this.$el.find('#genderOption').val() : '')+
				(this.$el.find('#placeNameInput').val() != '' ? '/place/'+this.$el.find('#placeNameInput').val() : '')+
				(this.$el.find('#placeNameOptions').val() != 'initial' && this.$el.find('#placeNameInput').val() != '' ? '/placerelation/'+this.$el.find('#placeNameOptions').val() : '')+
				(this.$el.find('#nameInput').val() != '' ? '/name/'+this.$el.find('#nameInput').val() : '')+
				(this.$el.find('#firstnameInput').val() != '' ? '/firstname/'+this.$el.find('#firstnameInput').val() : '')+
				(this.$el.find('#surnameInput').val() != '' ? '/surname/'+this.$el.find('#surnameInput').val() : '')+
				(this.$el.find('#archiveOption').val() != 'initial' ? '/archive/'+this.$el.find('#archiveOption').val() : ''),
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
			$('#yearRangeSlider .noUi-handle-lower').html('<div class="handle-number number-top">'+Math.round(this.slider.get()[0])+'</div>');
			$('#yearRangeSlider .noUi-handle-upper').html('<div class="handle-number">'+Math.round(this.slider.get()[1])+'</div>');
			this.graphView.timeOverlay = this.searchCriterias.yearRange;
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
		if (this.searchCriterias.place && this.searchCriterias.place != this.$el.find('#placeNameInput').val()) {
			this.$el.find('#placeNameInput').val(this.searchCriterias.place);
		}
		if (this.searchCriterias.placeRelation && this.searchCriterias.placeRelation != this.$el.find('#placeNameOptions').val()) {
			this.$el.find('#placeNameOptions').val(this.searchCriterias.placeRelation);
		}
		if (this.searchCriterias.name && this.searchCriterias.name != this.$el.find('#nameInput').val()) {
			this.$el.find('#nameInput').val(this.searchCriterias.name);
		}
		if (this.searchCriterias.firstname && this.searchCriterias.firstname != this.$el.find('#firstnameInput').val()) {
			this.$el.find('#firstnameInput').val(this.searchCriterias.firstname);
		}
		if (this.searchCriterias.surname && this.searchCriterias.surname != this.$el.find('#nameInput').val()) {
			this.$el.find('#surnameInput').val(this.searchCriterias.surname);
		}
		if (this.searchCriterias.archive && this.searchCriterias.archive != this.$el.find('#archiveOption').val()) {
			this.$el.find('#archiveOption').val(this.searchCriterias.archive);
		}

		this.$el.find('.update-map-button').attr('disabled', 'disabled');

		if (this.appMode == 'places') {
			this.mapView.collection.getPlaces(
				this.searchCriterias.yearRange,
				this.searchCriterias.rangeType == 'initial' || this.searchCriterias.rangeType == 'all' ? null : this.searchCriterias.rangeType,
				this.searchCriterias.relationType == 'initial' ? null : this.searchCriterias.relationType,
				this.searchCriterias.gender == 'initial' ? null : this.searchCriterias.gender,
				this.searchCriterias.place == '' ? null : this.searchCriterias.place,
				this.searchCriterias.placeRelation == 'initial' ? null : this.searchCriterias.placeRelation,
				this.searchCriterias.name == '' ? null : this.searchCriterias.name,
				this.searchCriterias.firstname == '' ? null : this.searchCriterias.firstname,
				this.searchCriterias.surname == '' ? null : this.searchCriterias.surname,
				this.searchCriterias.archive == 'initial' ? null : this.searchCriterias.archive,
				this.searchCriterias.documentId == '' ? null : this.searchCriterias.documentId
			);
/*
			if (this.currentPlace != undefined) {
				this.placeView.collection.getPersons(
					this.currentPlace,
					this.searchCriterias.yearRange,
					this.searchCriterias.rangeType == 'initial' || this.searchCriterias.rangeType == 'all' ? null : this.searchCriterias.rangeType,
					this.searchCriterias.relationType == 'initial' ? null : this.searchCriterias.relationType,
					this.searchCriterias.gender == 'initial' ? null : this.searchCriterias.gender
				);
			}
*/
		}

		if (this.appMode == 'movements') {
			this.mapView.collection.getMovements(
				this.searchCriterias.yearRange,
				this.searchCriterias.rangeType == 'initial' || this.searchCriterias.rangeType == 'all' ? null : this.searchCriterias.rangeType,
				this.searchCriterias.gender == 'initial' ? null : this.searchCriterias.gender,
				this.searchCriterias.place == '' ? null : this.searchCriterias.place,
				this.searchCriterias.placeRelation == 'initial' ? null : this.searchCriterias.placeRelation,
				this.searchCriterias.name == '' ? null : this.searchCriterias.name,
				this.searchCriterias.firstname == '' ? null : this.searchCriterias.firstname,
				this.searchCriterias.surname == '' ? null : this.searchCriterias.surname,
				this.searchCriterias.archive == 'initial' ? null : this.searchCriterias.archive
			);
		}

		this.listView.collection.getPersons(
			this.searchCriterias.yearRange,
			this.searchCriterias.rangeType == 'initial' || this.searchCriterias.rangeType == 'all' ? null : this.searchCriterias.rangeType,
			this.searchCriterias.gender == 'initial' ? null : this.searchCriterias.gender,
			this.searchCriterias.place == '' ? null : this.searchCriterias.place,
			this.searchCriterias.placeRelation == 'initial' ? null : this.searchCriterias.placeRelation,
			this.searchCriterias.name == '' ? null : this.searchCriterias.name,
			this.searchCriterias.firstname == '' ? null : this.searchCriterias.firstname,
			this.searchCriterias.surname == '' ? null : this.searchCriterias.surname,
			this.searchCriterias.archive == 'initial' ? null : this.searchCriterias.archive,
			this.searchCriterias.documentId == '' ? null : this.searchCriterias.documentId
		);

		this.graphView.collection.getYearData(
			this.searchCriterias.yearRange,
			this.searchCriterias.rangeType == 'initial' || this.searchCriterias.rangeType == 'all' ? null : this.searchCriterias.rangeType,
			this.searchCriterias.gender == 'initial' ? null : this.searchCriterias.gender,
			this.searchCriterias.place == '' ? null : this.searchCriterias.place,
			this.searchCriterias.placeRelation == 'initial' ? null : this.searchCriterias.placeRelation,
			this.searchCriterias.name == '' ? null : this.searchCriterias.name,
			this.searchCriterias.firstname == '' ? null : this.searchCriterias.firstname,
			this.searchCriterias.surname == '' ? null : this.searchCriterias.surname,
			this.searchCriterias.archive == 'initial' ? null : this.searchCriterias.archive,
			this.searchCriterias.documentId == '' ? null : this.searchCriterias.documentId
		);

		this.$el.find('.hitlist-container').css('display', 'block');
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
			this.$el.find('.map-toolbar .toolbar-content').html(template());				

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
			var RouteParser = require('route-parser');
			var route = new RouteParser('places(/)(year_range/:range)(/)(range_type/:rangetype)(/)(relation/:relation)(/)(gender/:gender)(/)(place/:place)(/)(placerelation/:placerelation)(/)(name/:name)(/)(firstname/:firstname)(/)(surname/:surname)(/)(archive/:archive)');
			console.log(window.location.hash.replace('#', ''));
			var routeParams = route.match(window.location.hash.replace('#', ''));

			if (routeParams) {
				this.router.navigate(
						this.appMode+
						(this.appMode == 'places' && this.currentPlace != undefined ? '/place/'+this.currentPlace : '')+
						('/year_range/'+routeParams.range)+
						(routeParams.rangetype ? '/range_type/'+routeParams.rangetype : '')+
						(routeParams.relation ? '/relation/'+routeParams.relation : '')+
						(routeParams.gender ? '/gender/'+routeParams.gender : '')+
						(routeParams.place = '/place/'+event.placeName)+
						(event.placeRelation != 'both' ? '/placerelation/'+event.placeRelation : '')+
						(routeParams.name ? '/name/'+routeParams.name : '')+
						(routeParams.firstname ? '/firstname/'+routeParams.firstname : '')+
						(routeParams.surname ? '/surname/'+routeParams.surname : '')+
						(routeParams.archive ? '/archive/'+routeParams.archive : ''),
					{
						trigger: true
					}
				);
			}

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

//			this.renderSearchCriteria();

			this.$el.find('.update-map-button').removeAttr('disabled');

			this.$el.find('.json-button').attr('href', this.mapView.collection.url);
		}, this));

		this.listView = new ListView({
			el: this.$el.find('#hitlistViewContainer')[0],
			router: this.router
		});

		this.graphView = new GraphView({
			el: this.$el.find('#graphViewContainer')[0],
			router: this.router
		});

		this.initSlider();

		$(window).scroll(_.bind(function(event) {
			var scrollTop = $(window).scrollTop();

			if (scrollTop < 260) {
				this.$el.removeClass('fixed-search-form');
			}
			else {
				this.$el.addClass('fixed-search-form');
			}
		}, this));

		var scrollTop = $(window).scrollTop();
		if (scrollTop > 260) {
			this.$el.addClass('fixed-search-form');
		}

		return this;
	}
});
