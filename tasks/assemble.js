module.exports = function (gulp, plugins, config) {
	return function (done) {

		var start = '<pre class="language-markup"><code class="language-markup">';
		var end = '</code></pre>';

		var stream = plugins.assemble({
			dest: 'dist',
			logErrors: config.dev,
			helpers: {
				example: function(args) {
					var string, esacped_string, template_string, template;

					string = args.replace( '.', '/' );
					escaped = plugins.escape( plugins.fs.readFileSync(__dirname + '/../src/html/' + string + '.html', 'utf8') );
					template_string = start + escaped + end;
					template = plugins.hbs.compile( template_string );
					return new plugins.hbs.SafeString(template(args));
				}
			}
		});
		done();
	};
};