<?php

    require_once 'Collection.php';

    class RecordCollection extends Collection {
        
        protected $_tableName = 'record';

        public function DeleteByRelation($_application, $_id){
            $SQL = "DELETE FROM `" . $this->_tableName . "` WHERE `RELATION_APPLICATION` = '$_application' AND `RELATION_ID` = '$_id'";
            Instance::Module('Database')->Query($SQL);
        }

        public function GetAllByUserAndTime($_id_user, $_start, $_end){
            $SQL = "SELECT * FROM `" . $this->_tableName . "` WHERE `ID_USER` = '$_id_user' AND `TIME_CREATED` BETWEEN $_start AND $_end ORDER BY `TIME_CREATED` DESC";
            $RESULT = Instance::Module('Database')->Query($SQL);
            $RESULT_RESPONSE = array();
            while ($ITEM = mysql_fetch_array($RESULT, MYSQL_ASSOC)) {
                $RESULT_RESPONSE[] = $ITEM;
            }
            return $RESULT_RESPONSE;
        }

    }

?>