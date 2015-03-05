<?php

    class Model {
        
        protected $_tableName = NULL;
        protected $_id = NULL;
        protected $_attributes = array();

        protected function _BuildUpdate() {
            $SQL = "UPDATE `" . $this->_tableName . "`";
            $INDEX = 0;
            foreach ($this->_attributes as $KEY => $VALUE){
                if($INDEX == 0) $SQL = $SQL . " SET `$KEY` = '$VALUE'";
                else $SQL = $SQL . ", `$KEY` = '$VALUE'";
                $INDEX++;
            }
            $SQL = $SQL . " WHERE `ID` = '" . $this->_id . "'";
            return $SQL;
        }

        protected function _BuildInsert() {
            $SQL = "INSERT INTO `" . $this->_tableName . "` (";
            $INDEX = 0;
            foreach ($this->_attributes as $KEY => $VALUE){
                if($INDEX == 0) $SQL = $SQL . "`$KEY`";
                else $SQL = $SQL . ", `$KEY`";
                $INDEX++;
            }
            $SQL = $SQL . ") VALUES (";
            $INDEX = 0;
            foreach ($this->_attributes as $KEY => $VALUE){
                if($INDEX == 0) $SQL = $SQL . "'$VALUE'";
                else $SQL = $SQL . ", '$VALUE'";
                $INDEX++;
            }
            $SQL = $SQL . ")";
            return $SQL;
        }

        public function Bind($_id) {
            $this->_id = $_id;
        }

        public function Get($_name) {
            if($this->_attributes[$_name]) return $this->_attributes[$_name];
            else return NULL;
        }

        public function GetAttributes() {
            return $this->_attributes;
        }

        public function Set($_name, $_value) {
            $this->_attributes[$_name] = $_value;
        }

        public function Fetch() {
            if($this->_id && $this->_tableName) {
                $SQL = "SELECT * FROM `" . $this->_tableName . "` WHERE `ID` = '" . $this->_id . "'";
                $SQL_DATA = mysql_fetch_assoc(Instance::Module('Database')->Query($SQL));
                $this->_attributes = $SQL_DATA;
            }
        }

        public function Save() {
            if($this->_tableName) {
                if($this->_id) $SQL = $this->_BuildUpdate();
                else $SQL = $this->_BuildInsert();
                Instance::Module('Database')->Query($SQL);
                if($this->_attributes['ID']) $this->_id = $this->_attributes['ID'];
                $this->Fetch();
            }
        }

        public function Delete() {
            if($this->_id && $this->_tableName) {
                $SQL = "DELETE FROM `" . $this->_tableName . "` WHERE `ID` = '" . $this->_id . "'";
                Instance::Module('Database')->Query($SQL);
                $this->_id = NULL;
                $this->_attributes = array();
            }
        }

    }

?>