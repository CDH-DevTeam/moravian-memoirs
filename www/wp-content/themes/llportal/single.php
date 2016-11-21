<?php
/**
 * The template for displaying all single posts.
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/#single-post
 *
 * @package Lebenslauf_Portal
 */

get_header(); ?>

<div class="container">
	<div class="content-area row">
		<main class="site-main twelve columns" role="main">


		<?php
		while ( have_posts() ) : the_post();

			get_template_part( 'template-parts/content', get_post_format() );

//			the_post_navigation();

		endwhile; // End of the loop.
		?>

		</main>
	</div>
</div>

<?php
// get_sidebar();
get_footer();
