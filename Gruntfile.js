module.exports = function(grunt) {

	grunt.initConfig({
		connect: {
			app: {
				options: {
					port: 9000,
					base: '.',
//					open: {
//						target: 'http://localhost:9000/src/index.html#/',
//						appName: 'chrome'
//					},
					keepalive: true
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.registerTask('default', 'connect:app');

}