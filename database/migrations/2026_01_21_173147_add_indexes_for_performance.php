<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Add indexes to borrowings table for faster queries
        Schema::table('borrowings', function (Blueprint $table) {
            // Index for status filtering (used in dashboard stats)
            $table->index('status');
            
            // Index for borrow_date sorting and date range queries
            $table->index('borrow_date');
            
            // Composite index for common query pattern: status + date sorting
            $table->index(['status', 'borrow_date']);
        });

        // Add indexes to borrowing_details table
        Schema::table('borrowing_details', function (Blueprint $table) {
            // Composite index for book_id + borrowing_id lookups
            $table->index(['book_id', 'borrowing_id']);
        });

        // Add indexes to books table
        Schema::table('books', function (Blueprint $table) {
            // Index for category filtering
            $table->index('category_id');
            
            // Index for title search
            $table->index('title');
            
            // Index for author search
            $table->index('author');
        });

        // Add indexes to members table
        Schema::table('members', function (Blueprint $table) {
            // Index for member_code lookups
            $table->index('member_code');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('borrowings', function (Blueprint $table) {
            $table->dropIndex(['status']);
            $table->dropIndex(['borrow_date']);
            $table->dropIndex(['status', 'borrow_date']);
        });

        Schema::table('borrowing_details', function (Blueprint $table) {
            $table->dropIndex(['book_id', 'borrowing_id']);
        });

        Schema::table('books', function (Blueprint $table) {
            $table->dropIndex(['category_id']);
            $table->dropIndex(['title']);
            $table->dropIndex(['author']);
        });

        Schema::table('members', function (Blueprint $table) {
            $table->dropIndex(['member_code']);
        });
    }
};
