<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Response;
use App\Http\Resources\UserResource;
use App\Http\Requests\User\UpdateUserRequest;
use App\Http\Requests\User\StoreUserRequest;


class UserController extends Controller
{
    // Obtener todos los usuarios
    public function index()
    {
        $users = User::paginate(10);
        return response()->json([
            'message' => 'Usuarios obtenidos con éxito',
            'users' => UserResource::collection($users),
            'pagination' => [
                'current_page' => $users->currentPage(),
                'total_pages' => $users->lastPage(),
                'per_page' => $users->perPage(),
                'total_users' => $users->total(),
                'next_page_url' => $users->nextPageUrl(),
                'prev_page_url' => $users->previousPageUrl(),
            ]
        ], Response::HTTP_OK);
    }

    // Crear un nuevo usuario
    public function store(StoreUserRequest $request)
    {
        $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:6',
            // 'role' => 'string'
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            // 'role' => $request->role ?? 'user',
        ]);

        return response()->json([
            'message' => 'Usuario creado con éxito',
            'users' => new UserResource($user)
        ], Response::HTTP_CREATED);
    }

    // Obtener un usuario por ID
    public function show($id)
    {
        $user = User::findOrFail($id);
        return response()->json([
            'message' => 'Usuario encontrado',
            'users' => new UserResource($user)
        ], Response::HTTP_OK);
    }

    // Actualizar un usuario
    public function update(UpdateUserRequest $request, $id)
    {
        $user = User::findOrFail($id);
        $user->update($request->all());
        return response()->json([
            'message' => 'Usuario actualizado con éxito',
            'users' => new UserResource($user)
        ], Response::HTTP_OK);
    }

    // Eliminar un usuario
    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->update(['is_active' => $user->is_active ? false : true]);
        return response()->json(['message' => 'Usuario desactivado correctamente'], Response::HTTP_OK);
    }
}

