<?php
/**
* Template Name: Transcriptions page
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