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
    public function index(Request $request)
    {
        $query = User::with('roles'); 

        if ($request->has('search') && !empty($request->search)) {
            $searchTerm = $request->search;
            
            $query->where(function($q) use ($searchTerm) {
                $q->where('name', 'LIKE', "%{$searchTerm}%")
                  ->orWhere('email', 'LIKE', "%{$searchTerm}%");
            });
        } 

        $users = $query->paginate(10);
        
        return response()->json([
            'message'       => 'Usuarios obtenidos con éxito',
            'users'         => UserResource::collection($users),
            'pagination'    => [
                'current_page'  => $users->currentPage(),
                'total_pages'   => $users->lastPage(),
                'per_page'      => $users->perPage(),
                'total_users'   => $users->total(),
                'next_page_url' => $users->nextPageUrl(),
                'prev_page_url' => $users->previousPageUrl(),
            ]
        ], Response::HTTP_OK);
    }

    // Crear un nuevo usuario
    public function store(StoreUserRequest $request)
    {
        // Crear un nuevo usuario
        $user = User::create([
            'name'      => $request->name,
            'email'     => $request->email,
            'password'  => Hash::make($request->password),
            'is_active' => $request->is_active ?? true,
        ]);

        // Asignar rol si viene en la request
        if ($request->has('role')) {
            $user->assignRole($request->role);
        }

        return response()->json([
            'message' => 'Usuario creado correctamente',
            'user'    => new UserResource($user),
            'role'    => $request->role ?? null
        ], Response::HTTP_CREATED);
    }
    // Obtener un usuario por ID
    public function show($id)
    {
        $user = User::findOrFail($id);
        return response()->json([
            'message'   => 'Usuario encontrado',
            'users'     => new UserResource($user)
        ], Response::HTTP_OK);
    }

    // Actualizar un usuario
    public function update(UpdateUserRequest $request, $id)
    {
        $user = User::findOrFail($id);

        // Actualizar los campos básicos (nombre, email, password si viene)
        $data = $request->only(['name', 'email', 'is_active']);
        if ($request->filled('password')) {
            $data['password'] = Hash::make($request->password);
        }
        $user->update($data);

        // Actualizar rol si viene en la request
        if ($request->filled('role')) {
            $user->syncRoles($request->role); // Reemplaza los roles actuales con el nuevo
        }

        return response()->json([
            'message' => 'Usuario actualizado con éxito',
            'user'    => new UserResource($user),
            'role'    => $request->role ?? null
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

