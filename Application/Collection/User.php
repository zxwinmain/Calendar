<?php

    require_once 'Collection.php';

    class UserCollection extends Collection {
        
        protected $_tableName = 'user';

        public function GetAllByAccount($_id_account){
            $SQL = "SELECT * FROM `" . $this->_tableName . "` WHERE `ID_ACCOUNT` = '$_id_account'";
            $RESULT = Instance::Module('Database')->Query($SQL);
            $RESULT_RESPONSE = array();
            while ($ITEM = mysql_fetch_array($RESULT, MYSQL_ASSOC)) {
                unset($ITEM['BODY_PASSWORD']);
                $RESULT_RESPONSE[] = $ITEM;
            }
            return $RESULT_RESPONSE;
        }

    }

?>