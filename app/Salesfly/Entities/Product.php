<?php

namespace Salesfly\Salesfly\Entities;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    //
    protected $table = 'products';

    protected $fillable = ['nombre',
                            'codigo',
                            'suppCode',
                            'descripcion',
                            'image',
                            'hasVariants',
                            'type_id',
                            'brand_id',
                            'material_id',
                            'station_id',
                            'estado'
                            ];
    public function brand(){
        return $this->belongsTo('Salesfly\Salesfly\Entities\Brand');
    }
    public function type(){
        return $this->belongsTo('Salesfly\Salesfly\Entities\Ttype');
    }
    public function station(){
        return $this->belongsTo('Salesfly\Salesfly\Entities\Station');
    }
    public function material(){
        return $this->belongsTo('Salesfly\Salesfly\Entities\Material');
    }
}