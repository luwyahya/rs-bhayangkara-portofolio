<?php

namespace App\Http\Controllers\Web\Admin;

use App\Http\Controllers\ApiController;

class WebAdminMaster extends ApiController
{
    public function __construct()
    {
		//nanti ini di ubah setelah masa dev selsai
        parent::__construct($skip_authentication=true);
    }
    
}
