<?php

    require_once 'Collection.php';

    class EventCollection extends Collection {
        
        protected $_tableName = 'event';

        public function GetAll($_id_account, $_id_user, $_start, $_end, $_state, $_member){

            $SQL_INSERT_STATE = '';
            if($_state != 'all') $SQL_INSERT_STATE = " AND `IS_DONE` = " . $_state;

            $SQL_INSERT_MEMBER = " AND (`BODY_PERMISSION` = 'public' OR `ID_USER` = '$_id_user')";
            if($_member != 'all') $SQL_INSERT_MEMBER = " AND (`BODY_PERMISSION` = 'public' AND `ID_USER` = '$_member')";

            $SQL = "SELECT * FROM `" . $this->_tableName . "` WHERE `ID_ACCOUNT` = '$_id_account' AND (( `BODY_START` >= $_start AND `BODY_START` <= $_end ) OR (`BODY_END` >= $_start AND `BODY_END` <= $_end)) $SQL_INSERT_MEMBER $SQL_INSERT_STATE";
            $RESULT = Instance::Module('Database')->Query($SQL);
            $RESULT_RESPONSE = array();
            while ($ITEM = mysql_fetch_array($RESULT, MYSQL_ASSOC)) {
               $RESULT_RESPONSE[] = $ITEM;
            }

            return $RESULT_RESPONSE;

        }

    }

?>