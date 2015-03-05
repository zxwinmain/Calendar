<!DOCTYPE html>

<html lang="en">
    <head>
        <meta charset="utf-8" />
        <title>AirTeams</title>
        <link href="/statics/css/base.css" rel="stylesheet">
        <link href="/statics/css/application.css" rel="stylesheet">
        <script type="text/javascript" src="http://channel.sinaapp.com/api.js"></script>
    </head>
    <body>
        <div id="workspace">
            <div class="loading"></div>
        </div>
        <script>
            if(!window.applicationCache) top.location.href = '/error/browser';
            window.app = {
                models: {},
                collections: {},
                views: {},
                instances: {},
                channel: '<?php echo($TOKEN_CHANNEL); ?>',
                router: null
            };
            window.require = { 
                waitSeconds: 0
            };
        </script>
        <script src="/statics/js/lib/require.js" data-main="/statics/js/main"></script>
    </body>
</html>
