module.exports = function (grunt) {
    // load plugins
    [
        'grunt-cafe-mocha',
        'grunt-contrib-jshint'
    ].forEach(function (task) {
        grunt.loadNpmTasks(task);
    });

    // configure plugins
    grunt.initConfig({
        jshint: {
            app: ['app.js','settings.js', 'public/javascripts/**/*.js', 'controllers/**/*.js', 'routes/**/*.js'],
            tests: ['Gruntfile.js', 'tests/**/*.js']
        },
        cafemocha: {
            all: {src: 'tests/tests-*.js', options: {ui: 'tdd'}}
        }
    });

    // register tasks
    grunt.registerTask('default', ['jshint', 'cafemocha']);
};
