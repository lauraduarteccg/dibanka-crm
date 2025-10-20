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

            $query->where(function ($q) use ($searchTerm) {
                $q->where('name', 'LIKE', "%{$searchTerm}%")
                    ->orWhere('email', 'LIKE', "%{$searchTerm}%")
                    // 🔍 Búsqueda por nombre del rol asociado
                    ->orWhereHas('roles', function ($roleQuery) use ($searchTerm) {
                        $roleQuery->where('name', 'LIKE', "%{$searchTerm}%");
                    });
            });
            log_activity('ver_listado', 'Usuarios', [
                'mensaje' => "El usuario {$request->user()->name} visualizó el listado de usuarios" .
                    ($request->filled('search') ? " aplicando el filtro: '{$request->search}'" : ""),
                'criterios' => ['búsqueda' => $request->search ?? null]

            ], $request);
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
        log_activity('crear', 'Usuarios', [
            'mensaje' => "El usuario {$request->user()->name} creó un nuevo usuario en el sistema.",
            'user_id' => $user->id
        ], $request);


        return response()->json([
            'message' => 'Usuario creado correctamente',
            'user'    => new UserResource($user),
            'role'    => $request->role ?? null
        ], Response::HTTP_CREATED);
    }
    // Obtener un usuario por ID
    public function show(Request $request, $id)
    {
        $user = User::findOrFail($id);
        log_activity('ver_detalle', 'Usuarios', [
            'mensaje' => "El usuario {$request->user()->name} visualizó el detalle del usuario con ID {$user->id}.",
            'id_usuario' => $user->id

        ], $request);

        return response()->json([
            'message'   => 'Usuario encontrado',
            'users'     => new UserResource($user)
        ], Response::HTTP_OK);
    }

    // Actualizar un usuario
    public function update(UpdateUserRequest $request, $id)
    {
        $user = User::findOrFail($id);
        $dataBefore = $user->toArray();

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
        log_activity('actualizar', 'Usuarios', [
            'mensaje' => "El usuario {$request->user()->name} actualizó la información del usuario con ID {$user->id}.",
            'cambios' => [
                'antes' => $dataBefore,
                'después' => $user->toArray(),
            ],
            'user_id' => $user->id
        ], $request);


        return response()->json([
            'message' => 'Usuario actualizado con éxito',
            'user'    => new UserResource($user),
            'role'    => $request->role ?? null
        ], Response::HTTP_OK);
    }
    // Eliminar un usuario
    public function destroy(Request $request, $id)
    {
        $user = User::findOrFail($id);
        $state = $user->is_active;
        $user->update(['is_active' => $user->is_active ? false : true]);
        log_activity(
            $user->is_active ? 'activar' : 'desactivar',
            'Usuarios',
            [
                'mensaje' => "El usuario {$request->user()->name} " .
                    ($user->is_active ? 'activó' : 'desactivó') .
                    " la cuenta del usuario con ID {$user->id}.",
         
            ],
            $request
        );

        

        return response()->json(['message' => 'Usuario desactivado correctamente'], Response::HTTP_OK);
    }
}
