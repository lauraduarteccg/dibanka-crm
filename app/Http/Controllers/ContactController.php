<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Validator;
use App\Http\Resources\ContactResource;
use App\Http\Requests\ContactRequest;

class ContactController extends Controller
{
    //Listar todos los contactos con paginación
    public function index(Request $request)
    {
        $query = Contact::query();
        // 🔎 Buscar directamente por identification_number si viene en el request
        if ($request->has('identification_number') && !empty($request->identification_number)) {
            $query->where('identification_number', $request->identification_number);
        }

        // 🔎 Búsqueda general con search
        if ($request->has('search') && !empty($request->search)) {
            $searchTerm = $request->search;

            $query->where(function ($q) use ($searchTerm) {
                $q->where('campaign', 'LIKE', "%{$searchTerm}%")
                    ->orWhere('name', 'LIKE', "%{$searchTerm}%")
                    ->orWhere('phone', 'LIKE', "%{$searchTerm}%")
                    ->orWhere('update_phone', 'LIKE', "%{$searchTerm}%")
                    ->orWhere('email', 'LIKE', "%{$searchTerm}%")
                    ->orWhere('identification_type', 'LIKE', "%{$searchTerm}%")
                    // 👇 exacto para identification_number dentro del search
                    ->orWhere('identification_number', 'LIKE', "%{$searchTerm}%");

                // Para buscar en relaciones
                $q->orWhereHas('payroll', function ($payrollQuery) use ($searchTerm) {
                    $payrollQuery->where('name', 'LIKE', "%{$searchTerm}%");
                });
            });
        }

        $contacts = $query->with('payroll')->paginate(10);
        log_activity('ver_listado', 'Contactos', [
            'mensaje' => "El usuario {$request->user()->name} consultó el listado de contactos.",
            'criterios' => [
                'búsqueda' => $request->search ?? 'Sin filtro aplicado',
                'número_identificación' => $request->identification_number ?? 'No especificado'
            ]
        ], $request);

        return response()->json([
            'message'           => 'Consultas obtenidas con éxito',
            'contacts'          => ContactResource::collection($contacts),
            'pagination'        => [
                'current_page'      => $contacts->currentPage(),
                'total_pages'       => $contacts->lastPage(),
                'per_page'          => $contacts->perPage(),
                'total_contacts'    => $contacts->total(),
                'next_page_url'     => $contacts->nextPageUrl(),
                'prev_page_url'     => $contacts->previousPageUrl(),
            ]
        ], Response::HTTP_OK);
    }

    // Obtener contactos activos sin paginación
    public function active(Request $request)
    {
        $query = Contact::where('is_active', 1);

        // 🔎 Filtrar por pagaduría si viene en el request
        if ($request->has('payroll') && !empty($request->payroll)) {
            $payrollTerm = $request->payroll;
            
            $query->whereHas('payroll', function ($payrollQuery) use ($payrollTerm) {
                $payrollQuery->where('name', 'LIKE', "%{$payrollTerm}%");
            });
        }

        $contacts = $query->with('payroll')->paginate(10);
        
        log_activity('ver_listado', 'Contactos', [
            'mensaje' => "El usuario {$request->user()->name} consultó el listado de contactos activos.",
            'criterios' => [
                'pagaduría' => $request->payroll ?? 'Sin filtro aplicado'
            ]
        ], $request);
        
        return response()->json([
            'message' => 'Contactos activos obtenidos con éxito',
            'contacts' => ContactResource::collection($contacts),
            'pagination'        => [
                'current_page'      => $contacts->currentPage(),
                'total_pages'       => $contacts->lastPage(),
                'per_page'          => $contacts->perPage(),
                'total_contacts'    => $contacts->total(),
            ]
        ], Response::HTTP_OK);
    }

    // Crear contact
    public function store(ContactRequest $request)
    {
        $contacts = Contact::create($request->all());
        $contacts->load(['payroll']);
        log_activity('crear', 'Contactos', [
            'mensaje' => "El usuario {$request->user()->name} creó un nuevo contacto.",
     
            'contact_id' => $contacts->id
        ], $request);

        return response()->json([
            'message' => 'Consulta creada con éxito',
            'contact' => new ContactResource($contacts)
        ], Response::HTTP_CREATED);
    }

    // Mostrar contacto especifico
    public function show(Request $request, $id)
    {
        $contacts = Contact::find($id);

        if (!$contacts) {
            return response()->json([
                'message' => 'Contacto no encontrado'
            ], Response::HTTP_NOT_FOUND);
        }
        log_activity('ver_detalle', 'Contactos', [
            'mensaje' => "El usuario {$request->user()->name} consultó el detalle de un contacto.",
            'contacto_id' => $id,
        ], $request);

        return response()->json([
            'message' => 'Consulta encontrada',
            'contact' => new ContactResource($contacts)
        ], Response::HTTP_OK);
    }

    //Actualizar contacto
    public function update(ContactRequest $request, $contact)
    {
        $contacts = Contact::findOrFail($contact);
        $dataBefore = $contacts->toArray();

        $contacts->update($request->only(
            'campaign',
            'payroll_id',
            'name',
            'identification_type',
            'phone',
            'identification_number',
            'update_phone',
            'email',
            'is_active'
        ));
        $contacts->load(['payroll']);
        log_activity('actualizar', 'Contactos', [
            'mensaje' => "El usuario {$request->user()->name} actualizó la información de un contacto.",
            'contacto_id' => $contacts->id,
            'cambios' => [
                'antes' => $dataBefore,
                'despues' => $contacts->toArray(),
            ],
        ], $request);


        return response()->json([
            'success' => true,
            'message' => 'Contacto actualizada con éxito',
            'data' => $contacts
        ], Response::HTTP_OK);
    }

    //Eliminar contacto
    public function destroy(Request $request, $id)
    {
        $contacts = Contact::findOrFail($id);
        $state = $contacts->is_active;
        $contacts->update(['is_active' => $contacts->is_active ? false : true]);
        log_activity(
            $contacts->is_active ? 'activar' : 'desactivar',
            'Contactos',
            [
                'mensaje' => "El usuario {$request->user()->name} " .
                    ($contacts->is_active ? 'activo' : 'desactivo') .
                    " un contacto.",
                'contacto_id' => $contacts->id,

            ],
            $request
        );

        return response()->json(['message' => 'Contacto desactivado correctamente'], Response::HTTP_OK);
    }

    public function count()
    {
        $count = Contact::where('is_active', 1)->count();

        return response()->json([
            'count' => $count
        ], Response::HTTP_OK);
    }
}
