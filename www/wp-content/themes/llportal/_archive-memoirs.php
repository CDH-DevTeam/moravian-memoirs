<?php
/**
 * The template for displaying archive pages.
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
		if ( have_posts() ) : ?>
			<header class="page-header">
				<?php
					the_archive_title( '<h1 class="page-title">', '</h1>' );
					the_archive_description( '<div class="taxonomy-description">', '</div>' );
				?>
			</header><!-- .page-header -->

			<?php dynamic_sidebar( 'under-title-sidebar' ); ?>


			<?php

		else :

			get_template_part( 'template-parts/content', 'none' );

		endif; ?>

		</main>

		<div class="twelve columns tabs-control">
			<ul class="tabs">

				<li><a data-tab="tab1">Discover documents</a></li>
				<li><a data-tab="tab2">Where to start?</a></li>
				<li><a data-tab="tab3">Documents map</a></li>

			</ul>

			<div class="tabs-content">

				<div id="tab1" class="tab">
					<div class="archive-list">

					<?php
					/* Start the Loop */
					while ( have_posts() ) : the_post();

						/*
						 * Include the Post-Format-specific template for the content.
						 * If you want to override this in a child theme, then include a file
						 * called content-___.php (where ___ is the Post Format name) and that will be used instead.
						 */
						get_template_part( 'template-parts/content', get_post_format() );

					endwhile;

					the_posts_navigation(); ?>

					</div>

					<div class="u-cf"></div>

				</div>

				<div id="tab2" class="tab">
					<?php dynamic_sidebar( 'transcriptions-tab-2' ); ?>
				</div>

				<div id="tab3" class="tab">
					<?php dynamic_sidebar( 'transcriptions-tab-3' ); ?>
				</div>

			</div>

		</div>

	</div><!-- #primary -->
</div>

<?php

get_footer();
