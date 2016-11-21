var Backbone = require('backbone');
var _ = require('underscore');
var $ = require('jquery');

var panZoom = require('../lib/jquery.panzoom.min');

//var zoom = require('../lib/e-smart-zoom-jquery');

module.exports = Backbone.View.extend({
	initialize: function() {
		console.log('ScriptoView: initialize');

		this.$el.find('.image-viewer .image-container').panzoom({
			panOnlyWhenZoomed: false,
			
			$zoomIn: this.$el.find('.zoom-in-button'),
			$zoomOut: this.$el.find('.zoom-out-button')
		});

		this.$el.find('.image-viewer').on('mousewheel.focal', _.bind(function(e) {
			e.preventDefault();
			var delta = e.delta || e.originalEvent.wheelDelta;
			var zoomOut = delta ? delta < 0 : e.originalEvent.deltaY > 0;
			this.$el.find('.image-viewer .image-container').panzoom('zoom', zoomOut, {
				increment: 0.1,
				animate: false,
				focal: e
			});
		}, this));
/*
		this.$el.find('.image-viewer .image-container').smartZoom({
			containerClass: 'zoomableContainer'
		});
*/
	}
});
