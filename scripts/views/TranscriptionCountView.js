var Backbone = require('backbone');
var _ = require('underscore');
var $ = require('jquery');

module.exports = Backbone.View.extend({
	initialize: function() {
		console.log('TranscriptionCountView');

		this.$el.html('<div class="progress-bar"><div class="progress"></div></div><span class="number-label"><span class="page-number-label">Loading transcription data...</strong>')

		this.model = new Backbone.Model();
		this.model.url = window.apiUrl+'transcriptions/count';
		console.log(this.model.url);
		this.model.on('change', _.bind(function() {
			console.log(this.model);

			this.$el.find('.page-number-label').html('<strong>'+this.model.get('data').transcribed+'</strong> of '+this.model.get('data').total+' pages transcribed')

			this.$el.find('.progress').html(Math.round((this.model.get('data').transcribed/this.model.get('data').total)*100)+'%').css('width', (this.model.get('data').transcribed/this.model.get('data').total)*100+'%');
		}, this));
		this.model.fetch();
	}
});
