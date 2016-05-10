<script id="mapPopupTemplate" type="text/template">
	<strong><%= model.get('name') %></strong><br/>
	<i><%= model.get('area') %></i><br/>
	<%= model.get('c') %> <%= (model.get('c') == 1 ? 'person' : 'persons') %><br/><br/>
	<p><b>Restrict search by this place</b>
	<ul>
		<li><a href="#" class="place-view-link" data-place-id="<%= model.get('id') %>" data-action="birth" data-place-name="<%= model.get('name') %>">as a birth place</a></li>
		<li><a href="#" class="place-view-link" data-place-id="<%= model.get('id') %>" data-action="death" data-place-name="<%= model.get('name') %>">as a death place</a></li>
		<li><a href="#" class="place-view-link" data-place-id="<%= model.get('id') %>" data-action="both" data-place-name="<%= model.get('name') %>">as birth place or death place</a></li>
	</ul>
</script>
