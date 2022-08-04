<?php

use Illuminate\Database\Seeder;


class KategoriTableSeeder extends Seeder
{
    public function run()
    {
        $faker =  Faker\Factory::create();

        foreach(range(1,30) as $index)
        {
            DB::table('kategori')->insert([
                'nama' => $faker->company,
                'keterangan' =>$faker->paragraph($nbSentences = 2)
            ]);
        }
    }
}
