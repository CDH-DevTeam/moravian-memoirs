var $ = require('jquery');

$(function() {
	if ($('#appView').length > 0) {	
		var AppView = require('./views/AppView');
		window.appView = new AppView({
			el: $('#appView')
		});
	}
	else {
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

		if ($('.post-transcriptions').length > 0) {
			var _ = require('underscore');
			var TranscriptionThumbsView = require('./views/TranscriptionThumbsView');

			_.each($('.post-transcriptions'), function(archiveThumbs) {
				new TranscriptionThumbsView({
					el: $(archiveThumbs)
				});
			});
		}

		if ($('.tabs-control').length > 0) {
			var _ = require('underscore');
			var TabsView = require('./views/TabsView');

			_.each($('.tabs-control'), function(tabsControl) {
				new TabsView({
					el: $(tabsControl)
				});
			});
		}

		if ($('.transcriptions-search-container').length > 0) {
			var _ = require('underscore');
			var TranscriptionsSearchView = require('./views/TranscriptionsSearchView');

			_.each($('.transcriptions-search-container'), function(transcriptionsSearchContainer) {
				new TranscriptionsSearchView({
					el: $(transcriptionsSearchContainer)
				});
			});
		}
	}
});
