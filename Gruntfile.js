module.exports = function(grunt) {

	grunt.initConfig({
		connect: {
			app: {
				options: {
					port: 8080, // c9.io supports 8080, 8081, 8082, but only 8080 seems to work without specifying the port in the url
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