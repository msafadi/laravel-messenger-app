<?php

namespace App\Http\Controllers;

use App\Models\Conversation;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MessengerController extends Controller
{
    public function index($id = null)
    {
        $user = Auth::user();

        $friends = User::where('id', '<>', $user->id)
            ->orderBy('name')
            ->paginate();

        return view('messenger', [
            'friends' => $friends,
        ]);
    }
}
