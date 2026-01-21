<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BorrowingReturnRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $borrowing = $this->route('borrowing');
        $borrowDate = $borrowing ? $borrowing->borrow_date->format('Y-m-d') : 'today';

        return [
            'return_date' => ['required', 'date', "after_or_equal:{$borrowDate}"],
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'return_date.required' => 'Return date is required.',
            'return_date.date' => 'Return date must be a valid date.',
            'return_date.after_or_equal' => 'Return date must be on or after borrow date.',
        ];
    }
}
