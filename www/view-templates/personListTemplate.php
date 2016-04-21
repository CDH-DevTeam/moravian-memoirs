<script type="text/template" id="personListTemplate">

	<% _.each(models, function(model) { %>
		<tr data-id="<%= model.get('id') %>">
			<% if (showCheckBoxes) { %>
				<td><input data-id="<%= model.get('id') %>" class="item-check" type="checkbox"/></td>
			<% } %>
			<td><a class="row-name" href="#person/<%= model.get('id') %>"><%= model.get('surname') %></a></td>
			<td><a class="row-name" href="#person/<%= model.get('id') %>"><%= model.get('surname_literal') %></a></td>
			<td><a class="row-name" href="#person/<%= model.get('id') %>"><%= model.get('firstname') %></a></td>
			<td><%= model.get('birth').year %></td>
			<td><%= model.get('death').year %></td>
			<td><a href="#place/<%= model.get('birth').place.id %>"><%= model.get('birth').place.lat != undefined ? '<div class="table-marker location"></div>' : '' %><%= model.get('birth').place.name %></a></td>
			<td><a href="#place/<%= model.get('death').place.id %>"><%= model.get('death').place.lat != undefined ? '<div class="table-marker location"></div>' : '' %><%= model.get('death').place.name %></a></td>
		</tr>
	<% }); %>

</script>