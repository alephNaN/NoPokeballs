module.exports = function(grunt) {
  'use strict';

  grunt.initConfig({
    pkg: grunt.file.readJSON('./package.json'),

    /* assemble templating */
     assemble: {
       options: {
         layout: 'page.hbs',
         layoutdir: './src/templates/layouts/',
         partials: './src/templates/partials/**/*'
       },
       posts: {
         files: [{
           cwd: './src/content/',
           dest: './dist/',
           expand: true,
           src: ['**/*.hbs']
         }]
       }
     }
   });

   /* load every plugin in package.json */
   grunt.loadNpmTasks('grunt-assemble');

   /* grunt tasks */
   grunt.registerTask('default', ['assemble']);
 };
