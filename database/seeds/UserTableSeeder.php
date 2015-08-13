<?php

use Illuminate\Database\Seeder;

class UserTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //


            DB::table('users')->insert([
                'name' => 'Javier Jesús Alvarez Montenegro',
                'email' => 'jalvarez@honeysoft.pe',
                'password' => bcrypt('root'),
                'estado' => 1,
                'role_id' => 1,
                'store_id' => 1
            ]);

            DB::table('users')->insert([
                'name' => 'Melvin Alexis Diaz Rojas',
                'email' => 'mdiazr@honeysoft.pe',
                'password' => bcrypt('123456'),
                'estado' => 1,
                'role_id' => 1,
                'store_id' => 1
            ]);
            DB::table('users')->insert([
                'name' => 'Cristobal Ramirez Cabrera',
                'email' => 'cramirez@honeysoft.pe',
                'password' => bcrypt('123456'),
                'estado' => 1,
                'role_id' => 1,
                'store_id' => 1
            ]);


    }
}