<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateMonitoringRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'solution_date' => 'required|date',
            'monitoring_id' => 'required|integer|exists:monitoring,id',
        ];
    }
}
