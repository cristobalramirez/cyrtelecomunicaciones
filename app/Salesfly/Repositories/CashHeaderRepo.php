<?php
namespace Salesfly\Salesfly\Repositories;
use Salesfly\Salesfly\Entities\CashHeader;



class CashHeaderRepo extends BaseRepo{
    
    public function getModel()
    {       
        return new CashHeader;
    }


    public function search($q)
    {
        $cashHeaders =CashHeader::with('store')->where('nombre','like', $q.'%')
                    ->orWhere('ambiente','like',$q.'%')
                    //->orWhere('s','like',$q.'%')
                    //with(['customer','employee'])
                    ->paginate(15);
        return $cashHeaders;
    }
    public function searchHeader($q)
    {
        $cashHeaders =CashHeader::where('store_id','=', $q)
                    ->get();
        return $cashHeaders;
    }


    public function paginate($count){
        $cashHeaders = CashHeader::with('store');
        return $cashHeaders->paginate($count);
    }
    public function cajasActivas(){
        $cashHeaders =CashHeader::join('cashes','cashes.cashHeader_id','=','cashHeaders.id')
                                  ->where('cashes.estado','=',1)
                                  ->select('cashHeaders.*','cashes.id as cashID','cashes.montoBruto as montoUsable')
                    ->get();
        return $cashHeaders;
    }
} 