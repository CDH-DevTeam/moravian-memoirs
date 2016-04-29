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
			<div class="toolbar-content"></div>

			<div class="container">
				<div class="row">
					<div class="ten columns form-container">
						<div class="form-extra">

							<div class="slider-container">							
								<div id="yearRangeSlider"></div>
							</div>
							
						</div>
					</div>
				</div>
			</div>

			<div class="map-progress"><div class="indicator"></div></div>

		</div>
		
		<div id="legends" class="map-legends map-overlay-box"></div>

		<div class="viewmode-buttons map-overlay-box">
			<a href="" class="icon-circle button-circles selected" data-viewmode="circles" alt="Circles"></a>
			<a href="" class="icon-heatmap button-heatmap" data-viewmode="heatmap" alt="Heatmap"></a>
			<a href="" class="icon-cluster button-clusters" data-viewmode="clusters" alt="Clusters"></a>
			<a href="" class="icon-marker button-markers" data-viewmode="markers" alt="Markers"></a>
		</div>


		<div id="mapContainer" class="map-container full"></div>

	</div>

	<div class="hitlist-container wrapper bg-gray">

		<div class="container">

			<div id="graphViewContainer"></div>

			<div id="hitlistViewContainer"></div>

		</div>

	</div>

	<div id="placeViewContainer" class="place-view"></div>

	<div class="overlay-container"></div>

</div>

<div id="textViewer" class="text-viewer"></div>

<?php

	if (!function_exists( 'get_home_path' )) {
		require_once( ABSPATH.'wp-admin/includes/file.php');
	}

	include get_home_path()."view-templates/placesMapControlsTemplate.php";
	include get_home_path()."view-templates/movementsMapControlsTemplate.php";
	include get_home_path()."view-templates/mapLegendsTemplate.php";
	include get_home_path()."view-templates/placeViewTemplate.php";
	include get_home_path()."view-templates/personListTemplate.php";
	include get_home_path()."view-templates/personListViewTemplate.php";
	include get_home_path()."view-templates/hitlistUiTemplate.php";
	include get_home_path()."view-templates/listItemTemplate.php";
	include get_home_path()."view-templates/graphViewTemplate.php";
	include get_home_path()."view-templates/textViewerTemplate.php";

?>

<script src="../js/app.min.js"></script>