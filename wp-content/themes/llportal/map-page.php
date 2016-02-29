<?php
/**
* Template Name: Map page
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package Lebenslauf_Portal
 */

get_header(); ?>

	<div class="content-area map-content">

		<script type="text/javascript">

		window.jsBaseUrl = '<?php echo get_site_url(); ?>';

		</script>

		<?php
		
		get_template_part( 'template-parts/map');

		?>
	</div>

<?php

get_footer();

?>