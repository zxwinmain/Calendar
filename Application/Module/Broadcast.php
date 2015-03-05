<?php

    class Broadcast{

        public function PackMessage($_method, $_response, $_succeed=TRUE){
            if(strlen(json_encode($_response)) > 4000){
                $ID_MESSAGE = Instance::ID();
                Instance::Module('Cache')->Set($ID_MESSAGE, json_encode($_response));
                $_response = array(
                    'LARGE_MESSAGE' => $ID_MESSAGE
                );
            }
            return json_encode(array(
                'method' => $_method,
                'succeed' => $_succeed,
                'response' => $_response
            ));
        }

        public function Send($_auth, $_method, $_response, $_succeed=TRUE){
            Instance::Module('Queue')->Send(array(
                'url' => '/callback/queue/channel/' . $_auth['USER']['ID'],
                'postdata' => 'MESSAGE=' . urlencode(self::PackMessage($_method, $_response, $_succeed))
            ));
        }

        public function SendAll($_auth, $_method, $_response, $_succeed=TRUE){
            $TASKS = array();
            $COLLECTION = Instance::Collection('User');
            $COLLECTION_RESULT = $COLLECTION->GetAllByAttributes(array(
                'ID_ACCOUNT' => $_auth['ACCOUNT']['ID']
            ));
            foreach ($COLLECTION_RESULT as $ITEM){
                $TASKS[] = array(
                    'url' => '/callback/queue/channel/' . $ITEM['ID'],
                    'postdata' => 'MESSAGE=' . urlencode(self::PackMessage($_method, $_response, $_succeed))
                );
            }
            Instance::Module('Queue')->Send($TASKS);
        }

    }

?>