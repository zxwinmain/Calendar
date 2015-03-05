<?php

    class Record{

        public function Create($_auth, $_message, $_relation_application, $_relation_id){

            $MODEL = Instance::Model('Record');
            $MODEL->Set('ID', Instance::ID());
            $MODEL->Set('ID_ACCOUNT', $_auth['ACCOUNT']['ID']);
            $MODEL->Set('ID_USER', $_auth['USER']['ID']);
            $MODEL->Set('BODY_MESSAGE', $_message);
            $MODEL->Set('RELATION_APPLICATION', $_relation_application);
            $MODEL->Set('RELATION_ID', $_relation_id);
            $MODEL->Set('TIME_CREATED', time());
            $MODEL->Save();

        }

    }

?>