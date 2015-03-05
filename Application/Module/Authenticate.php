<?php

    class Authenticate {

        public function Load($_app){

            if(isset($_SESSION['ID_USER'])){
                
                $MODEL = Instance::Model('User');
                $MODEL->Bind($_SESSION['ID_USER']);
                $MODEL->Fetch();
                $ID_ACCOUNT = $MODEL->Get('ID_ACCOUNT');
                $ID_USER = $MODEL->Get('ID');

            }else{
                
                if(!$ID_USER = self::Decode($_app->request->get('token'))) return FALSE;
                $MODEL = Instance::Model('User');
                $MODEL->Bind($ID_USER);
                $MODEL->Fetch();
                $ID_ACCOUNT = $MODEL->Get('ID_ACCOUNT');

            }

            $SQL = "SELECT * FROM `account` WHERE `ID` = '$ID_ACCOUNT'";
            if(!$SQL_DATA_ACCOUNT = mysql_fetch_assoc(Instance::Module('Database')->Query($SQL))) return FALSE;

            $SQL = "SELECT * FROM `user` WHERE `ID` = '$ID_USER'";
            if(!$SQL_DATA_USER = mysql_fetch_assoc(Instance::Module('Database')->Query($SQL))) return FALSE;

            return array(
                'ACCOUNT' => $SQL_DATA_ACCOUNT,
                'USER' => $SQL_DATA_USER
            );
        
        }
        
        public function Administrator($_app, $_auth){
            $COLLECTION = Instance::Collection('Administrator');
            if(!$COLLECTION->GetAllByAttributes(array(
                'ID_USER' => $_auth['USER']['ID']
            ))) $_app->redirect('/');
        }

        public function Encode($_id_application, $_id_user, $_application_key){
            $TOKEN_ARRAY = array(
                'ID_APPLICATION' => $_id_application,
                'ID_USER' => $_id_user,
                'APPLICATION_KEY' => $_application_key
            );
            return base64_encode(urlencode(base64_encode(json_encode($TOKEN_ARRAY))));
        }

        public function Decode($_token){

            if(!$_token) return FALSE;
            $TOKEN_JSON = base64_decode(urldecode(base64_decode($_token)));
            $TOKEN_ARRAY = json_decode($TOKEN_JSON, TRUE);

            if(!$TOKEN_ARRAY
            || !$TOKEN_ARRAY['ID_APPLICATION']
            || !$TOKEN_ARRAY['ID_USER']
            || !$TOKEN_ARRAY['APPLICATION_KEY']) return FALSE;

            $MODEL = Instance::Model('App');
            $MODEL->Bind($TOKEN_ARRAY['ID_APPLICATION']);
            $MODEL->Fetch();

            if(!$MODEL->Get('BODY_PERMISSION')) return FALSE;
            if($MODEL->Get('BODY_KEY') != $TOKEN_ARRAY['APPLICATION_KEY']) return FALSE;

            return $TOKEN_ARRAY['ID_USER'];

        }

    }

?>