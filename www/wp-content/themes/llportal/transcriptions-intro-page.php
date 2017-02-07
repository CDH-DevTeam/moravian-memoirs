<?php
/**
* Template Name: Transcriptions intro page
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package Lebenslauf_Portal
 */

get_header(); ?>

<div class="container">
	<div class="content-area">
		<main class="site-main twelve columns" role="main">

			<?php
			while ( have_posts() ) : the_post();

				get_template_part( 'template-parts/content', 'page' );

			endwhile; // End of the loop.
			?>

		</main>

		<div class="twelve columns tabs-control">
			<ul class="tabs">

				<li><a data-tab="tab1">Discover documents</a></li>
				<li><a data-tab="tab2">Where to start?</a></li>
				<li><a data-tab="tab3">Documents map</a></li>

			</ul>

			<div class="tabs-content">

				<div id="tab1" class="tab">
					<?php dynamic_sidebar( 'transcriptions-tab-1' ); ?>
				</div>

				<div id="tab2" class="tab">
					<?php dynamic_sidebar( 'transcriptions-tab-2' ); ?>
				</div>

				<div id="tab3" class="tab">
					<?php dynamic_sidebar( 'transcriptions-tab-3' ); ?>
				</div>

			</div>

		</div>

		<?php
		//	get_sidebar();
		?>
		
	</div>
</div>

<?php

if (!function_exists( 'get_home_path' )) {
	require_once( ABSPATH.'wp-admin/includes/file.php');
}

include get_home_path()."view-templates/transcriptionsSearchUiTemplate.php";
include get_home_path()."view-templates/transcriptionSearchListTemplate.php";

get_footer();


?>