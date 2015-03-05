<?php

    class Database{

        protected $link_id;
        protected $database_id;
        protected $query_id;

        function __construct() {
            $this->link_id = @mysql_connect(SAE_MYSQL_HOST_M . ':' . SAE_MYSQL_PORT, SAE_MYSQL_USER, SAE_MYSQL_PASS);
            if(!$this->link_id) $this->Error();
            else{
                $this->database_id = @mysql_select_db(SAE_MYSQL_DB, $this->link_id); 
                if(!$this->database_id) $this->Error();
            }
        }

        public function Query($sql){
            $this->query_id = @mysql_query($sql, $this->link_id); 
            if(!$this->query_id) $this->Error();
            else return $this->query_id;
        }

        public function Rows() { 
            return mysql_affected_rows($this->link_id); 
        } 

        public function Count(){
            return @mysql_num_rows($this->query_id);
        }

        public function Close(){
            return @mysql_close($this->link_id);
        }

        public function Error(){
            die(mysql_error());
        }

    }

?>