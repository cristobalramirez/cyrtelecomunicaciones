(function(){
    angular.module('products.controllers',[])
        .controller('ProductController',['$scope', '$routeParams','$location','crudService','socketService' ,'$filter','$route','$log',
            function($scope, $routeParams,$location,crudService,socket,$filter,$route,$log){
                $scope.products = [];
                $scope.product = {};
                $scope.generos = [{name:'Masculino'},{name:'Femenino'}];
                $scope.errors;
                $scope.success;
                $scope.query = '';
                $scope.brands = {};
                $scope.materials = {};
                $scope.types = {};
                $scope.stations = {};
                $scope.product.estado = true;
                $scope.product.hasVariants = false;

                $scope.presentation = {};
                $scope.presentations = [];
                $scope.presentation.id = '1';
                $scope.product.presentations = [];
                $scope.presentation.suppPri = 0;
                $scope.presentation.markup = 0;
                $scope.presentation.price = 0;

                $scope.warehouses = []


                $scope.variants = []; //variantes por product_id;


                $scope.calculateSuppPric = function() {//presentation.markup
                    //alert('holi');alert($scope.presentation.suppPri);
                    if(angular.isNumber($scope.presentation.suppPri) && angular.isNumber($scope.presentation.markup) && angular.isNumber($scope.presentation.price)){
                        $scope.presentation.price = $scope.presentation.suppPri + $scope.presentation.markup * $scope.presentation.suppPri / 100;
                        //alert('pasa');
                    }
                };
                $scope.calculateMarkup = function() {
                    //alert('holi');
                    if(angular.isNumber($scope.presentation.suppPri) && angular.isNumber($scope.presentation.markup) && angular.isNumber($scope.presentation.price)){
                        $scope.presentation.price = $scope.presentation.suppPri + $scope.presentation.markup * $scope.presentation.suppPri / 100;
                    }
                };
                $scope.toggle = function () {
                    $scope.show = !$scope.show;
                };

                $scope.pageChanged = function() {
                    if ($scope.query.length > 0) {
                        crudService.search('products',$scope.query,$scope.currentPage).then(function (data){
                        $scope.products = data.data;
                    });
                    }else{
                        crudService.paginate('products',$scope.currentPage).then(function (data) {
                            $scope.products = data.data;
                        });
                    }
                };


                var id = $routeParams.id;

                if(id)
                {
                    if($location.path() == '/products/edit/'+$routeParams.id) {
                        crudService.byId(id, 'products').then(function (data) {
                           // $log.log(data);
                            $scope.product = data;

                        });
                    };

                    if($location.path() == '/products/show/'+$routeParams.id) {
                        //alert('ok');
                        crudService.byId(id,'products').then(function (data){
                            $scope.product = data;
                        });
                    };
                    //alert('ok');

                }else{
                    crudService.paginate('products',1).then(function (data) {
                        $scope.products = data.data;
                        $log.log(data.data);
                        $scope.maxSize = 5;
                        $scope.totalItems = data.total;
                        $scope.currentPage = data.current_page;
                        $scope.itemsperPage = 15;

                    });

                    if($location.path() == '/products/create') {

                        crudService.select('products', 'brands').then(function (data) {
                            $scope.brands = data;
                        });
                        crudService.select('products', 'materials').then(function (data) {
                            $scope.materials = data;
                        });
                        crudService.select('products', 'types').then(function (data) {
                            $scope.types = data;
                        });
                        crudService.select('products', 'stations').then(function (data) {
                            $scope.stations = data;
                        });
                        crudService.all('warehouses').then(function (data){
                            $scope.warehouses = data;
                        });
                    }
                }

                socket.on('product.update', function (data) {
                    $scope.products=JSON.parse(data);
                });

                $scope.searchProduct = function(){
                if ($scope.query.length > 0) {
                    crudService.search('products',$scope.query,1).then(function (data){
                        $scope.products = data.data;
                        $scope.totalItems = data.total;
                        $scope.currentPage = data.current_page;
                    });
                }else{
                    crudService.paginate('products',1).then(function (data) {
                        $scope.products = data.data;
                        $scope.totalItems = data.total;
                        $scope.currentPage = data.current_page;
                    });
                }
                    
                };



                $scope.createProduct = function(){

                    if ($scope.productCreateForm.$valid) {
                        var f = document.getElementById('productImage').files[0] ? document.getElementById('productImage').files[0] : null;
                        //alert(f);
                        var r = new FileReader();
                        r.onloadend = function(e) {
                            $scope.product.image = e.target.result;

                            crudService.create($scope.product, 'products').then(function (data) {
                                if (data['estado'] == true) {
                                    $scope.success = data['nombres'];

                                    $location.path('/products');

                                } else {
                                    $scope.errors = data;
                                    //alert(data);

                                }
                            });
                        }
                        if(!document.getElementById('productImage').files[0]){
                            alert($scope.product.hasVariants);
                            crudService.create($scope.product,'products').then(function (data){
                                if (data['estado'] == true) {
                                    //$scope.success = data['nombres'];

                                    $location.path('/products');

                                } else {
                                    $scope.errors = data;

                                }
                            });
                        }

                        if(document.getElementById('productImage').files[0]){
                            r.readAsDataURL(f);
                        }

                    }
                }

                $scope.editProduct = function(row){
                    $location.path('/products/edit/'+row.id);
                };

                $scope.updateProduct = function(){
                    if ($scope.productCreateForm.$valid) {
                        var f = document.getElementById('productImage').files[0] ? document.getElementById('productImage').files[0] : null;
                        //alert(f);
                        var r = new FileReader();
                        r.onloadend = function(e) {
                            $scope.product.image = e.target.result;
                        crudService.update($scope.product,'products').then(function(data)
                        {
                            if(data['estado'] == true){
                                $scope.success = data['nombres'];
                                alert('editado correctamente');
                                $location.path('/products');
                            }else{
                                $scope.errors =data;
                            }
                        });
                        }
                        if(!document.getElementById('productImage').files[0]){
                        crudService.update($scope.product,'products').then(function(data)
                        {
                            if(data['estado'] == true){
                                $scope.success = data['nombres'];
                                alert('editado correctamente');
                                $location.path('/products');
                            }else{
                                $scope.errors =data;
                            }
                        });}

                        if(document.getElementById('productImage').files[0]){
                            r.readAsDataURL(f);
                        }
                    }
                };

                $scope.deleteProduct = function(row){
                    $scope.product = row;
                }

                $scope.cancelProduct = function(){
                    $scope.product = {};
                }

                $scope.destroyProduct = function(){
                    crudService.destroy($scope.product,'products').then(function(data)
                    {
                        if(data['estado'] == true){
                            $scope.success = data['nombre'];
                            $scope.product = {};
                            //alert('hola');
                            $route.reload();

                        }else{
                            $scope.errors = data;
                        }
                    });
                }

                /*
                fx de variants
                 */
                $scope.showVariants = function(row){
                    crudService.byforeingKey('variants','variants',row.proId).then(function(data)
                    {
                            $scope.variants = data;
                    })
                }

                $scope.traerPres = function(){
                    crudService.all('presentations').then(function(data){
                        $scope.presentations = data;
                        $log.log( $scope.presentations);
                    });
                }

                $scope.AddPres = function(){
                    $scope.product.presentations.push($scope.presentation);
                    $scope.presentation = {};
                }

                $scope.deletePres = function($index){
                    $scope.product.presentations.splice($index,1);
                }


            }]);
})();