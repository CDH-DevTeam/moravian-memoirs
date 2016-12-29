var $ = require('jquery');

$(function() {
	if ($('#appView').length > 0) {	
		var AppView = require('./views/AppView');
		window.appView = new AppView({
			el: $('#appView')
		});
	}

	console.log($('#scripto'))

	if ($('#scripto').length > 0) {
		var ScriptoView = require('./views/ScriptoView');
		window.appView = new ScriptoView({
			el: $('#scripto')
		});
	}

	if ($('.transcription-archive-thumbs').length > 0) {
		var _ = require('underscore');
		var TranscriptionThumbsView = require('./views/TranscriptionThumbsView');

		_.each($('.transcription-archive-thumbs'), function(archiveThumbs) {
			new TranscriptionThumbsView({
				el: $(archiveThumbs)
			});
		});
	}
});
