<?php

use Illuminate\Database\Seeder;

class JokesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $faker =  Faker\Factory::create();

        foreach(range(1,300000) as $index)
        {
        	DB::table('jokes')->insert([
	           'body' => $faker->paragraph($nbSentences = 3),
               'user_id' =>$faker->numberBetween($min = 1, $max = 5)
	        ]);
        }
    }
}
