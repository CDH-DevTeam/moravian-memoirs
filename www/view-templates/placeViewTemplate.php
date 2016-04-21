<script type="text/template" id="placeViewTemplate">
	<div class="container">
		<div class="row">
			<div class="twelve columns">
				<h2 class="place-name"><%= metadata.name %></h2>
				<h4><%= metadata.area %></h4>
			</div>
		</div>

		<div class="row">
			<div class="ten columns">
				<p class="text-light"><%= models.length+' '+(models.length > 1 ? 'persons' : 'person') %> </p>
			</div>
			<div class="two columns">
				<a class="button" href="<%= collectionUrl %>" target="_blank">JSON Data</a>
			</div>
		</div>

		<hr/>

		<div class="row">
			<div class="twelve columns">
				<table class="u-full-width">

					<thead>
						<tr>
							<th>Firstname</a></th>
							<th>Surname</th>
							<th>Birthyear</th>
							<th>Deathyear</th>
							<th>Birthplace</th>
							<th>Deathplace</th>
						</tr>
					</thead>
				<% _.each(models, function(model) { %>
					<tr>
						<td><%= model.get('firstname') %></td>
						<td><%= model.get('surname') %></td>
						<td><%= model.get('birth') ? model.get('birth').year : '' %></td>
						<td><%= model.get('death') ? model.get('death').year : '' %></td>
						<td><%= model.get('birth') ? model.get('birth').place.name : '' %></td>
						<td><%= model.get('death') ? model.get('death').place.name : '' %></td>
					</tr>
				<% }) %>
			</div>
		</div>
	</div>
</script>