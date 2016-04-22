var Backbone = require('backbone');
var $ = require('jquery');
var _ = require('underscore');
require('../lib/leaflet');

module.exports = Backbone.View.extend({
	initialize: function(options) {
		this.options = options;
		this.render();
	},

	events: {
		'click .item-title': 'itemTitleClick',
		'click .full-text-button': 'fullTextClick',
		'click': 'selfClick'
	},

	selfClick: function() {
		console.log(this.model);
	},

	itemTitleClick: function(event) {
		this.$el.toggleClass('item-open');

		if (!this.mapInitialized) {
			this.renderMap();
		}
	},

	fullTextClick: function(event) {
		event.preventDefault();

		var htmlString = this.model.get('_source').dokument.html;
		var htmlEl = $(htmlString);

		htmlString = htmlString.split('<style>').join('<!--').split('</style>').join('-->');

		var template = _.template($("#textViewerTemplate").html());
		$('#textViewer').html(template({
			title: this.model.get('_source').dokument.titel,
			html: htmlString
		}));

		$('html').addClass('has-overlay');

		$('#textViewer .close-button').click(_.bind(function() {
			history.go(-1);
		}, this));

		_.each($('#textViewer .text-content a'), function(link) {
			$(link).click(function(event) {
				event.preventDefault();
				var scrollPos = $('#textViewer').offset().top-$(link).offset().top+$(document.body).scrollTop();
				$('#textViewer .text-content').animate({
					scrollTop: scrollPos
				}, 500);
			});
		});

		$('#textViewer').addClass('visible');

		this.options.router.navigate('view/document', {
			trigger: false
		});
	},

	renderMap: function() {

		if (this.$el.find('.map-container').length > 0) {
			var OpenMapSurfer_Roads = L.tileLayer('http://korona.geog.uni-heidelberg.de/tiles/roads/x={x}&y={y}&z={z}', {
				maxZoom: 20,
				attribution: 'Imagery from <a href="http://giscience.uni-hd.de/">GIScience Research Group @ University of Heidelberg</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
			});

			var esriLayer = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
				attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
				maxZoom: 16
			});

			var OpenStreetMap_Mapnik = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
				maxZoom: 19,
				attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
			});

			var OpenStreetMap_DE = L.tileLayer('http://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png', {
				maxZoom: 18,
				attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
			});

			var Esri_WorldImagery = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
				attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
			});

			this.map = L.map(this.$el.find('.map-container')[0], {
				layers: [OpenMapSurfer_Roads],
				scrollWheelZoom: false
			});

			var markerIcon = L.icon({
				iconUrl: '/img/map-marker.png',
				shadowUrl: '/img/map-marker-shadow.png',

				iconSize:     [15, 23], // size of the icon
				shadowSize:   [14, 10], // size of the shadow
				iconAnchor:   [8, 22], // point of the icon which will correspond to marker's location
				shadowAnchor: [8, 22],  // the same for the shadow
				popupAnchor:  [-1, -15] // point from which the popup should open relative to the iconAnchor
			});

			L.control.layers({
				'Open Map Surfer': OpenMapSurfer_Roads,
				'Open Screet Map Mapnik': OpenStreetMap_Mapnik,
				'Open Screet Map DE': OpenStreetMap_DE,
				'ESTI World Imagery': Esri_WorldImagery,
				'ESRI Gray': esriLayer
			}).addTo(this.map);

			var bounds = [];

			if (this.model.get('birthplacelat') != undefined) {
				var marker = L.marker([this.model.get('birthplacelat'), this.model.get('birthplacelng')], {
					title: this.model.get('birthplacename'),
					icon: markerIcon
				});
				marker.bindPopup('<strong>'+this.model.get('birthplacename')+'</strong>');

				marker.addTo(this.map);

				bounds.push([this.model.get('birthplacelat'), this.model.get('birthplacelng')]);
			}

			if (this.model.get('deathplacelat') != undefined) {
				var marker = L.marker([this.model.get('deathplacelat'), this.model.get('deathplacelng')], {
					title: this.model.get('deathplacename'),
					icon: markerIcon
				});
				marker.bindPopup('<strong>'+this.model.get('deathplacename')+'</strong>');

				marker.addTo(this.map);

				bounds.push([this.model.get('deathplacelat'), this.model.get('deathplacelng')]);
			}

			if (bounds.length > 0) {
				this.map.fitBounds(bounds, {
					padding: [40, 40],
					maxZoom: 6
				});
			}

			this.mapInitialized = true;
		}
	},

	render: function() {
		var template = _.template($("#listItemTemplate").html());

		this.$el.html(template({
			model: this.model
		}));

		console.log(this.$el.find('.table-item'));

		_.each(this.$el.find('.table-item'), _.bind(function(item) {
			console.log('table-item');
			$(item).click(_.bind(function(event) {
				event.preventDefault();
				this.$el.find('.table-sub.table-info-'+$(item).data('index')).toggleClass('visible');
			}, this));
		}, this));
	}
});