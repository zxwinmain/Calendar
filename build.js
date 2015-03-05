{
	'appDir': 'statics-src',
	'baseUrl': 'js',
	'dir': 'statics',
    'optimizeCss': 'standard',
    'waitSeconds': 0,
    'paths': {
        'jquery': 'lib/jquery',
        'jquery.ajaxfileupload': 'lib/jquery.ajaxfileupload',
        'jquery.datetimepicker': 'lib/jquery.datetimepicker',
        'underscore': 'lib/underscore',
        'backbone': 'lib/backbone',
        'backbone-query': 'lib/backbone-query.min',
        'text': 'lib/text',
        'i18n': 'lib/i18n',
        'moment': 'lib/moment',
        'moment-timezone': 'lib/moment-timezone.min',
        'jstz': 'lib/jstz.min',
        'wysihtml5': 'lib/wysihtml5.min',
        'wysihtml5-config': 'lib/wysihtml5-config'
    },
    
    'shim': {
        'backbone-query': ['jquery', 'backbone'],
        'fullcalendar': ['jquery', 'moment'],
        'jquery.ajaxfileupload': ['jquery'],
        'jquery.datetimepicker': ['jquery'],
        'moment-timezone': ['moment'],
        'jstz': ['jquery']
    },
    'modules': [
    	{'name': 'main'},
        {'name': 'session'}
    ]
}