<script id="textViewerTemplate" type="text/template">

	<div class="overlay"></div>

	<div class="text-content">
		<div class="container">
			<div class="row">
				<div class="twelve columns">
					<h2><%= document.surname %>, <%= document.firstname %></h2>

					<p class="u-pull-right">Reference: <%= document.ll_id  %><%= document.reference ? ', '+document.reference : ''  %></p>

					<h3><%= document.birth_day ? document.birth_day+'.' : '' %><%= document.birth_month ? document.birth_month+'.' : '' %><%= document.birth_year ? document.birth_year : '' %> - <%= document.death_day ? document.death_day+'.' : '' %><%= document.death_month ? document.death_month+'.' : '' %><%= document.death_year ? document.death_year : '' %></h3>
				</div>
			</div>
			<div class="row">
				<div class="nine columns">
					<%= document.doc_text %>
				</div>
				<div class="three columns images">
					<% if (images != undefined) { %>
						<% _.each(images, function(image) { %>
							<a target="_blank" href="/document_images/<%= image %>"><img src="/document_images/thumbs/<%= image %>"/></a>
						<% }) %>
					<% } %>
				</div>
			</div>
		</div>
	</div>

	<a class="close-button"><span class="icon-close"></span></a>

</script>