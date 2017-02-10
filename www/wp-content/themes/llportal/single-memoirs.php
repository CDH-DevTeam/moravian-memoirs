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

			?>
				<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>

					<header class="entry-header">
						<?php
							if ( is_single() || is_home() ) {
								the_title( '<h2 class="entry-title">', '</h2>' );
							} else {
								the_title( '<h2 class="entry-title"><a href="' . esc_url( get_permalink() ) . '" rel="bookmark">', '</a></h2>' );
							}

							$posttags = get_the_tags();

							if ($posttags) {
								
							}

						?>
					</header><!-- .entry-header -->

					<?php dynamic_sidebar( 'under-title-sidebar' ); ?>

					<div class="entry-content">
						<?php
							global $post;
							$tags = wp_get_post_tags( $post->ID, array('fields' => 'slugs'));

							if (count($tags) > 0) {
								echo '<p><strong>View document metadata: </strong>';

								$count = 1;
								$docLinks = array();
								foreach ($tags as $tag) {
									array_push($docLinks, '<a href="'.site_url().'/map/#/places/document/'.$tag.'">['.$count.']</a>');
									$count++;
								}
								echo implode(', ', $docLinks);
								echo '</p>';
							}

							the_content( sprintf(
								/* translators: %s: Name of current post. */
								wp_kses( __( 'Continue reading %s <span class="meta-nav">&rarr;</span>', 'llportal' ), array( 'span' => array( 'class' => array() ) ) ),
								the_title( '<span class="screen-reader-text">"', '"</span>', false )
							) );

							wp_link_pages( array(
								'before' => '<div class="page-links">' . esc_html__( 'Pages:', 'llportal' ),
								'after'  => '</div>',
							) );

						?>
					</div><!-- .entry-content -->

				<?php
				/*
				?>
				<footer class="entry-footer">
					<?php llportal_entry_footer(); ?>
				</footer><!-- .entry-footer -->
				<?php
				*/
				?>
				</article><!-- #post-## -->


			<?php

		endwhile; // End of the loop.
		?>

		</main>
	</div>
</div>

<?php
// get_sidebar();
get_footer();
