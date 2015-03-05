<?php

    @ob_start('ob_gzhandler');
    @sae_xhprof_start();

    require 'Slim/Slim.php';
    require 'Application/Instance.php';

    \Slim\Slim::registerAutoloader();

    $app = new \Slim\Slim(array(
        'mode' => 'production',
        'templates.path' => './templets'
    ));

    Instance::Init();
    Instance::Middleware($app, 'ACL');

    $app->group('/api', function () use ($app) {

        $app->get('/initialization', function() use ($app){
            
            $COLLECTION = Instance::Collection('User');
            $ME = $app->auth['USER'];
            unset($ME['BODY_PASSWORD']);

            Instance::Response(array(
                'ME' => $ME,
                'ACCOUNT' => $app->auth['ACCOUNT'],
                'USER' => $COLLECTION->GetAllByAttributes(array(
                    'ID_ACCOUNT' => $app->auth['ACCOUNT']['ID']
                ))
            ));

        });

        $app->group('/tests', function () use ($app) {

            $app->get('/id', function () use ($app){
                die(Instance::ID());
            });

        });

        $app->group('/account', function () use ($app) {
        
            $app->get('/', function () use ($app){

                Instance::Response($app->auth['ACCOUNT']);

            });

            $app->put('/', function () use ($app){

                $REQUEST_DATA = json_decode($app->request->getBody());

                Instance::Required(array(
                    $REQUEST_DATA->{'name'}
                ));

                if($app->auth['USER']['IS_ADMINISTRATOR']){
                    $MODEL = Instance::Model('Account');
                    $MODEL->Bind($app->auth['ACCOUNT']['ID']);
                    $MODEL->Set('BODY_NAME', $REQUEST_DATA->{'name'});
                    $MODEL->Set('TIME_UPDATED', time());
                    $MODEL->Save();
                }

            });

        });

        $app->group('/users', function () use ($app) {

            $app->get('/', function () use ($app){

                $COLLECTION = Instance::Collection('User');
                Instance::Response($COLLECTION->GetAllByAttributes(array(
                    'ID_ACCOUNT' => $app->auth['ACCOUNT']['ID']
                )));

            });

            $app->post('/', function () use ($app){

                Instance::Required(array(
                    $app->request->post('USER_NAME'),
                    $app->request->post('USER_EMAIL')
                ));

                $COLLECTION = Instance::Collection('User');
                if($COLLECTION->GetAllByAttributes(array(
                    'BODY_EMAIL' => $app->request->post('USER_EMAIL')
                ))) Instance::Response(array(
                    'message' => 'EMAIL_EXISTS'
                ), FALSE);

                $ID_INSERT = Instance::ID();
                $BODY_PASSWORD = substr(md5($ID_INSERT), 0, 8);

                Instance::Module('Mail')->Send($app->request->post('USER_EMAIL'), 'AirTeams Invitation', Instance::Module('Mail')->Templet('mail_invitation', array(
                    'REFERRER' => $app->auth['USER']['BODY_NAME'],
                    'INVITEE' => $app->request->post('USER_NAME'),
                    'PASSWORD' => $BODY_PASSWORD
                )));

                $MODEL = Instance::Model('User');
                $MODEL->Set('ID', $ID_INSERT);
                $MODEL->Set('ID_ACCOUNT', $app->auth['ACCOUNT']['ID']);
                $MODEL->Set('BODY_EMAIL', $app->request->post('USER_EMAIL'));
                $MODEL->Set('BODY_PASSWORD', md5($BODY_PASSWORD));
                $MODEL->Set('BODY_NAME', $app->request->post('USER_NAME'));
                $MODEL->Set('BODY_AVATAR', '');
                $MODEL->Set('BODY_INTRO', '');
                $MODEL->Set('IS_ADMINISTRATOR', 0);
                $MODEL->Set('TIME_CREATED', time());
                $MODEL->Save();

                Instance::Module('Broadcast')->SendAll($app->auth, 'user_created', $MODEL->GetAttributes());
                Instance::Response('OK');

            });

            $app->put('/:ID/password', function($ID) use ($app){

                if($app->auth['USER']['IS_ADMINISTRATOR']){

                    $MODEL = Instance::Model('User');
                    $MODEL->Bind($ID);
                    $MODEL->Fetch();

                    if($MODEL->Get('ID_ACCOUNT') == $app->auth['ACCOUNT']['ID']){

                        $BODY_PASSWORD = substr(md5(time()), 0, 8);

                        Instance::Module('Mail')->Send($SQL_DATA['BODY_EMAIL'], 'Your New Password', Instance::Module('Mail')->Templet('mail_password', array(
                            'REFERRER' => $app->auth['USER']['BODY_NAME'],
                            'USER_NAME' => $MODEL->Get('BODY_NAME'),
                            'PASSWORD' => $BODY_PASSWORD
                        )));

                        $MODEL->Set('BODY_PASSWORD', md5($BODY_PASSWORD));
                        $MODEL->Set('TIME_UPDATED', time());
                        $MODEL->Save();
                
                    }

                }

                Instance::Response('OK');

            });

            $app->put('/:ID/administrator', function($ID) use ($app){

                $IS_ADMINISTRATOR = $app->request->put('IS_ADMINISTRATOR');
                if(intval($IS_ADMINISTRATOR) != 1) $IS_ADMINISTRATOR = 0;

                if($app->auth['USER']['IS_ADMINISTRATOR'] && $app->auth['USER']['ID'] != $ID){

                    $MODEL = Instance::Model('User');
                    $MODEL->Bind($ID);
                    $MODEL->Fetch();
                    if($MODEL->Get('ID_ACCOUNT') == $app->auth['ACCOUNT']['ID']){
                        $MODEL->Set('IS_ADMINISTRATOR', $IS_ADMINISTRATOR);
                        $MODEL->Set('TIME_UPDATED', time());
                        $MODEL->Save();
                        Instance::Module('Broadcast')->SendAll($app->auth, 'user_updated', $MODEL->GetAttributes());
                    }

                }
                Instance::Response('OK');

            });

            $app->put('/:ID/block', function($ID) use ($app){

                $IS_BLOCKED = $app->request->put('IS_BLOCKED');
                if(intval($IS_BLOCKED) != 1) $IS_BLOCKED = 0;
                else $IS_BLOCKED = time();

                if($app->auth['USER']['IS_ADMINISTRATOR'] && $app->auth['USER']['ID'] != $ID){

                    $MODEL = Instance::Model('User');
                    $MODEL->Bind($ID);
                    $MODEL->Fetch();
                    if($MODEL->Get('ID_ACCOUNT') == $app->auth['ACCOUNT']['ID']){
                        $MODEL->Set('TIME_DELETED', $IS_BLOCKED);
                        $MODEL->Set('TIME_UPDATED', time());
                        $MODEL->Save();
                        Instance::Module('Broadcast')->SendAll($app->auth, 'user_updated', $MODEL->GetAttributes());   
                    }

                }

                Instance::Response('OK');

            });

            $app->delete('/:ID', function($ID) use ($app){

                if($app->auth['USER']['IS_ADMINISTRATOR'] && $app->auth['USER']['ID'] != $ID) {
                    $MODEL = Instance::Model('User');
                    $MODEL->Bind($ID);
                    $MODEL->Fetch();
                    if($MODEL->Get('ID_ACCOUNT') == $app->auth['ACCOUNT']['ID']){
                        $MODEL->Delete();
                        Instance::Module('Broadcast')->SendAll($app->auth, 'user_deleted', array(
                            'ID' => $ID
                        ));
                        $COLLECTION = Instance::Collection('Record');
                        $COLLECTION->DeleteAllByAttributes(array(
                            'ID_USER' => $ID
                        ));
                        $COLLECTION = Instance::Collection('File');
                        $COLLECTION->DeleteAllByAttributes(array(
                            'ID_USER' => $ID
                        ));
                    }
                }
            
                Instance::Response('OK');

            });

            $app->get('/me', function () use ($app){

                $ME = $app->auth['USER'];
                unset($ME['BODY_PASSWORD']);
                Instance::Response($ME);

            });

            $app->put('/me', function () use ($app){

                $REQUEST_DATA = json_decode($app->request->getBody());
                Instance::Required(array(
                    $REQUEST_DATA->{'name'}
                ));

                $MODEL = Instance::Model('User');
                $MODEL->Bind($app->auth['USER']['ID']);
                $MODEL->Set('BODY_NAME', $REQUEST_DATA->{'name'});
                $MODEL->Set('BODY_AVATAR', $REQUEST_DATA->{'avatar'});
                $MODEL->Set('BODY_INTRO', $REQUEST_DATA->{'intro'});
                $MODEL->Set('TIME_UPDATED', time());
                $MODEL->Save();
                Instance::Module('Broadcast')->SendAll($app->auth, 'user_updated', $MODEL->GetAttributes());

            });

        });

        $app->group('/upload', function () use ($app) {

            $app->post('/', function () use ($app){

                if (isset($_FILES)) {
                    if (isset($_FILES['ATTACHMENT'])) {
                        $tmp_name = $_FILES['ATTACHMENT']['tmp_name'];
                        $name     = basename($_FILES['ATTACHMENT']['name']);
                        $error    = $_FILES['ATTACHMENT']['error'];
                        if ($error === UPLOAD_ERR_OK) {
                            $extension = pathinfo($name, PATHINFO_EXTENSION);
                            $fileContent = file_get_contents($tmp_name);
                            $storage = new SaeStorage();
                            $domain = 'statics';
                            $destFileName = 'attachment/' . Instance::ID() . '.' . $extension;
                            $srcFileName = $_FILES['ATTACHMENT']['tmp_name'];
                            $result = $storage->write($domain, $destFileName, $fileContent);
                            echo json_encode(array(
                                'succeed' => true,
                                'response' => $result
                            ));
                        }
                    }
                } else echo json_encode(array(
                    'succeed' => false,
                    'response' => 'NO_FILE_UPLOADED'
                ));

            });

            $app->post('/avatar', function () use ($app){

                $whiteList = array('jpg', 'jpeg', 'png', 'gif');
                if (isset($_FILES)) {
                    if (isset($_FILES['USER_AVATAR'])) {
                        $tmp_name = $_FILES['USER_AVATAR']['tmp_name'];
                        $name     = basename($_FILES['USER_AVATAR']['name']);
                        $error    = $_FILES['USER_AVATAR']['error'];
                        if ($error === UPLOAD_ERR_OK) {
                            $extension = pathinfo($name, PATHINFO_EXTENSION);
                            if (!in_array($extension, $whiteList)) echo json_encode(array(
                                'succeed' => false,
                                'response' => 'INVALID_FILE_TYPE'
                            ));
                            else {
                                $img = new SaeImage();
                                $fileContent = file_get_contents($tmp_name);
                                $img->setData($fileContent);
                                $img->resize(180);
                                $storage = new SaeStorage();
                                $domain = 'statics';
                                $destFileName = 'avatar/' . Instance::ID() . '.' . $extension;
                                $srcFileName = $_FILES['USER_AVATAR']['tmp_name'];
                                $result = $storage->write($domain, $destFileName, $img->exec());
                                echo json_encode(array(
                                    'succeed' => true,
                                    'response' => $result
                                ));
                            }
                        }
                    }
                } else echo json_encode(array(
                    'succeed' => false,
                    'response' => 'NO_FILE_UPLOADED'
                ));

            });

        });

        $app->group('/events', function () use ($app) {

            $app->get('/', function () use ($app){

                Instance::Required(array(
                    $app->request->get('start'),
                    $app->request->get('end')
                ));

                $COLLECTION = Instance::Collection('Event');
                Instance::Response($COLLECTION->GetAll($app->auth['ACCOUNT']['ID'], $app->auth['USER']['ID'], $app->request->get('start'), $app->request->get('end'), $app->request->get('state'), $app->request->get('member')));

            });

            $app->post('/', function () use ($app){

                $REQUEST_DATA = json_decode($app->request->getBody());
                Instance::Required(array(
                    $REQUEST_DATA->{'name'},
                    $REQUEST_DATA->{'start'},
                    $REQUEST_DATA->{'end'},
                    $REQUEST_DATA->{'className'},
                    $REQUEST_DATA->{'permission'},
                    $REQUEST_DATA->{'id_user'}
                ));
                $EVENT_PERMISSION = $REQUEST_DATA->{'permission'};
                $EVENT_OWNER = $REQUEST_DATA->{'id_user'};

                if($EVENT_PERMISSION != 'public'
                && $EVENT_PERMISSION != 'private') $EVENT_PERMISSION = 'public';
                if(!$EVENT_OWNER) $EVENT_OWNER = $app->auth['USER']['ID'];

                $MODEL = Instance::Model('Event');
                $MODEL->Set('ID', Instance::ID());
                $MODEL->Set('ID_ACCOUNT', $app->auth['ACCOUNT']['ID']);
                $MODEL->Set('ID_USER', $EVENT_OWNER);
                $MODEL->Set('BODY_NAME', $REQUEST_DATA->{'name'});
                $MODEL->Set('BODY_START', $REQUEST_DATA->{'start'});
                $MODEL->Set('BODY_END', $REQUEST_DATA->{'end'});
                $MODEL->Set('BODY_INTRO', $REQUEST_DATA->{'intro'});
                $MODEL->Set('BODY_CLASS', $REQUEST_DATA->{'className'});
                $MODEL->Set('BODY_PERMISSION', $EVENT_PERMISSION);
                $MODEL->Set('TIME_CREATED', time());
                $MODEL->Save();

                if($EVENT_PERMISSION == 'public'){
                    Instance::Module('Record')->Create($app->auth, 'event_created', 'CALENDAR', $MODEL->Get('ID'));
                    Instance::Module('Broadcast')->SendAll($app->auth, 'event_created', $MODEL->GetAttributes());
                } else Instance::Module('Broadcast')->Send($app->auth, 'event_created', $MODEL->GetAttributes());

            });

            $app->put('/:ID', function($ID) use ($app){

                $REQUEST_DATA = json_decode($app->request->getBody());
                Instance::Required(array(
                    $REQUEST_DATA->{'name'},
                    $REQUEST_DATA->{'start'},
                    $REQUEST_DATA->{'end'},
                    $REQUEST_DATA->{'className'},
                    $REQUEST_DATA->{'permission'},
                    $REQUEST_DATA->{'id_user'}
                ));
                $EVENT_PERMISSION = $REQUEST_DATA->{'permission'};
                $EVENT_OWNER = $REQUEST_DATA->{'id_user'};

                $IS_DONE = 1;
                if(intval($REQUEST_DATA->{'is_done'}) != 1) $IS_DONE = 0;
                if($EVENT_PERMISSION != 'public'
                && $EVENT_PERMISSION != 'private') $EVENT_PERMISSION = 'public';
                if(!$EVENT_OWNER) $EVENT_OWNER = $app->auth['USER']['ID'];

                $MODEL = Instance::Model('Event');
                $MODEL->Bind($ID);
                $MODEL->Fetch();
                if($MODEL->Get('ID_USER') == $app->auth['USER']['ID']){
             
                    $MODEL->Set('IS_DONE', $IS_DONE);
                    $MODEL->Set('ID_USER', $EVENT_OWNER);
                    $MODEL->Set('BODY_NAME', $REQUEST_DATA->{'name'});
                    $MODEL->Set('BODY_START', $REQUEST_DATA->{'start'});
                    $MODEL->Set('BODY_END', $REQUEST_DATA->{'end'});
                    $MODEL->Set('BODY_INTRO', $REQUEST_DATA->{'intro'});
                    $MODEL->Set('BODY_CLASS', $REQUEST_DATA->{'className'});
                    $MODEL->Set('BODY_PERMISSION', $EVENT_PERMISSION);
                    $MODEL->Set('TIME_UPDATED', time());
                    $MODEL->Save();

                    if($EVENT_PERMISSION == 'public'){
                        Instance::Module('Record')->Create($app->auth, 'event_updated', 'CALENDAR', $ID);
                        Instance::Module('Broadcast')->SendAll($app->auth, 'event_updated', $MODEL->GetAttributes());
                    } else Instance::Module('Broadcast')->Send($app->auth, 'event_updated', $MODEL->GetAttributes());
                
                }

            });

            $app->put('/:ID/status', function($ID) use ($app){

                $IS_DONE = 1;
                if(intval($app->request->put('IS_DONE')) != 1) $IS_DONE = 0;

                $MODEL = Instance::Model('Event');
                $MODEL->Bind($ID);
                $MODEL->Fetch();

                if($MODEL->Get('ID_USER') == $app->auth['USER']['ID']){
             
                    $MODEL->Set('IS_DONE', $IS_DONE);
                    $MODEL->Set('TIME_UPDATED', time());
                    $MODEL->Save();

                    if($MODEL->Get('BODY_PERMISSION') == 'public') {
                        if($IS_DONE) Instance::Module('Record')->Create($app->auth, 'event_done', 'CALENDAR', $ID);
                        else Instance::Module('Record')->Create($app->auth, 'event_redo', 'CALENDAR', $ID);
                        Instance::Module('Broadcast')->SendAll($app->auth, 'event_updated', $MODEL->GetAttributes());
                    } else Instance::Module('Broadcast')->Send($app->auth, 'event_updated', $MODEL->GetAttributes());
                
                }

                Instance::Response('OK');

            });

            $app->delete('/:ID', function($ID) use ($app){

                $MODEL = Instance::Model('Event');
                $MODEL->Bind($ID);
                $MODEL->Fetch();

                if($MODEL->Get('ID_USER') == $app->auth['USER']['ID']){
                    $MODEL->Delete();
                    $COLLECTION = Instance::Collection('Record');
                    $COLLECTION->DeleteByRelation('CALENDAR', $ID);
                    Instance::Module('Broadcast')->SendAll($app->auth, 'event_deleted', array(
                        'ID' => $ID
                    ));
                }

            });

        });

        $app->group('/records', function () use ($app) {

            $app->get('/', function () use ($app){

                Instance::Required(array(
                    $app->request->get('TIMESTAMP')
                ));

                $TIMESTAMP_START = $app->request->get('TIMESTAMP');
                $TIMESTAMP_END = intval($TIMESTAMP_START) + 86399;

                $COLLECTION = Instance::Collection('User');
                $SQL_DATA = $COLLECTION->GetAllByAttributes(array(
                    'ID_ACCOUNT' => $app->auth['ACCOUNT']['ID']
                ));
                $RESULT_RESPONSE = array();
                foreach ($SQL_DATA as $ITEM) {
                    $RESULT_RESPONSE[] = array(
                        'ID' => $ITEM['ID'],
                        'BODY_AVATAR' => $ITEM['BODY_AVATAR'],
                        'BODY_NAME' => $ITEM['BODY_NAME'],
                        'BODY_EMAIL' => $ITEM['BODY_EMAIL'],
                        'RECORDS' => array()
                    );
                }

                foreach ($RESULT_RESPONSE as $INDEX => &$ARRAY) {

                    $COLLECTION_RECORD = Instance::Collection('Record');
                    $SQL_DATA = $COLLECTION_RECORD->GetAllByUserAndTime($ARRAY['ID'], $TIMESTAMP_START, $TIMESTAMP_END);

                    foreach ($SQL_DATA as $ITEM) {
                        $RELATION_BODY = NULL;
                        if($ITEM['RELATION_APPLICATION'] == 'CALENDAR'){
                            $MODEL = Instance::Model('Event');
                            $MODEL->Bind($ITEM['RELATION_ID']);
                            $MODEL->Fetch();
                            $RELATION_BODY = $MODEL->GetAttributes();
                        }
                        $ARRAY['RECORDS'][] = array(
                            'ID' => $ITEM['ID'],
                            'BODY_MESSAGE' => $ITEM['BODY_MESSAGE'],
                            'RELATION_APPLICATION' => $ITEM['RELATION_APPLICATION'],
                            'RELATION_ID' => $ITEM['RELATION_ID'],
                            'RELATION_BODY' => $RELATION_BODY,
                            'TIME_CREATED' => $ITEM['TIME_CREATED']
                        );
                    }

                    if(!count($ARRAY['RECORDS'])) unset($RESULT_RESPONSE[$INDEX]);
                }

                Instance::Response($RESULT_RESPONSE);

            });

        });

        $app->group('/apps', function () use ($app) {

            $app->get('/', function () use ($app){

                $COLLECTION = Instance::Collection('App');
                Instance::Response($COLLECTION->GetAllByAccount($app->auth['ACCOUNT']['ID']));

            });

            $app->get('/:ID', function ($ID) use ($app){

                $MODEL = Instance::Model('App');
                $MODEL->Bind($ID);
                $MODEL->Fetch();

                if($MODEL->Get('BODY_PERMISSION') == 'ALL'
                || $MODEL->Get('BODY_PERMISSION') == $app->auth['ACCOUNT']['ID']) {
                    $RESULT = $MODEL->GetAttributes();
                    unset($RESULT['BODY_KEY']);
                    $RESULT['USER_TOKEN'] = Instance::Module('Authenticate')->Encode($ID, $app->auth['USER']['ID'], $MODEL->Get('BODY_KEY'));
                    Instance::Response($RESULT);
                } else Instance::Response(array(
                    'message' => 'APP_INVALID'
                ), FALSE);

            });

        });

        $app->group('/storage', function () use ($app){
            
            $app->post('/folders', function() use ($app){

                Instance::Required(array(
                    $app->request->post('BODY_NAME')
                ));

                $COLLECTION = Instance::Collection('Folder');
                if($COLLECTION->GetAllByAttributes(array(
                    'ID_ACCOUNT' => $app->auth['ACCOUNT']['ID'],
                    'BODY_NAME' => $app->request->post('BODY_NAME')
                ))) Instance::Response(array(
                    'message' => 'FOLDER_EXISTS'
                ), FALSE);

                $MODEL = Instance::Model('Folder');
                $MODEL->Set('ID', Instance::ID());
                $MODEL->Set('ID_ACCOUNT', $app->auth['ACCOUNT']['ID']);
                $MODEL->Set('ID_FOLDER', $app->request->post('ID_FOLDER'));
                $MODEL->Set('BODY_NAME', $app->request->post('BODY_NAME'));
                $MODEL->Set('TIME_CREATED', time());
                $MODEL->Save();

                Instance::Response('OK');
            
            });

            $app->put('/folders/:ID', function($ID) use ($app){

                Instance::Required(array(
                    $app->request->put('NAME')
                ));

                $MODEL = Instance::Model('Folder');
                $MODEL->Bind($ID);
                $MODEL->Fetch();

                if($MODEL->Get('ID_ACCOUNT') == $app->auth['ACCOUNT']['ID']){
                    $MODEL->Set('BODY_NAME', $app->request->put('NAME'));
                    $MODEL->Save();
                }

                Instance::Response('OK');

            });

            $app->delete('/folders/:ID', function($ID) use ($app){

                $MODEL = Instance::Model('Folder');
                $MODEL->Bind($ID);
                $MODEL->Fetch();

                if($MODEL->Get('ID_ACCOUNT') == $app->auth['ACCOUNT']['ID']){
                    
                    $RESULT = array();

                    $COLLECTION = Instance::Collection('Folder');
                    $RESULT['FOLDERS'] = $COLLECTION->GetAllByAttributes(array(
                        'ID_ACCOUNT' => $app->auth['ACCOUNT']['ID'],
                        'ID_FOLDER' => $ID
                    ));

                    $COLLECTION = Instance::Collection('File');
                    $RESULT['FILES'] = $COLLECTION->GetAllByAttributes(array(
                        'ID_ACCOUNT' => $app->auth['ACCOUNT']['ID'],
                        'ID_FOLDER' => $ID
                    ));

                    if(count($RESULT['FOLDERS']) || count($RESULT['FILES'])) Instance::Response(array(
                        'message' => 'FOLDER_NOT_EMPTY'
                    ), FALSE);

                    $MODEL->Delete();

                }

                Instance::Response('OK');

            });

            $app->post('/files', function() use ($app){
           
                Instance::Required(array(
                    $app->request->post('FILE_NAME'),
                    $app->request->post('FILE_URL')
                ));

                $storage = new SaeStorage();
                $result = $storage->getAttr('statics', str_replace('http://airteams-statics.stor.sinaapp.com/', '', $app->request->post('FILE_URL')));

                $MODEL = Instance::Model('File');
                $MODEL->Set('ID', Instance::ID());
                $MODEL->Set('ID_ACCOUNT', $app->auth['ACCOUNT']['ID']);
                $MODEL->Set('ID_USER', $app->auth['USER']['ID']);
                $MODEL->Set('ID_FOLDER', $app->request->post('ID_FOLDER'));
                $MODEL->Set('BODY_NAME', $app->request->post('FILE_NAME'));
                $MODEL->Set('BODY_URL', $app->request->post('FILE_URL'));
                $MODEL->Set('BODY_SIZE', $result['length']);
                $MODEL->Set('TIME_CREATED', time());
                $MODEL->Save();

                Instance::Response('OK');
            
            });

            $app->get('/files', function() use ($app){
            
                $ID_FOLDER = '';
                if($app->request->get('ID_FOLDER')) $ID_FOLDER = $app->request->get('ID_FOLDER');

                $RESULT = array();

                if($ID_FOLDER){
                    $MODEL = Instance::Model('Folder');
                    $MODEL->Bind($ID_FOLDER);
                    $MODEL->Fetch();
                    $RESULT['ID_FOLDER'] = $MODEL->Get('ID_FOLDER');
                }

                $COLLECTION = Instance::Collection('Folder');
                $RESULT['FOLDERS'] = $COLLECTION->GetAllByAttributes(array(
                        'ID_ACCOUNT' => $app->auth['ACCOUNT']['ID'],
                        'ID_FOLDER' => $ID_FOLDER
                    ));

                $COLLECTION = Instance::Collection('File');
                $RESULT['FILES'] = $COLLECTION->GetAllByAttributes(array(
                        'ID_ACCOUNT' => $app->auth['ACCOUNT']['ID'],
                        'ID_FOLDER' => $ID_FOLDER
                    ));

                Instance::Response($RESULT);

            });

            $app->get('/files/:ID', function($ID) use ($app){

                $MODEL = Instance::Model('File');
                $MODEL->Bind($ID);
                $MODEL->Fetch();

                if(!$MODEL->Get('ID_ACCOUNT') == $app->auth['ACCOUNT']['ID']) $app->redirect('/error/404');

                header('Content-Type: application/octet-stream');
                header('Content-Disposition: attachment; filename="' .  $MODEL->Get('BODY_NAME') . '"');

                $STORAGE = new SaeStorage();
                echo $STORAGE->read('statics', str_replace('http://airteams-statics.stor.sinaapp.com/', '', $MODEL->Get('BODY_URL')));

            });

            $app->put('/files/:ID', function($ID) use ($app){
            
                Instance::Required(array(
                    $app->request->put('NAME')
                ));

                $MODEL = Instance::Model('File');
                $MODEL->Bind($ID);
                $MODEL->Fetch();

                if($MODEL->Get('ID_ACCOUNT') == $app->auth['ACCOUNT']['ID']){
                    $MODEL->Set('BODY_NAME', $app->request->put('NAME'));
                    $MODEL->Set('TIME_UPDATED', time());
                    $MODEL->Save();
                }

                Instance::Response('OK');

            });

            $app->delete('/files/:ID', function($ID) use ($app){
            
                $MODEL = Instance::Model('File');
                $MODEL->Bind($ID);
                $MODEL->Fetch();

                if($MODEL->Get('ID_ACCOUNT') == $app->auth['ACCOUNT']['ID']) {

                    $STORAGE = new SaeStorage();
                    $STORAGE->delete('statics', str_replace('http://airteams-statics.stor.sinaapp.com/', '', $MODEL->Get('BODY_URL')));

                    $MODEL->Delete();

                }

                Instance::Response('OK');

            });

        });

    });

    $app->group('/error', function () use ($app) {
        
        $app->get('/404', function () use ($app){
            $app->render('error_404.php');
        });

        $app->get('/browser', function () use ($app){
            $app->render('error_browser.php');
        });

    });

    $app->group('/callback', function () use ($app) {

        $app->post('/queue/channel/:USER', function($USER) use ($app){
            $CHANNEL = new SaeChannel();
            $CHANNEL->sendMessage($USER, $app->request->post('MESSAGE'));
        });

        $app->get('/queue/message/:ID', function($ID) use ($app){
            $RESULT = json_decode(Instance::Module('Cache')->Get($ID), TRUE);
            Instance::Module('Cache')->Delete($ID);
            Instance::Response($RESULT);
        });

    });

    $app->map('/signin', function () use ($app){

        if($app->request->isPost()){
        
            $USER_EMAIL = $_POST['USER_EMAIL'];
            $USER_PASSWORD = md5($_POST['USER_PASSWORD']);
            
            $SQL = "SELECT *, `user`.`ID` as `ID_USER`, `account`.`BODY_NAME` as `ACCOUNT_BODY_NAME` FROM `user` inner join `account` on `user`.`ID_ACCOUNT` = `account`.`ID` WHERE `BODY_EMAIL` = '$USER_EMAIL' AND `BODY_PASSWORD` = '$USER_PASSWORD' AND `user`.`TIME_DELETED` = 0";
            if(!$RESULT = mysql_fetch_assoc(Instance::Module('Database')->Query($SQL))){
                $app->flashNow('ERROR', 'WRONG_USER_OR_PASSWORD');
            }else{
                $_SESSION['ID_USER'] = $RESULT['ID_USER'];
                session_write_close();
                $app->redirect('/');
            }

        }

        $app->render('signin.php');

    })->via('GET', 'POST');

    $app->get('/signout', function () use ($app){

        session_destroy();
        $app->redirect('/signin');

    });

    $app->get('/', function () use ($app){
       
        $channel = new SaeChannel();
        $connection = $channel->createChannel($_SESSION['ID_USER']);
        $app->render('index.php', array(
            'TOKEN_CHANNEL' => $connection
        ));

    });

    $app->group('/administrator', function () use ($app) {

        $app->get('/', function() use ($app){

            $app->render('administrator/index.php', array(
                'USER_NAME' => $app->auth['USER']['BODY_NAME'],
                'USER_AVATAR' => $app->auth['USER']['BODY_AVATAR'],
                'USER_EMAIL' => $app->auth['USER']['BODY_EMAIL']
            ));

        });
        
        $app->get('/dashboard', function() use ($app){

            $app->render('administrator/dashboard.php');

        });

        $app->get('/account', function() use ($app){

            $app->render('administrator/account.php');

        });

        $app->get('/user', function() use ($app){

            $app->render('administrator/user.php');

        });

        $app->get('/app', function() use ($app){

            $app->render('administrator/app.php');

        });

    });

    $app->notFound(function () use ($app) {

        $app->redirect('/error/404');

    });

    $app->run();

    @sae_xhprof_end();