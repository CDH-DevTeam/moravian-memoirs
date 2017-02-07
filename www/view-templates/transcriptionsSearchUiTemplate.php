<script id="transcriptionSearchUITemplate" type="text/template">

	<div class="search-bar">

		<select class="search-language" data-search-key="language">
			<option value="all">Filter by language</option>
		</select>

		<select class="search-country" data-search-key="country">
			<option value="all">Filter by country</option>
		</select>

		<select class="search-archive" data-search-key="archive">
			<option value="all">Filter by archive</option>
		</select>

		<a class="show-all-button button u-pull-right">Show all</a>

		<br/>

		<input type="text" class="search-input"/>

		<button class="search-button button-primary">Search</button>

	</div>

	<hr class="narrow-top"/>
	
	<div class="list-container archive-list">
		<div class="loading">Loading...</div>
	</div>

	<div class="u-cf"></div>
	
</script>