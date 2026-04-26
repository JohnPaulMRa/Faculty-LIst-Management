<?php

namespace App\Http\Requests\Settings;

use App\Concerns\ProfileValidationRules;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class ProfileUpdateRequest extends FormRequest
{
    use ProfileValidationRules;

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return array_merge($this->profileRules($this->user()->id), [
            'hei_address' => ['nullable', 'string', 'max:255'],
            'hei_contact_number' => ['nullable', 'string', 'max:50'],
            'hei_email' => ['nullable', 'string', 'email', 'max:255'],
        ]);
    }
}
