<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class BorrowingStoreRequest extends FormRequest
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
        return [
            'member_id' => ['required', 'exists:members,id'],
            'borrow_date' => ['required', 'date'],
            'books' => ['required', 'array', 'min:1'],
            'books.*.book_id' => ['required', 'exists:books,id'],
            'books.*.quantity' => ['required', 'integer', 'min:1'],
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
            'member_id.required' => 'Please select a member.',
            'member_id.exists' => 'Selected member does not exist.',
            'borrow_date.required' => 'Borrow date is required.',
            'borrow_date.date' => 'Borrow date must be a valid date.',
            'books.required' => 'Please select at least one book.',
            'books.min' => 'Please select at least one book.',
            'books.*.book_id.required' => 'Book selection is required.',
            'books.*.book_id.exists' => 'Selected book does not exist.',
            'books.*.quantity.required' => 'Quantity is required.',
            'books.*.quantity.integer' => 'Quantity must be a number.',
            'books.*.quantity.min' => 'Quantity must be at least 1.',
        ];
    }
}
