<?php
namespace App\Transformers;
class JokeTransformer extends Transformer{

	/**
	 * Creates the application.
	 *
	 * @return \Illuminate\Foundation\Application
	 */
		
	/**
	 * Transform a school
	 *
	 * @param  int  $school
	 * @return array
	 */
	public function transform($joke)
	{		
		return [
			'joke_id' => $joke['id'],
			'joke' => $joke['body'],
			'submitted_by' => $joke['user']['name']
			];
	}
}
