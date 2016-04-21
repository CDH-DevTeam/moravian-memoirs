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