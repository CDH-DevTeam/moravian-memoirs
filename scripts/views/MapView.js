var Backbone = require('backbone');
var _ = require('underscore');
var $ = require('jquery');
require('../lib/leaflet');
require('../lib/leaflet.markercluster');
require('../lib/leaflet-heat');

var MapCollection = require('../collections/MapCollection');

module.exports = Backbone.View.extend({
	markerIcon: L.icon({
		iconUrl: '/img/map-marker.png',
		shadowUrl: '/img/map-marker-shadow.png',

		iconSize:     [15, 23], // size of the icon
		shadowSize:   [14, 10], // size of the shadow
		iconAnchor:   [8, 22], // point of the icon which will correspond to marker's location
		shadowAnchor: [8, 22],  // the same for the shadow
		popupAnchor:  [-1, -15] // point from which the popup should open relative to the iconAnchor
	}),

	initialize: function(options) {
		this.options = options;
		this.legendsEl = this.options.legendsEl ? this.options.legendsEl : null;

		this.collection = new MapCollection();

		this.collection.on('reset', this.render, this);

		this.renderMap();
	},

	renderMap: function() {
		var OpenMapSurfer_Roads = L.tileLayer('http://korona.geog.uni-heidelberg.de/tiles/roads/x={x}&y={y}&z={z}', {
			maxZoom: 20,
			attribution: 'Imagery from <a href="http://giscience.uni-hd.de/">GIScience Research Group @ University of Heidelberg</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
		});

		var esriLayer = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
			attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
			maxZoom: 16
		});

		this.map = L.map(this.el, {
			center: [54.525961, 15.255119], 
			zoom: 4,
			layers: [OpenMapSurfer_Roads],
			scrollWheelZoom: false
		});

		L.control.layers({
			'Open Map Surfer': OpenMapSurfer_Roads,
			'ESRI Gray': esriLayer
		}).addTo(this.map);

		this.setViewmode('circles');
	},

	setViewmode: function(viewMode) {
		if (viewMode != this.viewMode) {
			this.viewMode = viewMode;

			if (this.markers) {
				if (this.markers.clearLayers) {
					this.markers.clearLayers();
				}

				this.map.removeLayer(this.markers);
			}

			switch (this.viewMode) {
				case 'markers':
					this.markers = L.featureGroup();
					this.map.addLayer(this.markers);
					break;
				case 'circles':
					this.markers = L.featureGroup();
					this.map.addLayer(this.markers);
					break;
				case 'clusters':
					this.markers = new L.MarkerClusterGroup({
						showCoverageOnHover: false,
						maxClusterRadius: 40
					});
					this.map.addLayer(this.markers);
					break;
				case 'heatmap':
					this.markers = L.heatLayer([], {
						minOpacity: 0.35,
						radius: 18,
						blur: 15
					});
					this.markers.addTo(this.map);
			}

			if (this.collection.length > 0) {
				this.render();
			}
		}
	},

	render: function() {
		if (this.legendsEl) {
			this.legendsEl.html('');
			this.legendsEl.removeClass('visible');
		}

		var dataModels = this.collection.models;

		if (this.appMode == 'places') {
			if (this.polyLines != undefined && this.map.hasLayer(this.polyLines)) {
				this.map.removeLayer(this.polyLines);
			}
		}

		if (this.appMode == 'movements') {
			dataModels = this.collection.getMovementPlaces().models;
		}

		if (this.appMode == 'movements') {
			if (this.polyLines == undefined || !this.map.hasLayer(this.polyLines)) {
				this.polyLines = L.multiPolyline([], {
					weight: 0.5,
					color: '#333',
					opacity: 0.4
				});
				this.polyLines.addTo(this.map);
			}

			this.polyLines.setLatLngs(this.collection.models.length == 1 ? [] : _.map(this.collection.models, function(model) {
				return [
					L.latLng(model.get('birthplace').lat, model.get('birthplace').lng),
					L.latLng(model.get('deathplace').lat, model.get('deathplace').lng)
				];
			}));
		}

		if (this.viewMode == 'markers' || this.viewMode == 'clusters') {			
			this.markers.clearLayers();
			_.each(dataModels, _.bind(function(model) {
				var marker = L.marker([model.get('lat'), model.get('lng')], {
					title: model.get('name'),
					icon: this.markerIcon
				}).bindPopup('<strong>'+model.get('name')+'</strong><br/><i>'+model.get('area')+'</i><br/>'+model.get('c')+' '+(model.get('c') == 1 ? 'person' : 'persons')+'<br/><br/><a href="#" class="place-view-link" data-placeId="'+model.get('id')+'">More information</a>')
					.on('popupopen', _.bind(function(event) {
						_.each(this.$el.find('.place-view-link'), _.bind(function(linkEl) {
							$(linkEl).click(_.bind(function(event) {
								event.preventDefault();
								this.trigger('viewPlace', {
									placeId: $(linkEl).data('placeid')
								});
							}, this));
						}, this));
					}, this));

				this.markers.addLayer(marker);
			}, this));
		}
		if (this.viewMode == 'circles') {
			this.markers.clearLayers();
			var minValue = _.min(dataModels, function(model) {
				return Number(model.get('c'));
			}).get('c');

			var maxValue = _.max(dataModels, function(model) {
				return Number(model.get('c'));
			}).get('c');

			_.each(dataModels, _.bind(function(model) {
				var marker = L.circleMarker([model.get('lat'), model.get('lng')], {
					radius: ((model.get('c')/maxValue)*30)+2,
					fillColor: "#ff5a00",
					fillOpacity: 0.4,
					color: '#000',
					weight: 0.8
				}).bindPopup('<strong>'+model.get('name')+'</strong><br/><i>'+model.get('area')+'</i><br/>'+model.get('c')+' '+(model.get('c') == 1 ? 'person' : 'persons')+'<br/><br/><a href="#" class="place-view-link" data-placeId="'+model.get('id')+'">More information</a>')
					.on('popupopen', _.bind(function(event) {
						_.each(this.$el.find('.place-view-link'), _.bind(function(linkEl) {
							$(linkEl).click(_.bind(function(event) {
								event.preventDefault();
								this.trigger('viewPlace', {
									placeId: $(linkEl).data('placeid')
								});
							}, this));
						}, this));
					}, this));

				this.markers.addLayer(marker);
			}, this));

			if (this.legendsEl) {
				console.log('render legends')
				var template = _.template($("#mapLegendsTemplate").html());
				this.legendsEl.html(template({
					minValue: Number(minValue),
					maxValue: Number(maxValue)
				}));
				this.legendsEl.addClass('visible');
			}
		}
		if (this.viewMode == 'heatmap') {
			var latLngs = _.map(dataModels, _.bind(function(model) {
				return [model.get('lat'), model.get('lng'), model.get('c')];
			}, this));
			this.markers.setLatLngs(latLngs);
		}
	}
});
