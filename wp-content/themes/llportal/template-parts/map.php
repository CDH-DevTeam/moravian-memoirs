<div id="appView">

	<div class="map-wrapper">

		<div class="map-header">
			<div class="container header-tabs-container">
				<div class="row">
					<div class="twelve columns header-tabs">
						<a class="selected places" href="#places">Places</a>
						<a class="movements" href="#movements">Movements</a>
					</div>
				</div>
			</div>
		</div>

		<div class="map-toolbar">
		</div>
		
		<div class="map-progress"><div class="indicator"></div></div>

		<div id="legends" class="map-legends"></div>

		<div id="mapContainer" class="map-container full"></div>

		<div class="map-timeline">
			<div class="slider-container">			
				<div id="yearRangeSlider"></div>
				<div class="year-labels">
					<div class="label">1500</div>
					<div class="label">1550</div>
					<div class="label">1600</div>
					<div class="label">1650</div>
					<div class="label">1700</div>
					<div class="label">1750</div>
					<div class="label">1800</div>
					<div class="label">1850</div>
					<div class="label">1900</div>
					<div class="label">1950</div>
					<div class="label">2000</div>
				</div>
			</div>
		</div>

		<div class="map-footer">
			<div class="viewmode-buttons">
				<a href="" class="button-circles selected" data-viewmode="circles">Circles</a>
				<a href="" class="button-heatmap" data-viewmode="heatmap">Heatmap</a>
				<a href="" class="button-clusters" data-viewmode="clusters">Clusters</a>
				<a href="" class="button-markers" data-viewmode="markers">Markers</a>
			</div>
			<div class="search-result-label"><span class="search-info"></span> <span class="results-info"></span></div>
		</div>

	</div>

	<div id="placeViewContainer" class="place-view">
	</div>

	<div class="overlay-container"></div>

</div>

<script type="text/template" id="placesMapControlsTemplate">
	<div class="container">
		<div class="row">
			<div class="two columns">
				<select id="yearRangeOption" class="map-search-control u-full-width">
					<option value="initial">Persons living within time range</option>
					<option value="birth">Persons born within time range</option>
					<option value="death">Persons who died within time range</option>
				</select>
			</div>
			<div class="two columns">
				<select id="relationOption" class="map-search-control u-full-width">
					<option value="initial">Show all places</option>
					<option value="birth">Show birth places</option>
					<option value="death">Show death places</option>
				</select>
			</div>
			<div class="two columns">
				<select id="genderOption" class="map-search-control u-full-width">
					<option value="initial">Gender</option>
					<option value="female">Females</option>
					<option value="male">Males</option>
				</select>
			</div>
			<div class="two columns">
				<input type="text" class="u-full-width" placeholder="Name search" />
			</div>
			<div class="two columns">
				<button class="update-map-button button-primary u-full-width">Update map</button>
			</div>
			<div class="two columns">
				<a class="update-map-button button u-full-width json-button" target="_blank">JSON data</a>
			</div>
		</div>
	</div>			
</script>

<script type="text/template" id="movementsMapControlsTemplate">
	<div class="container">
		<div class="row">
			<div class="four columns">
				<select id="yearRangeOption" class="map-search-control u-full-width">
					<option value="initial">Persons living within time range</option>
					<option value="birth">Persons born within time range</option>
					<option value="death">Persons who died within time range</option>
				</select>
			</div>
			<div class="four columns">
				<select id="genderOption" class="map-search-control u-full-width">
					<option value="initial">Gender</option>
					<option value="female">Females</option>
					<option value="male">Males</option>
				</select>
			</div>
			<div class="two columns">
				<button class="update-map-button button-primary u-full-width">Update map</button>
			</div>
			<div class="two columns">
				<a class="update-map-button button u-full-width json-button" target="_blank">JSON data</a>
			</div>
		</div>
	</div>			
</script>

<script type="text/template" id="mapLegendsTemplate">

	<div class="legends-item">
		<div class="circle" style="width: <%= ((minValue/maxValue)*30)+2 %>px; height: <%= ((minValue/maxValue)*30)+2 %>px"></div>
		<div class="label"><%= Math.round(minValue) %></div>
	</div>

	<div class="legends-item">
		<div class="circle" style="width: <%= ((Math.round((minValue+maxValue)/2)/maxValue)*30)+2 %>px; height: <%= ((Math.round((minValue+maxValue)/2)/maxValue)*30)+2 %>px"></div>
		<div class="label"><%= Math.round((minValue+maxValue)/2) %></div>
	</div>

	<div class="legends-item">
		<div class="circle" style="width: <%= 32 %>px; height: <%= 32 %>px"></div>
		<div class="label"><%= Math.round(maxValue) %></div>
	</div>

</script>

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

<script type="text/template" id="personListViewTemplate">
	<div class="row">

		<div class="twelve columns">

			<table class="u-full-width">

				<thead>
					<tr>
						<th width="5%"><div class="check-all"></div></th>
						<th width="40%"><a class="column-sort" href="#" data-sort="surname">Surname</a></th>
						<th width="40%"><a class="column-sort" href="#" data-sort="surname_literal">Surname (literal)</a></th>
						<th width="40%"><a class="column-sort" href="#" data-sort="firstname">Firstname</a></th>
						<th width="40%"><a class="column-sort" href="#" data-sort="birth_year">Birthyear</a></th>
						<th width="40%"><a class="column-sort" href="#" data-sort="death_year">Deathyear</a></th>
						<th width="40%">Birthplace</th>
						<th width="40%">Deathplace</th>
					</tr>
				</thead>

				<tbody class="list-container">

				</tbody>

			</table>

		</div>

	</div>

	<div class="footer-toolbar">
		<div class="container">
			<div class="row">				
				<div class="four columns">
					<a class="button prev">Prev</a>
					<a class="button next">Next</a>
					<span class="page-info"></span>
				</div>
				<div class="eight columns">
					<div style="display: none" class="u-pull-left combine-controls">
						<a class="button button-primary combine-button">Combine <span class="checked-number"></span> persons</a>
						<select class="combine-persons-select u-full-width" style="max-width: 50%"></select>
					</div>
					<input type="text" class="search-input u-pull-right" placeholder="Search">
				</div>
			</div>
		</div>
	</div>
</script>

<script type="text/template" id="placeViewTemplate">

	<div class="row">
		<div class="twelve columns">
			<h2 style="margin-bottom: 10px"><%= model.get('name') %></h2>
			<h5>(<%= model.get('name_en') %>)</h5>
		</div>
	</div>

	<hr/>

	<div class="row">
		<div class="six columns">
			<label for="nameInput">Name:</label>
			<input class="u-full-width" type="text" data-bind="name" value="<%= model.get('name') %>" id="nameInput">
		</div>
		<div class="six columns">
			<label for="nameEnInput">Name (en):</label>
			<input class="u-full-width" type="text" data-bind="name_en" value="<%= model.get('name_en') %>" id="nameEnInput">
		</div>
	</div>

	<div class="row">
		<div class="six columns">
			<label for="areaInput">Area:</label>
			<input class="u-full-width" type="text" data-bind="area" value="<%= model.get('area') %>" id="areaInput">
		</div>
		<div class="six columns">
			<label for="areaEnInput">Area (en):</label>
			<input class="u-full-width" type="text" data-bind="area_en" value="<%= model.get('area_en') %>" id="areaEnInput">
		</div>
	</div>

	<hr/>

	<div class="row">
		<div class="six columns">
			<label>Original name:</label>
			<input class="u-full-width" type="text" readonly value="<%= model.get('name_ll') %>">
		</div>
		<div class="six columns">
			<label>Original area:</label>
			<input class="u-full-width" type="text" readonly value="<%= model.get('area_ll') %>">
		</div>
	</div>

	<hr/>

	<% if (model.get('google_id') != undefined) { %>
		<div class="row">
			<div class="four columns">
				<label for="googleIdInput">Google ID:</label>
				<input class="u-full-width" type="text" readonly value="<%= model.get('google_id') %>" id="googleIdInput">
			</div>
			<div class="four columns">
				<label for="googleNameInput">Google Name:</label>
				<input class="u-full-width" type="text" readonly value="<%= model.get('google_name') %>" id="googleNameInput">
			</div>
			<div class="four columns">
				<label for="googleLocationTypeInput">Google Location Type:</label>
				<input class="u-full-width" type="text" readonly value="<%= model.get('google_location_type') %>" id="googleLocationTypeInput">
			</div>
		</div>

		<hr/>
	<% } %>

	<div class="row">
		<% if (model.get('lat') != undefined) { %>
			<div class="eight columns">
				<label>Location:</label>
				<div class="map-container"></div>
				<div class="row" style="margin-top:20px">
					<div class="six columns">
						<label for="latInput">Latitude:</label>
						<input class="u-full-width latlng-input" data-bind="lat" type="text" value="<%= model.get('lat') %>" id="latInput">
					</div>
					<div class="six columns">
						<label for="lngInput">Longitude:</label>
						<input class="u-full-width latlng-input" data-bind="lng" type="text" value="<%= model.get('lng') %>" id="lngInput">
					</div>
				</div>
				<div class="row">
					<input placeholder="Address lookup" class="geo-lookup-input" type="text" id="geoLookupInput"/>
					<a class="button button-primary geo-lookup-button">Lookup</a>
					<a class="button geo-lookup-clear-button">Clear results</a>
				</div>
			</div>
			<div class="four columns">
				<label>Google Address:</label>
				<div class="u-cf"></div>
				<ul>
					<% _.each(model.get('google_address'), function(addressString) { %>
						<li><%= addressString.long_name %> [<%= addressString.types.join('; ') %>]</li>
					<% }) %>
				</ul>
			</div>
		<% } else { %>
			<div class="twelve columns">
				<a class="button button-primary add-location-button">Add Location</a>
			</div>
		<% } %>
	</div>

	<hr/>

	<div class="row">
		<div class="twelve columns">
			<label for="commentaryInput">Commentary:</label>
			<textarea class="u-full-width" data-bind="commentary" id="commentaryInput"><%= model.get('commentary') %></textarea>
		</div>
	</div>

	<hr/>

	<div class="row person-list-container">
		<div class="twelve columns">
			<h4>Persons</h4>
			<table class="u-full-width">

				<thead>
					<tr>
						<th width="40%">Surname</th>
						<th width="40%">Surname (literal)</th>
						<th width="40%">Firstname</th>
						<th width="40%">Birthyear</th>
						<th width="40%">Deathyear</th>
						<th width="40%">Birthplace</th>
						<th width="40%">Deathplace</th>
					</tr>
				</thead>

				<tbody class="list-container">

				</tbody>
			</table>
		</div>
	</div>

	<div class="footer-toolbar">
		<div class="container">
			<div class="row">
				<div class="twelve columns">
					<a class="button" onclick="javascript:history.go(-1)">Go back</a>
					<a class="button button-primary u-pull-right save-button">Save</a>
				</div>
			</div>
		</div>
	</div>

</script>

<script type="text/template" id="personViewTemplate">

	<div class="row">
		<div class="twelve columns">
			<h2><%= model.get('surname') %>, <%= model.get('firstname') %></h2>
			<p><b>Lebenslauf ID:</b> <%= model.get('ll_id') %></p>
		</div>
	</div>

	<hr/>

	<div class="row">
		<div class="three columns">
			<label for="surnameInput">Surname:</label>
			<input class="u-full-width" data-bind="surname" type="text" value="<%= model.get('surname') %>" id="surnameInput">
		</div>
		<div class="three columns">
			<label for="surnameLiteralInput">Surname (literal):</label>
			<input class="u-full-width" data-bind="surname_literal" type="text" value="<%= model.get('surname_literal') %>" id="surnameLiteralInput">
		</div>
		<div class="three columns">
			<label for="firstnameInput">Firstname:</label>
			<input class="u-full-width" data-bind="firstname" type="text" value="<%= model.get('firstname') %>" id="firstnameInput">
		</div>
		<div class="three columns">
			<label for="genderInput">Gender:</label>
			<select class="u-full-width" data-bind="gender") id="genderInput">
				<option></option>
				<option value="female"<%= model.get('gender') == 'female' ? ' selected="selected"' : '' %>>Female</option>
				<option value="male"<%= model.get('gender') == 'male' ? ' selected="selected"' : '' %>>Male</option>
			</select>
		</div>
	</div>

	<hr/>

	<div class="row">
		<div class="four columns">
			<label for="birthDayInput">Birth day:</label>
			<input class="u-full-width" data-bind="birth" data-bind-key="day" type="text" value="<%= model.get('birth').day %>" id="birthDayInput">
		</div>
		<div class="four columns">
			<label for="birthMonthInput">Birth month:</label>
			<input class="u-full-width" data-bind="birth" data-bind-key="month" type="text" value="<%= model.get('birth').month %>" id="birthMonthInput">
		</div>
		<div class="four columns">
			<label for="birthYearInput">Birth year:</label>
			<input class="u-full-width" data-bind="birth" data-bind-key="year" type="text" value="<%= model.get('birth').year %>" id="birthYearInput">
		</div>
	</div>

	<hr/>

	<div class="row">
		<div class="four columns">
			<label for="deathDayInput">Death day:</label>
			<input class="u-full-width" type="text" value="<%= model.get('death').day %>" id="deathDayInput">
		</div>
		<div class="four columns">
			<label for="deathMonthInput">Death month:</label>
			<input class="u-full-width" type="text" value="<%= model.get('death').month %>" id="deathMonthInput">
		</div>
		<div class="four columns">
			<label for="deathYearInput">Death year:</label>
			<input class="u-full-width" type="text" value="<%= model.get('death').year %>" id="deathYearInput">
		</div>
	</div>

	<hr/>

	<div class="row">
		<div class="six columns">
			<label for="birthPlaceInput">Birthplace:</label>
			<input class="u-full-width" readonly type="text" value="<%= model.get('birth').place.name %>" id="birthPlaceInput">
			<% if (model.get('birth').place.lat != undefined) { %>
				<div class="map-container birthplace"></div>
			<% } %>
			<br/><a class="button" href="#place/<%= model.get('birth').place.id %>">View place</a>
		</div>
		<div class="six columns">
			<label for="deathPlaceInput">Deathplace:</label>
			<input class="u-full-width" readonly type="text" value="<%= model.get('death').place.name %>" id="deathPlaceInput">
			<% if (model.get('death').place.lat != undefined) { %>
				<div class="map-container deathplace"></div>
			<% } %>
			<br/><a class="button" href="#place/<%= model.get('death').place.id %>">View place</a>
		</div>
	</div>

	<div class="footer-toolbar">
		<div class="container">
			<div class="row">
				<div class="twelve columns">
					<a class="button" onclick="javascript:history.go(-1)">Go back</a>
					<a class="button button-primary u-pull-right save-button">Save</a>
				</div>
			</div>
		</div>
	</div>

</script>

<script src="/wp-content/themes/llportal/js/app.min.js"></script>