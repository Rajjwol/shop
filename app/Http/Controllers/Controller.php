<?php

namespace App\Http\Controllers;


abstract class Controller
{
      // Optional: add traits like AuthorizesRequests, DispatchesJobs, ValidatesRequests
    use \Illuminate\Foundation\Auth\Access\AuthorizesRequests;
    use \Illuminate\Foundation\Bus\DispatchesJobs;
    use \Illuminate\Foundation\Validation\ValidatesRequests;
}
