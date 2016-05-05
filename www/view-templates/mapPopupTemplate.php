<script id="mapPopupTemplate" type="text/template">
	<strong><%= model.get('name') %></strong><br/>
	<i><%= model.get('area') %></i><br/>
	<%= model.get('c') %> <%= (model.get('c') == 1 ? 'person' : 'persons') %><br/><br/>
<!--	<a href="#" class="place-view-link" data-placeId="<%= model.get('id') %>">More information</a>-->
</script>
