<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BorrowingDetail extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'borrowing_id',
        'book_id',
        'quantity',
    ];

    /**
     * Get the borrowing that owns the borrowing detail.
     */
    public function borrowing(): BelongsTo
    {
        return $this->belongsTo(Borrowing::class);
    }

    /**
     * Get the book that owns the borrowing detail.
     */
    public function book(): BelongsTo
    {
        return $this->belongsTo(Book::class);
    }
}
