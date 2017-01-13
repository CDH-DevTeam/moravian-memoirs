var Backbone = require('backbone');
var $ = require('jquery');
var _ = require('underscore');
require('../lib/leaflet');
require('../lib/jquery.truncate');

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
		console.log('fullTextClick');
		event.preventDefault();

		var template = _.template($("#textViewerTemplate").html());
		$('#textViewer').html(template({
			document: this.model.get('documents')[$(event.currentTarget).data('index')],
			title: this.model.get('documents')[$(event.currentTarget).data('index')].surname+', '+this.model.get('documents')[$(event.currentTarget).data('index')].firstname,
			images: this.model.get('documents')[$(event.currentTarget).data('index')].docimages ? JSON.parse(this.model.get('documents')[$(event.currentTarget).data('index')].docimages) : undefined
		}));

		$('html').addClass('has-overlay');

		$('#textViewer .close-button').click(_.bind(function() {
				$('html').removeClass('has-overlay');
				$('#textViewer').removeClass('visible');
//			history.go(-1);
		}, this));

		$('#textViewer').addClass('visible');
/*
		this.options.router.navigate('view/document', {
			trigger: false
		});
*/
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

		this.model.set('hasDocument', _.find(this.model.get('documents'), function(document) {
			return document.transcriptions && document.transcriptions.transcriptions && document.transcriptions.transcriptions.length > 0;
		}) != undefined);

		this.$el.html(template({
			model: this.model,
			jQuery: $
		}));

		_.each(this.$el.find('tr.table-item'), _.bind(function(item) {
			$(item).hover(function() {
				$(this).addClass('hover');
			}, function() {
				$(this).removeClass('hover');
			});
			$(item).click(_.bind(function(event) {
				event.preventDefault();
				this.$el.find('.table-info-'+$(item).data('index')).toggleClass('visible');
			}, this));
		}, this));
	}
});