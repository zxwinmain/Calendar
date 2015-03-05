<?php

    class Instance{

        public static $_module = array();
        public static $_middleware = array();

        public static function Init(){
            session_start();
        }

        public static function ID(){
            return md5(uniqid(mt_rand(), TRUE) . mt_rand() . uniqid(mt_rand(), TRUE));
        }

        public static function Module($_name) {
            if(self::$_module[$_name] === NULL) {
                require "Module/$_name.php";
                self::$_module[$_name] = new $_name;
            }
            return self::$_module[$_name];
        }

        public static function Middleware($_app, $_name) {
            if(self::$_module[$_name] === NULL) {
                $class = '\\Slim\\Middleware\\' . $_name;
                require "Middleware/$_name.php";
                $_app->add(new $class());
            }
        }

        public static function Model($_name) {
            require_once "Model/$_name.php";
            $class = $_name . 'Model';
            return new $class;
        }

        public static function Collection($_name) {
            require_once "Collection/$_name.php";
            $class = $_name . 'Collection';
            return new $class;
        }

        public static function Required($_input){
            foreach ($_input as $item){
                if(!$item) self::Response('INVALID_PARAMETER');
            }
        }

        public static function Response($_response, $_succeed=TRUE){
            header('Content-type: text/json');
            die(json_encode(array(
                'succeed' => $_succeed,
                'response' => $_response
            )));
        }

    }

?>