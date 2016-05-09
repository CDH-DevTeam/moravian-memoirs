<script type="text/template" id="movementsMapControlsTemplate">
	<div class="container">
		<div class="row">
			<div class="ten columns form-container">

				<div class="form-item">
					<input id="nameInput" type="text" class="map-search-control" placeholder="Name" />
				</div>

				<div class="form-item">
					<select id="genderOption" class="map-search-control">
						<option value="initial">Both genders</option>
						<option value="female">Females</option>
						<option value="male">Males</option>
					</select>
				</div>

				<div class="form-item">
					<input id="placeNameInput" type="text" class="map-search-control" placeholder="Placename" />

					<select id="placeNameOptions" class="map-search-control form-input-settings">
						<option value="initial">Birth and death places</option>
						<option value="birth">Birth place</option>
						<option value="death">Death place</option>
					</select>
				</div>

				<div class="form-item">
					<select id="archiveOption" class="map-search-control">
						<option value="initial">From all archives</option>
						<option value="1">From Herrnhut</option>
						<option value="2">From Bethlehem</option>
					</select>
				</div>

				<div class="form-item">
					<button class="button more-form-button">...</button>
				</div>

				<div class="form-extra">
					<label>Name options</label>
					<div class="form-item">
						<input id="firstnameInput" type="text" class="map-search-control" placeholder="Firstname" />
					</div>

					<div class="form-item">
						<input id="surnameInput" type="text" class="map-search-control" placeholder="Surname" />
					</div>

					<br/>

					<div class="form-item">
						<label for="yearRangeOption">Time range</label>
						<select id="yearRangeOption" class="map-search-control">
							<option value="initial">Search for persons living within selected time range</option>
							<option value="birth">Search for persons born within time selected range</option>
							<option value="death">Search for persons who died within selected time range</option>
						</select>
					</div>
				</div>

			</div>
			<div class="two columns">

				<button class="update-map-button button-primary u-full-width" style="margin-bottom: 5px">Search</button>

			</div>
		</div>
	</div>			
</script>