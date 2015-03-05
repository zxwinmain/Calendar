<!DOCTYPE html>

<html lang="en">
    <head>
        <meta charset="utf-8" />
        <title>AirTeams</title>
        <link href="/statics/css/base.css" rel="stylesheet">
        <link href="/statics/css/session.css" rel="stylesheet">
    </head>
    <body>
        <div id="workspace">
            <div class="loading"></div>
        </div>
        <script>
            if(!window.applicationCache) top.location.href = '/error/browser';
            window.app = {
                views: {}
            };
            window.require = { 
                waitSeconds: 0
            };
            <?php if(isset($flash['ERROR'])){ ?>
            window.appError = '<?php echo($flash['ERROR']); ?>';
            <?php } ?>

        </script>
        <script src="/statics/js/lib/require.js" data-main="/statics/js/session"></script>
    </body>
</html>
