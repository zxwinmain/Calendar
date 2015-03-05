<?php

    class Mail{

        protected $_cloud;
        protected $_sender = '';
        protected $_smtp_host = '';
        protected $_smtp_port = 25;
        protected $_smtp_username = '';
        protected $_smtp_password = '';

        function __construct(){
            $this->_cloud = new SaeMail();
        }

        public function Send($_to, $_title, $_content){
            $this->_cloud->setOpt(array(
                'smtp_host' => $this->_smtp_host,
                'smtp_port' => $this->_smtp_port,
                'smtp_username' => $this->_smtp_username,
                'smtp_password' => $this->_smtp_password,
                'from' => $this->_sender,
                'to' => $_to,
                'subject' => $_title,
                'content' => $_content,
                'content_type' => 'HTML'
            ));
            if(!$this->_cloud->send()){
                var_dump($this->_cloud->errno(), $this->_cloud->errmsg());
            }
            $this->_cloud->clean();
        }

        public function Templet($_name, $_params){
            $templet = file_get_contents(dirname(dirname(dirname(__FILE__))) . '/templets/' . $_name . '.php');
            foreach ($_params as $key => $value) {
                $templet = str_replace('#' . $key . '#', $value, $templet);
            }
            return $templet;
        }

    }

?>