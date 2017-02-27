var $ = require('jquery');

$(function() {
	/*
	Initialize the Map/Metadata interface
	If <div id="appView"> is present, we create a new AppView
	*/
	if ($('#appView').length > 0) {	
		var AppView = require('./views/AppView');
		window.appView = new AppView({
			el: $('#appView')
		});
	}
	else {
		/*
		Initialize ScriptoView if <div id="scripto"> is present
		*/
		if ($('#scripto').length > 0) {
			var ScriptoView = require('./views/ScriptoView');
			window.appView = new ScriptoView({
				el: $('#scripto')
			});
		}

		/*
		Initialize TranscriptionThumbsView which show indicator of
		if transcription is available for an image or not.
		*/
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

		/*
		Initialize tabs if tabs divs are present
		*/
		if ($('.tabs-control').length > 0) {
			var _ = require('underscore');
			var TabsView = require('./views/TabsView');

			_.each($('.tabs-control'), function(tabsControl) {
				new TabsView({
					el: $(tabsControl)
				});
			});
		}

		/*
		Initialize search view for transcriptions on the /transcribe page
		*/
		if ($('.transcriptions-search-container').length > 0) {
			var _ = require('underscore');
			var TranscriptionsSearchView = require('./views/TranscriptionsSearchView');

			_.each($('.transcriptions-search-container'), function(transcriptionsSearchContainer) {
				new TranscriptionsSearchView({
					el: $(transcriptionsSearchContainer)
				});
			});
		}

		/*
		Initialize transcription progress indicator on /transcribe
		*/
		if ($('.transcription-status').length > 0) {
			var _ = require('underscore');
			var TranscriptionCountView = require('./views/TranscriptionCountView');

			_.each($('.transcription-status'), function(transcriptionsCountContainer) {
				new TranscriptionCountView({
					el: $(transcriptionsCountContainer)
				});
			});
		}
	}
});
