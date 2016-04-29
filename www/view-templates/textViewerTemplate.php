<script id="textViewerTemplate" type="text/template">

	<div class="overlay"></div>

	<div class="text-content">
		<div class="container">
			<div class="row">
				<div class="twelve columns">
					<h2><%= title %></h2>
				</div>
			</div>
			<div class="row">
				<div class="nine columns">
					<%= html %>
				</div>
				<div class="three columns">
					<% if (images != undefined) { %>
						<% _.each(images, function(image) { %>
							<img src="/document_images/thumbs/<%= image %>"/>
						<% }) %>
					<% } %>
				</div>
			</div>
		</div>
	</div>

	<a class="close-button"><span class="icon-close"></span></a>

</script>