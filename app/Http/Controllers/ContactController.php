<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Validator;
use App\Http\Resources\ContactResource;

class ContactController extends Controller
{
    //Listar todos los contactos con paginación
    public function index()
    {
        $contacts = Contact::paginate(10);

        return response()->json([
            'message' => 'Consultas obtenidas con éxito',
            'contacts' => ContactResource::collection($contacts),
            'pagination' => [
                'current_page' => $contacts->currentPage(),
                'total_pages' => $contacts->lastPage(),
                'per_page' => $contacts->perPage(),
                'total_contacts' => $contacts->total(),
                'next_page_url' => $contacts->nextPageUrl(),
                'prev_page_url' => $contacts->previousPageUrl(),
            ]
        ], Response::HTTP_OK);
    }

    // Crear contact
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nombre' => 'required|string|max:255',
            'tipo_identificacion' => 'required|string|max:255',
            'telefono' => 'required|string|max:255',
            'numero_identificacion' => 'required|string|max:255',
            'celular_actualizado' => 'required|string|max:255',
            'correo' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $contacts = Contact::create($request->all());

        return response()->json([
            'message' => 'Consulta creada con éxito',
            'contact' => new ContactResource($contacts)
        ], Response::HTTP_CREATED);
    }

    // Mostrar contacto especifico
    public function show($id)
    {
        $contacts = Contact::find($id);

        if (!$contacts) {
            return response()->json([
                'message' => 'Contacto no encontrado'
            ], Response::HTTP_NOT_FOUND);
        }

        return response()->json([
            'message' => 'Consulta encontrada',
            'contact' => new ContactResource($contacts)
        ], Response::HTTP_OK);
    }

    //Actualizar contacto
    public function update(Request $request, $id)
    {
        $contacts = Contact::findOrFail($id);
        $contacts->update($request->only(
            'nombre', 'tipo_identificacion', 'telefono', 
            'numero_identificacion', 'celular_actualizado', 'correo', 'is_active'
        ));
        return response()->json([
            'success' => true,
            'message' => 'Contacto actualizada con éxito',
            'data' => $contacts
        ], 200);
    }

    //Eliminar contacto
    public function destroy($id)
    {
        $contacts = Contact::findOrFail($id);
        $contacts->update(['is_active' => $contacts->is_active ? false : true]);
        return response()->json(['message' => 'Contacto desactivado correctamente'], Response::HTTP_OK);
    }

    public function count()
    {
        $count = Contact::count();

        return response()->json([
            'count' => $count
        ], Response::HTTP_OK);
    }



}
