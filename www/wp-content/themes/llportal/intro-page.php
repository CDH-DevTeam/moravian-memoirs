<?php
/**
 * Template Name: Intro Page
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package Lebenslauf_Portal
 */

get_header(); ?>

<div class="container">
	<div class="content-area row">
		<main class="site-main twelve columns" role="main">

			<?php
			while ( have_posts() ) : the_post();

				get_template_part( 'template-parts/content', 'page' );

			endwhile; // End of the loop.
			?>

		</main>
	</div>

	<div class="row">
		<div class="twelve columns">
			<?php
				get_sidebar();
			?>
		</div>
	</div>

</div>

<?php

get_footer();

?>