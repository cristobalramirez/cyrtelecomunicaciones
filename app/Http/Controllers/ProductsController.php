<?php

namespace Salesfly\Http\Controllers;

use Illuminate\Http\Request;

use Illuminate\Support\Facades\View;
use Mockery\Matcher\Type;
use Salesfly\Http\Requests;
use Salesfly\Http\Controllers\Controller;

use Salesfly\Salesfly\Repositories\ProductRepo;
use Salesfly\Salesfly\Managers\ProductManager;
use Salesfly\Salesfly\Repositories\VariantRepo;
use Salesfly\Salesfly\Managers\VariantManager;

use Salesfly\Salesfly\Entities\Brand;
use Salesfly\Salesfly\Entities\Ttype;
use Salesfly\Salesfly\Entities\Material;
use Salesfly\Salesfly\Entities\Station;

class ProductsController extends Controller
{
    protected $productRepo;
    protected $variantRepo;

    public function __construct(ProductRepo $productRepo, VariantRepo $variantRepo)
    {
        $this->productRepo = $productRepo;
        $this->variantRepo = $variantRepo;
        $this->middleware('auth');
        //$this->middleware('role:admin');
    }

    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index()
    {
        //
        return View('products.index');
    }

    public function all()
    {
        $products = $this->productRepo->all();
        return response()->json($products);
        //var_dump($customers);
    }

    public function paginate(){
        $products = $this->productRepo->paginate(15);
        return response()->json($products);
    }


    public function form_create()
    {
        return View('products.form_create');
    }

    public function form_edit()
    {
        return View('products.form_edit');
    }

    public function create(Request $request)
    {
        $product = $this->productRepo->getModel();
        $variant = $this->variantRepo->getModel();

        if ($request->input('estado') == 1) {}else{$request->merge(array('estado' => '0'));};
        if ($request->input('hasVariants') == 1) {}else{$request->merge(array('hasVariants' => '0'));};
        if ($request->input('track') == 1) {}else{$request->merge(array('track' => '0'));};

        $managerPro = new ProductManager($product,$request->except('sku','suppPri','markup','price','track'));

        if($request->input('hasVariants') === true){
            $managerPro->save();
            $request->merge(array('product_id' => $product->id));
            $product->quantVar = 0;
            $product->save();
            //$managerVar = new VariantManager($variant,$request->only('sku','suppPri','markup','price','track','product_id'));
            //$managerVar->save();
        }elseif($request->input('hasVariants') === '0'){
            $managerPro->save();
            $request->merge(array('product_id' => $product->id));
            $product->quantVar = 0;
            $product->save();
            $managerVar = new VariantManager($variant,$request->only('sku','suppPri','markup','price','track','product_id'));
            $managerVar->save();
        }

        return response()->json(['estado'=>true, 'nombres'=>$product->nombre]);
    }

    public function show()
    {
        return View('products.show');
    }

    public function find($id)
    {
        $product = $this->productRepo->find($id);
        return response()->json($product);
    }

    /*public function edit(Request $request)
    {
        $customer = $this->customerRepo->find($request->id);
        //var_dump($request->except('fechaNac'));
        //die();
        $manager = new CustomerManager($customer,$request->except('fechaNac'));
        $manager->save();
        if($this->customerRepo->validateDate(substr($request->input('fechaNac'),0,10))){
            //$customer->fechaNac = date("Y-m-d", strtotime($request->input('fechaNac')));
            $customer->fechaNac = substr($request->input('fechaNac'),0,10);
            $customer->save();
        }

        //Event::fire('update.customer',$customer->all());
        return response()->json(['estado'=>true, 'nombre'=>$customer->nombre]);
    }

    public function destroy(Request $request)
    {
        $customer= $this->customerRepo->find($request->id);
        $customer->delete();
        //Event::fire('update.customer',$customer->all());
        return response()->json(['estado'=>true, 'nombre'=>$customer->nombre]);
    }

    public function search($q)
    {
        //$q = Input::get('q');
        $customers = $this->customerRepo->search($q);

        return response()->json($customers);
    }*/
    public function brands_select(){
        $brands = Brand::lists('nombre','id');
        return response()->json($brands);
    }
    public function materials_select(){
        $materials = Material::lists('nombre','id');
        return response()->json($materials);
    }
    public function types_select(){
        $types = Ttype::lists('nombre','id');
        return response()->json($types);
    }
    public function stations_select(){
        $stations = Station::lists('nombre','id');
        return response()->json($stations);
    }
}