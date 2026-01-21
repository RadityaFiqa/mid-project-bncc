<?php

namespace App\Http\Controllers;

use App\Http\Requests\BookStoreRequest;
use App\Http\Requests\BookUpdateRequest;
use App\Models\Book;
use App\Models\BorrowingDetail;
use App\Models\Category;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class BookController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $search = (string) $request->query('q', '');
        $categoryId = $request->query('category_id');

        $categories = Category::query()
            ->orderBy('name')
            ->get(['id', 'name']);

        $books = Book::query()
            ->with(['category:id,name'])
            ->when($categoryId, fn ($q) => $q->where('category_id', $categoryId))
            ->when($search !== '', function ($q) use ($search) {
                $q->where(function ($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%")
                        ->orWhere('author', 'like', "%{$search}%");
                });
            })
            ->withExists([
                'borrowingDetails as is_borrowed' => function ($q) {
                    $q->whereHas('borrowing', fn ($q) => $q->where('status', 'borrowed'));
                },
            ])
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('books/index', [
            'books' => $books,
            'categories' => $categories,
            'filters' => [
                'q' => $search,
                'category_id' => $categoryId,
            ],
            'success' => $request->session()->get('success'),
            'error' => $request->session()->get('error'),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        $categories = Category::query()
            ->orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('books/create', [
            'categories' => $categories,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(BookStoreRequest $request): RedirectResponse
    {
        $data = $request->validated();

        if ($request->hasFile('cover_image')) {
            $data['cover_image'] = $request->file('cover_image')->store('covers', 'public');
        }

        Book::create($data);

        return redirect()->route('books.index')
            ->with('success', 'Book created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Book $book): Response
    {
        $book->load(['category:id,name']);
        $isBorrowed = BorrowingDetail::query()
            ->where('book_id', $book->id)
            ->whereHas('borrowing', fn ($q) => $q->where('status', 'borrowed'))
            ->exists();

        return Inertia::render('books/show', [
            'book' => $book,
            'isBorrowed' => $isBorrowed,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Book $book): Response
    {
        $categories = Category::query()
            ->orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('books/edit', [
            'book' => $book->load('category:id,name'),
            'categories' => $categories,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(BookUpdateRequest $request, Book $book): RedirectResponse
    {
        $data = $request->validated();

        if ($request->hasFile('cover_image')) {
            if ($book->cover_image) {
                Storage::disk('public')->delete($book->cover_image);
            }
            $data['cover_image'] = $request->file('cover_image')->store('covers', 'public');
        }

        $book->update($data);

        return redirect()->route('books.index')
            ->with('success', 'Book updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Book $book): RedirectResponse
    {
        $isBorrowed = BorrowingDetail::query()
            ->where('book_id', $book->id)
            ->whereHas('borrowing', fn ($q) => $q->where('status', 'borrowed'))
            ->exists();

        if ($isBorrowed) {
            return redirect()->route('books.index')
                ->with('error', 'Cannot delete book that is currently borrowed.');
        }

        if ($book->cover_image) {
            Storage::disk('public')->delete($book->cover_image);
        }

        $book->delete();

        return redirect()->route('books.index')
            ->with('success', 'Book deleted successfully.');
    }
}
