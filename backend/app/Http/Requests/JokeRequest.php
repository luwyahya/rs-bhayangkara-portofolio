<?php

namespace App\Http\Requests;

use App\Http\Requests\Request;

class JokeRequest extends Request
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        $rules =[
            'user_id' => 'required',
            'body' => 'required',
        ];

        // if (Request::get('_method')=="PATCH") {
        //     $id = (int)Request::segment(3);
        //     $rules['code'] = 'required|unique:brands,code,'.$id;
        //     $rules['name'] = 'required|unique:brands,name,'.$id;
        // }

        return $rules;
    }
}
