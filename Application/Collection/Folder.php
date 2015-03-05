<?php

    require_once 'Collection.php';

    class FolderCollection extends Collection {
        
        protected $_tableName = 'folder';

        public function GetAllByAttributes($_attributes){
            $SQL = "SELECT * FROM `" . $this->_tableName . "` WHERE ";
            $INDEX = 0;
            foreach ($_attributes as $KEY => $VALUE){
                if($INDEX == 0) $SQL = $SQL . "`$KEY` = '$VALUE'";
                else $SQL = $SQL . " AND `$KEY` = '$VALUE'";
                $INDEX++;
            }
            $SQL = $SQL . "ORDER BY `BODY_NAME`";
            $RESULT = Instance::Module('Database')->Query($SQL);
            $RESULT_RESPONSE = array();
            while ($ITEM = mysql_fetch_array($RESULT, MYSQL_ASSOC)) {
                $RESULT_RESPONSE[] = $ITEM;
            }
            return $RESULT_RESPONSE;
        }

    }

?>