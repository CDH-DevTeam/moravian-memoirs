<script id="listItemTemplate" type="text/template">

	<a class="item-title">

		<div class="title"><strong><%= model.get('surname') ? model.get('surname')+', ' : '' %><%= model.get('firstname') %></strong> <%= model.get('birth_year') %>-<%= model.get('death_year') %></div>
		<div class="title-attribs">
			<div class="attrib-item">
				<%= model.get('birthplacename') || model.get('birthplacearea') ? '<span class="symbol">&sstarf;</span> '+(model.get('birthplacelat') ? '<span class="item-map-marker"></span>' : '') : ''%><%= model.get('birthplacename') %><%= model.get('birthplacename') && model.get('birthplacearea') ? ', ' : '' %><%= model.get('birthplacearea') %> 
			</div>
			<div class="attrib-item">
				<%= model.get('deathplacename') || model.get('deathplacearea') ? '<span class="symbol">&dagger;</span> '+(model.get('deathplacelat') ? '<span class="item-map-marker"></span>' : '') : ''%><%= model.get('deathplacename') %><%= model.get('deathplacename') && model.get('deathplacearea') ? ', ' : '' %><%= model.get('deathplacearea') %>
			</div>
		</div>
	</a>

	<div class="item-content">

		<div class="row">

			<div class="six columns">
				<h3><%= model.get('surname') ? model.get('surname')+', ' : '' %><%= model.get('firstname') %></h3>
			</div>

			<div class="six columns">
				<p class="u-pull-right"><strong><%= model.get('birth_day') ? model.get('birth_day')+'.' : '' %><%= model.get('birth_month') ? model.get('birth_month')+'.' : '' %><%= model.get('birth_year') ? model.get('birth_year') : '' %></strong> - <strong><%= model.get('death_day') ? model.get('death_day')+'.' : '' %><%= model.get('death_month') ? model.get('death_month')+'.' : '' %><%= model.get('death_year') ? model.get('death_year') : '' %></strong></p>
			</div>

		</div>

		<div class="row">

			<div class="six columns">
				<p>
					<strong>Birth place: </strong> <%= model.get('birthplacename') %>, <%= model.get('birthplacearea') %><br/>
					<strong>Death place: </strong> <%= model.get('deathplacename') %>, <%= model.get('deathplacearea') %></p>
					<% if (model.get('surname_maiden')) { %>
						<p><strong>Maiden name:</strong> <%= model.get('surname_maiden') %><br/>
					<% } %>
					<% if (model.get('gender')) { %>
						<strong>Gender:</strong> <%= model.get('gender') == 0 ? 'male' : model.get('gender') == 1 ? 'female' : '?' %><br/>
					<% } %>
					<% if (model.get('familystatus')) { %>
						<strong>Marital status:</strong> <%= model.get('familystatus') %>
					<% } %>
				</p>
			</div>

			<div class="six columns">

				<% if (model.get('birthplacelat') || model.get('deathplacelat')) { %>
					<div class="map-container"></div>
				<% } %>

			</div>

		</div>

		<hr/>

		<div class="row">

			<div class="twelve columns">
				<h4>Lebenslaufs</strong></h4>

				<div class="table-container">
					<table width="100%">
						<tr>
							<th>Source archive</th>
							<th>Document reference</th>
							<th></th>
						</tr>
						<% _.each(model.get('documents'), function(document, index) { %>
							<tr>
				
								<td><%= document.comment || document.fulltext ? '<a href="#" class="table-item" data-index="'+index+'">' : '' %><%= document.archive == 1 ? 'Herrnhut' : document.archive == 2 ? 'Bethlehem' : 'Unknown' %><%= document.comment || document.fulltext ? '</a>' : '' %></td>
								<td><%= document.comment || document.fulltext ? '<a href="#" class="table-item" data-index="'+index+'">' : '' %><%= document.ll_id  %><%= document.reference ? ', '+document.reference : ''  %><%= document.comment || document.fulltext ? '</a>' : '' %></td>
								<td><%= document.ownhand == 1 ? 'Own hand' : ''  %></td>

							</tr>
							<tr>
								<td colspan="3" class="table-sub table-info-<%= index %>">
									<p><strong>Comment:</strong> <%= document.comment %></p>
									<% if (document.fulltext) { %>
										<button class="button">View</button>
									<% } %>
								</td>
							</td>
						<% }); %>
					</table>

				</div>
			</div>

		</div>

	</div>

</script>