<?php
/**
 * Front to the WordPress application. This file does not do the loading,
 * but it is the entry point for the WordPress application.
 *
 * @package WordPress
 */

define( 'WP_USE_THEMES', true );

/** Loads the WordPress Environment and Template */
require __DIR__ . '/wp-blog-header.php';
