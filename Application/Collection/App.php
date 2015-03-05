<?php

    require_once 'Collection.php';

    class AppCollection extends Collection {
        
        protected $_tableName = 'app';

        public function GetAllByAccount($_id_account){
            $SQL = "SELECT * FROM `" . $this->_tableName . "` WHERE `BODY_PERMISSION` = 'ALL' or `BODY_PERMISSION` = '$_id_account'";
            $RESULT = Instance::Module('Database')->Query($SQL);
            $RESULT_RESPONSE = array();
            while ($ITEM = mysql_fetch_array($RESULT, MYSQL_ASSOC)) {
                unset($ITEM['BODY_KEY']);
                $RESULT_RESPONSE[] = $ITEM;
            }
            return $RESULT_RESPONSE;
        }

    }

?>