(function(){
    angular.module('cashMonthlys.controllers',[])
        .controller('CashMonthlyController',['$scope', '$routeParams','$location','crudService','socketService' ,'$filter','$route','$log',
            function($scope, $routeParams,$location,crudService,socket,$filter,$route,$log){
                $scope.cashMonthlys = [];
                $scope.cashMonthly = {};
                $scope.expenseMonthlys = [];
                $scope.expenseMonthly={};
                $scope.years = {};
                $scope.year={};
                $scope.errors = null;
                $scope.success;
                $scope.query = '';
                $scope.cashMonthly.months_id='1';
                $scope.estado=false;
                $scope.months = [];
                $scope.cashMonthly.years_id;
                $scope.cashMonthly.expenseMonthlys_id='1';
                $scope.expenses = {};
                $scope.expense = {};

                $scope.toggle = function () {
                    $scope.show = !$scope.show;
                };

                $scope.pageChanged = function() {
                    if ($scope.query.length > 0) {
                        crudService.search('cashMonthlys',$scope.query,$scope.currentPage).then(function (data){
                        $scope.cashMonthlys = data.data;
                    });
                    }else{
                        crudService.paginate('cashMonthlys',$scope.currentPage).then(function (data) {
                            $scope.cashMonthlys = data.data;
                        });
                    }
                };


                var id = $routeParams.id;

                if(id)
                {
                    crudService.byId(id,'cashMonthlys').then(function (data) {
                        $scope.cashMonthly = data;
                    });
                    crudService.select('months','select').then(function (data) {
                        $scope.months = data;
                    });

                    crudService.select('years','select').then(function (data) {                        
                        $scope.years = data;

                    });
                    crudService.select('expenses','select').then(function (data) {
                        $scope.expenses = data;
                    });
                    

                }else{
                    crudService.paginate('cashMonthlys',1).then(function (data) {
                        $scope.cashMonthlys = data.data;
                        $scope.maxSize = 5;
                        $scope.totalItems = data.total;
                        $scope.currentPage = data.current_page;
                        $scope.itemsperPage = 15;

                    }); 
                    crudService.select('months','select').then(function (data) {
                        $scope.months = data;
                    });

                    crudService.select('years','select').then(function (data) {
                        
                        $scope.years = data;
                        $scope.cashMonthly.years_id=$scope.years[0].id; 
                    });
                    crudService.select('expenses','select').then(function (data) {
                        $scope.expenses = data;
                    });

                }

                socket.on('cashMonthly.update', function (data) {
                    $scope.cashMonthlys=JSON.parse(data);
                });

                $scope.searchcashMonthly = function(){
                if ($scope.query.length > 0) {
                    crudService.search('cashMonthlys',$scope.query,1).then(function (data){
                        $scope.cashMonthlys = data.data;
                        $scope.totalItems = data.total;
                        $scope.currentPage = data.current_page;
                    });
                }else{
                    crudService.paginate('cashMonthlys',1).then(function (data) {
                        $scope.cashMonthlys = data.data;
                        $scope.totalItems = data.total;
                        $scope.currentPage = data.current_page;
                    });
                }
                    
                };
                $scope.createExpense = function(){
                    if ($scope.expenseMonthlyCreateForm.$valid) {  
                        crudService.create($scope.expenseMonthly, 'expenseMonthlys').then(function (data) {
                            if (data['estado'] == true) {

                                alert('grabado correctamente');
                                
                                  $scope.expenses.push(data);

                            } else {
                                $scope.errors = data;
                            }
                        });
                    }

                }

                $scope.createYear = function(){
                    /*if ($scope.yearCreateForm.$valid) {  
                        crudService.create($scope.year, 'years').then(function (data) {
                            if (data['estado'] == true) {
                                //$scope.success = data['year'];
                                alert('grabado correctamente');
                                //$location.path('/cashMonthlys/create');
                                $scope.years.push(data);
                                $scope.year.year="";
                            } else {
                                $scope.errors = data;
                            }
                        });
                    }*/
                    //--------------------------------------------------
                     if ($scope.yearCreateForm.$valid) {
                        crudService.create($scope.year, 'years').then(function (data) {
                           
                            if (data['estado'] == true) {
                                //$scope.success = data['nombres'];
                                alert('grabado correctamente');
                               // $location.path('/stores');
                               $scope.year.year="";

                            } else {
                                $scope.errors = data;

                            }
                        });
                    }
                }
                
                $scope.createcashMonthly = function(){
                    if ($scope.cashMonthlyCreateForm.$valid) {  
                        crudService.create($scope.cashMonthly, 'cashMonthlys').then(function (data) {
                            if (data['estado'] == true) {
                                $scope.success = data['descripcion'];
                                alert('grabado correctamente');
                                $location.path('/cashMonthlys');

                            } else {
                                $scope.errors = data;
                            }
                        });
                    }
                }


                $scope.editcashMonthly = function(row){
                    $location.path('/cashMonthlys/edit/'+row.id);
                };

                $scope.updatecashMonthly = function(){
                    if ($scope.cashMonthlyCreateForm.$valid) {
                        crudService.update($scope.cashMonthly,'cashMonthlys').then(function(data)
                        {
                            if(data['estado'] == true){
                                $scope.success = data['descripcion'];
                                alert('editado correctamente');
                                $location.path('/cashMonthlys');
                            }else{
                                $scope.errors =data;
                            }
                        });
                    }
                };

                $scope.deletecashMonthly = function(row){
                    $scope.cashMonthly = row;
                }

                $scope.cancelcashMonthly = function(){
                    $scope.cashMonthly = {};
                }

                $scope.destroycashMonthly = function(){
                    crudService.destroy($scope.cashMonthly,'cashMonthlys').then(function(data)
                    {
                        if(data['estado'] == true){
                            $scope.success = data['nombre'];
                            $scope.cashMonthly = {};
                            $route.reload();

                        }else{
                            $scope.errors = data;
                        }
                    });
                }

                $scope.mostrardata=false;

                $scope.verdata=function(){
                   $scope.mostrardata=true;
                   //$scope.expense.name=$scope.cashMonthly.expenseMonthlys_id;
                   //alert($scope.cashMonthly.expenseMonthlys_id);
                   crudService.byId($scope.cashMonthly.expenseMonthlys_id,'expenses').then(function (data) {
                        //$scope.expense = data;
                        
                        $scope.expense.name=data.name;
                    });

                }
                $scope.ocultardata=function(){
                     $scope.mostrardata=false;
                    }

                $scope.deleteYear=function(){
                    crudService.byId($scope.cashMonthly.years_id,'years').then(function (data) {
                        //alert(data.year);
                        crudService.destroy(data,'years').then(function(data)
                            {  
                                //alert(data.year);
                                if(data['estado'] == true){
                                    alert("Eliminado Correctamente");
                                    crudService.select('years','select').then(function (data) {
                                $scope.years = data;
                                $scope.cashMonthly.years_id=$scope.years[0].id; 
                            });
                                    //cashMonthly.years_id='1';
                                }else{
                                    $scope.errors = data;
                                }
                            });
                    }); 
       
                }
                $scope.updatecashYear = function(){
                    $scope.year.id=$scope.cashMonthly.years_id;
                    crudService.update($scope.year,'years').then(function(data)
                    {
                        if(data['estado'] == true){
                            alert('editado correctamente');

                            crudService.select('years','select').then(function (data) {
                                $scope.years = data;
                                $scope.cashMonthly.years_id=$scope.years[0].id; 
                            });

                        }else{
                            $scope.errors =data;
                        }
                    });
                };

                $scope.deleteExpense=function(){
                    crudService.byId($scope.cashMonthly.expenseMonthlys_id,'expenses').then(function (data) {
                        crudService.destroy(data,'expenseMonthlys').then(function(data)
                            {  
                                if(data['estado'] == true){
                                    alert("Eliminado Correctamente");
                                    crudService.select('expenses','select').then(function (data) {
                                    $scope.expenses = data;
                                    $scope.cashMonthly.expenseMonthlys_id=$scope.expenses[0].id; 
                                });
                                    //cashMonthly.years_id='1';
                                }else{
                                    $scope.errors = data;
                                }
                            });
                    });   
                }
                $scope.updatecashExpense = function(){
                    $scope.expense.id=$scope.cashMonthly.expenseMonthlys_id;
                    
                    crudService.update($scope.expense,'expenseMonthlys').then(function(data)
                    {
                        if(data['estado'] == true){
                            alert('editado correctamente');
                            crudService.select('expenses','select').then(function (data) {
                                $scope.expenses = data;
                            });
                        }else{
                            $scope.errors =data;
                        }
                    });
                     $scope.mostrardata=false;
                };

            }]);
})();
