<?php

    class Cache{

        protected $_cloud;

        function __construct(){
            $this->_cloud = new SaeKV();
            $this->_cloud->init();
        }

        function Set($_key, $_value){
            $this->_cloud->set($_key, $_value);
        }

        function Get($_key){
            return $this->_cloud->get($_key);
        }

        function Delete($_key){
            $this->_cloud->delete($_key);
        }

    }

?>