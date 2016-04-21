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