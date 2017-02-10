var Backbone = require('backbone');
var _ = require('underscore');
var $ = require('jquery');

var panZoom = require('../lib/jquery.panzoom.min');

//var jsPanZoom = require('../lib/jquery.jspanzoom');
//var zoom = require('../lib/e-smart-zoom-jquery');

module.exports = Backbone.View.extend({
	germanChars: [
		'Ä',
		'ä',
		'Ö',
		'ö',
		'Ü',
		'ü',
		'ß'
	],

	events: {
		'click .view-buttons button': 'viewButtonClick'
	},

	viewButtonClick: function(event) {
		event.preventDefault();

		console.log(this.$el)

		if ($(event.currentTarget).data('action') == 'side-view') {
			this.$el.addClass('side-view');
		}
		if ($(event.currentTarget).data('action') == 'vertical-view') {
			this.$el.removeClass('side-view');
		}
		if ($(event.currentTarget).data('action') == 'fullscreen') {
			this.$el.toggleClass('fullscreen-view');
		}
	},

	editorKeyDown: function(event) {

		if (event.data.$.altKey && event.data.$.shiftKey) {
			event.data.$.preventDefault();
			
			if (event.data.$.code == 'ArrowUp') {
				this.zoomImage.pan(0, 50, {
					relative: true,
					animate: true
				});
			}
			if (event.data.$.code == 'ArrowDown') {
				this.zoomImage.pan(0, -50, {
					relative: true,
					animate: true
				});
			}
			if (event.data.$.code == 'ArrowLeft') {
				this.zoomImage.pan(50, 0, {
					relative: true,
					animate: true
				});
			}
			if (event.data.$.code == 'ArrowRight') {
				this.zoomImage.pan(-50, 0, {
					relative: true,
					animate: true
				});
			}
			if (event.data.$.code == 'KeyN') { // zoom in
				this.zoomImage.zoom()
			}
			if (event.data.$.code == 'KeyM') { // zoom out
				this.zoomImage.zoom(true)
			}
		}
	},

	initialize: function() {
		this.textArea = this.$el.find('textarea[name="scripto_transcripton"]');

		this.$el.find('.image-viewer .image-container').panzoom({
			panOnlyWhenZoomed: false,
			
			$zoomIn: this.$el.find('.zoom-in-button'),
			$zoomOut: this.$el.find('.zoom-out-button')
		});

		this.zoomImage = this.$el.find('.image-viewer .image-container').panzoom("instance");

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

		CKEDITOR.config.height = 500;
		CKEDITOR.config.autoParagraph = false;
		CKEDITOR.config.enterMode = CKEDITOR.ENTER_BR;
		CKEDITOR.config.allowedContent = true;
		CKEDITOR.config.extraPlugins = 'codemirror,specialchar';

		CKEDITOR.config.codemirror = {
			styleActiveLine: false,
			theme: '3024-custom'
		};

		CKEDITOR.config.specialChars = this.germanChars;

		CKEDITOR.stylesSet.add('my_styles', [
			{
				name: 'Emphasized ', 
				element: 'emph'
			},
			{
				name: 'Date', 
				element: 'date'
			},
			{
				name: 'Person', 
				element: 'name'
			},
			{
				name: 'Place', 
				element: 'placeName'
			},
		]);

		CKEDITOR.config.stylesSet = 'my_styles';

		CKEDITOR.dtd.body.date = 1;
		CKEDITOR.dtd.body.name = 1;
		CKEDITOR.dtd.body.placeName = 1;
		CKEDITOR.dtd.body.emph = 1;

		CKEDITOR.replace('scripto_transcripton', {
			toolbar: [
				{ name: 'document', items: [ 'Source', '-', 'NewPage', 'Preview', '-', 'Templates' ] },	// Defines toolbar group with name (used to create voice label) and items in 3 subgroups.
				[ 'Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo', '-', 'SpecialChar' ],			// Defines toolbar group without name.
				'/',																					// Line break - next group will be placed in new line.
				{ name: 'basicstyles', items: [/* 'Bold', 'Italic', */'Styles' ] }
			]
		});

		CKEDITOR.instances.scripto_transcripton.on('contentDom', _.bind(function() {
			CKEDITOR.instances.scripto_transcripton.document.on('keydown', _.bind(this.editorKeyDown, this));
		}, this));
	}
});
