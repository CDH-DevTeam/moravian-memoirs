<script id="listItemTemplate" type="text/template">

	<div class="list-item">

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


				<div class="twelve columns">
				</div>
			</div>

		</div>

	</div>

</script>