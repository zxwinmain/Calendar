<!DOCTYPE html>
<html lang="en">
<head>
        <meta charset="utf-8">
        <title>AirTeams Administrator</title>
        <link href="/statics/css/base.css" rel="stylesheet">
        <link href="/statics/css/application.css" rel="stylesheet">
        <script type="text/javascript" src="/statics/js/lib/jquery.js"></script>
</head>
    <body>
        <div id="component_head">
            <ul class="head">
                <li><a>
                    <img src="<?php echo($USER_AVATAR); ?>">
                    <strong><?php echo($USER_NAME); ?><span><?php echo($USER_EMAIL); ?></span></strong>
                    </a>
                </li>
            </ul>
            <ul class="menu">
                <li><a class="active" data-url="/administrator/dashboard"><i class="calendar"></i>概览</a></li>
                <li><a data-url="/administrator/account"><i class="review"></i>企业</a></li>
                <li><a data-url="/administrator/user"><i class="storage"></i>用户</a></li>
                <li><a data-url="/administrator/app"><i class="app"></i>应用</a></li>
                <li><a href="/"><i class="support"></i>返回</a></li>
            </ul>
        </div>
        <div id="workspace">
            <div id="app" class="item without_border">
                <div id="appContainer">
                    <iframe src="/administrator/dashboard" width="100%" height="100%"></iframe>
                </div>
            </div>
        </div>
        <script type="text/javascript">
            $('ul.menu a').click(function () {
                var el = $(this);
                if (el.attr('data-url')) {
                    $('ul.menu a').removeClass('active');
                    el.addClass('active');
                    $('#appContainer iframe').attr('src', el.attr('data-url'));
                }
            });
        </script>
    </body>
</html>
