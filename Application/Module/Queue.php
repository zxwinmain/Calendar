<?php

    class Queue{

        protected $_cloud;
        protected $_taskQueue = 'Channel';

        function __construct(){
            $this->_cloud = new SaeTaskQueue($this->_taskQueue);
        }

        public function Send($_tasks){
            $this->_cloud->addTask($_tasks);
            $this->_cloud->push();
        }

    }

?>