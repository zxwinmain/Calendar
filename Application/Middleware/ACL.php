<?php
    
    namespace Slim\Middleware;

    use \Instance as Instance;

    class ACL extends \Slim\Middleware {

        public function call() {
            $this->app->hook('slim.before.dispatch', array($this, 'onBeforeDispatch'));
            $this->next->call();
        }

        public function onBeforeDispatch() {
            $request = $this->app->request()->getPathInfo();
            if($request == '/' || stripos($request, '/api/') !== FALSE) self::authenticate();
            if(stripos($request, '/administrator') !== FALSE) self::administrator();
        }

        public function authenticate() {
            if(!$this->app->auth = Instance::Module('Authenticate')->Load($this->app)){
                if($this->app->request->isAjax() || $this->app->request->isXhr()){
                    Instance::Response(array(
                        'MESSAGE' => 'INVAID_TOKEN'
                    ), FALSE);
                } else $this->app->redirect('/signin');
            }
        }

        public function administrator() {
             $this->authenticate();
             Instance::Module('Authenticate')->Administrator($this->app, $this->app->auth);
        }

    }

?>