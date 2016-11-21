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
});
