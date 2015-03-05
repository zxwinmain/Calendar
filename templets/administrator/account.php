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
        <div id="app" class="administratorRest storage">
            <div class="main">
                <div id="container">
                    <table class="storageList" border="0">
                        <thead>
                            <tr class="actions">
                                <td colspan="7">
                                    <div class="left">
                                        <button id="button_home" type="button"><span class="icon-home"></span></button><button id="button_back" type="button" style="visibility: hidden;"><span class="icon-reply"></span></button>
                                    </div>
                                    <div class="right">
                                        <input id="input_folder" class="input">
                                        <button id="button_save_folder" class="button" type="button">新建文件夹</button>
                                        <button id="button_upload" class="button upload" type="button">上传新文件</button>
                                        <input id="input_file" type="file" name="ATTACHMENT" style="display: none;">
                                    </div>
                                </td>
                            </tr>
                            <tr class="sections">
                                <td>名称</td>
                                <td>用户</td>
                                <td>任务</td>
                                <td>文件</td>
                                <td>注册时间</td>
                                <td>到期时间</td>
                                <td class="method">操作</td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr id="17d67fd261f4633357328c1fe787c7b0">
                                <td>软件和工具</td>
                                <td>软件和工具</td>
                                <td>软件和工具</td>
                                <td>软件和工具</td>
                                <td>注册时间</td>
                                <td>到期时间</td>
                                <td class="method"><a class="renameFolder">更名</a><a class="deleteFolder">删除</a></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </body>
</html>
