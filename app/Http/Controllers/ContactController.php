<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ContactController extends Controller
{
    public function index()
    {
        return response()->json(Contact::paginate(10));
    }

    public function store(Request $request)
    {
        $contact = Contact::create($request->all());
        return response()->json($contact, 201);
    }

    public function show($id)
    {
        return response()->json(Contact::findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $contact = Contact::findOrFail($id);
        $contact->update($request->all());
        return response()->json($contact);
    }

    public function destroy($id)
    {
        Contact::findOrFail($id)->delete();
        return response()->json(null, 204);
    }
    public function count()
    {
        $count = Contact::count();
        Log::info("🔹 Consulta de conteo de contactos ejecutada. Cantidad de contactos: " . $count);

        return response()->json([
            'message' => 'Endpoint ejecutado correctamente',
            'count' => $count
        ], 200);
    }



}
