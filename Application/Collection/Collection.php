<?php

    class Collection {
        
        protected $_tableName = NULL;

        public function GetAll(){
            $SQL = "SELECT * FROM `" . $this->_tableName . "`";
            $RESULT = Instance::Module('Database')->Query($SQL);
            $RESULT_RESPONSE = array();
            while ($ITEM = mysql_fetch_array($RESULT, MYSQL_ASSOC)) {
                $RESULT_RESPONSE[] = $ITEM;
            }
            return $RESULT_RESPONSE;
        }

        public function GetAllByAttributes($_attributes){
            $SQL = "SELECT * FROM `" . $this->_tableName . "` WHERE ";
            $INDEX = 0;
            foreach ($_attributes as $KEY => $VALUE){
                if($INDEX == 0) $SQL = $SQL . "`$KEY` = '$VALUE'";
                else $SQL = $SQL . " AND `$KEY` = '$VALUE'";
                $INDEX++;
            }
            $RESULT = Instance::Module('Database')->Query($SQL);
            $RESULT_RESPONSE = array();
            while ($ITEM = mysql_fetch_array($RESULT, MYSQL_ASSOC)) {
                $RESULT_RESPONSE[] = $ITEM;
            }
            return $RESULT_RESPONSE;
        }

        public function DeleteAllByAttributes($_attributes){
            $SQL = "DELETE FROM `" . $this->_tableName . "` WHERE ";
            $INDEX = 0;
            foreach ($_attributes as $KEY => $VALUE){
                if($INDEX == 0) $SQL = $SQL . "`$KEY` = '$VALUE'";
                else $SQL = $SQL . " AND `$KEY` = '$VALUE'";
                $INDEX++;
            }
            Instance::Module('Database')->Query($SQL);
        }

    }

?>