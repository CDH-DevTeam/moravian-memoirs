<script id="transcriptionSearchListTemplate" type="text/template">

	<% _.each(models, function(model) { %>

		<a href="<%= model.get('link') %>" id="post-<%= model.get('id') %>" class="post-<%= model.get('id') %> post type-post status-publish format-standard hentry category-transcriptions">
			<h2 class="entry-title"><%= model.get('title').rendered %></h2>

			<div class="summary">
				<%= model.get('excerpt').rendered %>
			</div>

			<div class="transcription-archive-thumbs" data-id="<%= model.get('id') %>">
				<% _.each(model.get('media'), function(media) { %>
					<span class="thumb" data-id="<%= media.id %>"><img src="<%= media.thumb %>" class="attachment-thumbnail size-thumbnail" alt=""></span>
				<% }) %>
			</div
		</a>

	<% }) %>
	
</script>