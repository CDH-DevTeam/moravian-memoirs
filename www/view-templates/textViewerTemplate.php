<script id="textViewerTemplate" type="text/template">

	<div class="overlay"></div>

	<div class="text-content">
		<div class="container">
			<div class="row">
				<div class="twelve columns">
					<h2><%= document.surname ? document.surname+', ' : document.surname_literal ? document.surname_literal+', ' : '' %><%= document.firstname %></h2>

					<p class="u-pull-right"><strong>Reference</strong>: <%= document.ll_id  %><%= document.reference ? ', '+document.reference : ''  %></p>

					<h3><%= document.birth_day ? document.birth_day+'.' : '' %><%= document.birth_month ? document.birth_month+'.' : '' %><%= document.birth_year ? document.birth_year : '' %> - <%= document.death_day ? document.death_day+'.' : '' %><%= document.death_month ? document.death_month+'.' : '' %><%= document.death_year ? document.death_year : '' %></h3>
				</div>
			</div>
			<div class="row">
				<div class="nine columns">
					<p><a href="<%= document.transcriptions.wp_url %>">Link to transcription page</a></p>
					<% _.each(document.transcriptions.transcriptions, function(transcription) { %>
						<p><%= transcription.transcription %></p>
					<% }) %>
				</div>
				<div class="three columns images">
					<% _.each(document.transcriptions.transcriptions, function(transcription) { %>
						<a target="_blank" href="<%= transcription.url %>"><img src="<%= transcription.medium %>"/></a>
					<% }) %>
				</div>
			</div>
		</div>
	</div>

	<a class="close-button"><span class="icon-close"></span></a>

</script>