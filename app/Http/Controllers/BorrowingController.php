<?php

namespace App\Http\Controllers;

use App\Http\Requests\BorrowingReturnRequest;
use App\Http\Requests\BorrowingStoreRequest;
use App\Models\Book;
use App\Models\Borrowing;
use App\Models\BorrowingDetail;
use App\Models\Category;
use App\Models\Member;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class BorrowingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $status = $request->query('status');
        $memberId = $request->query('member_id');

        $members = Member::query()
            ->orderBy('name')
            ->get(['id', 'name', 'member_code']);

        $borrowings = Borrowing::query()
            ->with(['member:id,name,member_code', 'borrowingDetails.book:id,title,author'])
            ->when($status, fn ($q) => $q->where('status', $status))
            ->when($memberId, fn ($q) => $q->where('member_id', $memberId))
            ->latest('borrow_date')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('borrowings/index', [
            'borrowings' => $borrowings,
            'members' => $members,
            'filters' => [
                'status' => $status,
                'member_id' => $memberId,
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
        $members = Member::query()
            ->orderBy('name')
            ->get(['id', 'name', 'member_code', 'email']);

        $books = Book::query()
            ->with(['category:id,name'])
            ->where('stock', '>', 0)
            ->orderBy('title')
            ->get(['id', 'title', 'author', 'stock', 'category_id']);

        $categories = Category::query()
            ->orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('borrowings/create', [
            'members' => $members,
            'books' => $books,
            'categories' => $categories,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(BorrowingStoreRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        DB::transaction(function () use ($validated) {
            // Create borrowing
            $borrowing = Borrowing::create([
                'member_id' => $validated['member_id'],
                'borrow_date' => $validated['borrow_date'],
                'status' => 'borrowed',
            ]);

            // Create borrowing details and update book stock
            foreach ($validated['books'] as $bookData) {
                $book = Book::findOrFail($bookData['book_id']);
                
                // Check if stock is sufficient
                if ($book->stock < $bookData['quantity']) {
                    throw new \Exception("Insufficient stock for book: {$book->title}. Available: {$book->stock}, Requested: {$bookData['quantity']}");
                }

                // Create borrowing detail
                BorrowingDetail::create([
                    'borrowing_id' => $borrowing->id,
                    'book_id' => $bookData['book_id'],
                    'quantity' => $bookData['quantity'],
                ]);

                // Update book stock
                $book->decrement('stock', $bookData['quantity']);
            }
        });

        return redirect()->route('borrowings.index')
            ->with('success', 'Borrowing created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Borrowing $borrowing): Response
    {
        $borrowing->load([
            'member',
            'borrowingDetails.book.category',
        ]);

        return Inertia::render('borrowings/show', [
            'borrowing' => $borrowing,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Borrowing $borrowing): Response
    {
        // Not used - we use return() method instead
        return redirect()->route('borrowings.show', $borrowing);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Borrowing $borrowing): RedirectResponse
    {
        // Not used - we use return() method instead
        return redirect()->route('borrowings.show', $borrowing);
    }

    /**
     * Process book return.
     */
    public function return(BorrowingReturnRequest $request, Borrowing $borrowing): RedirectResponse
    {
        if ($borrowing->status === 'returned') {
            return redirect()->route('borrowings.show', $borrowing)
                ->with('error', 'This borrowing has already been returned.');
        }

        DB::transaction(function () use ($request, $borrowing) {
            // Update borrowing status
            $borrowing->update([
                'status' => 'returned',
                'return_date' => $request->validated()['return_date'],
            ]);

            // Restore book stock
            foreach ($borrowing->borrowingDetails as $detail) {
                $detail->book->increment('stock', $detail->quantity);
            }
        });

        return redirect()->route('borrowings.show', $borrowing)
            ->with('success', 'Books returned successfully.');
    }

    /**
     * Display borrowing history for a specific member.
     */
    public function history(Request $request, Member $member): Response
    {
        $borrowings = Borrowing::query()
            ->where('member_id', $member->id)
            ->with(['borrowingDetails.book.category'])
            ->latest('borrow_date')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('borrowings/history', [
            'member' => $member,
            'borrowings' => $borrowings,
        ]);
    }

    /**
     * Display dashboard with borrowing statistics.
     */
    public function dashboard(): Response
    {
        $stats = [
            'total_borrowings' => Borrowing::count(),
            'active_borrowings' => Borrowing::where('status', 'borrowed')->count(),
            'returned_borrowings' => Borrowing::where('status', 'returned')->count(),
            'total_books_borrowed' => BorrowingDetail::query()
                ->whereHas('borrowing', fn ($q) => $q->where('status', 'borrowed'))
                ->sum('quantity'),
            'total_members' => Member::count(),
            'active_members' => Member::whereHas('borrowings', fn ($q) => $q->where('status', 'borrowed'))
                ->count(),
            'total_books' => Book::count(),
            'available_books' => Book::sum('stock'),
        ];

        $recentBorrowings = Borrowing::query()
            ->with(['member:id,name,member_code', 'borrowingDetails.book:id,title'])
            ->latest('borrow_date')
            ->take(5)
            ->get();

        $topBorrowedBooks = Book::query()
            ->withSum([
                'borrowingDetails as total_borrowed' => function ($q) {
                    $q->whereHas('borrowing', fn ($q) => $q->where('status', 'returned'));
                },
            ], 'quantity')
            ->orderByDesc('total_borrowed')
            ->take(5)
            ->get(['id', 'title', 'author']);

        // Monthly borrowings data for the last 6 months
        $driver = DB::connection()->getDriverName();
        $monthExpr = match ($driver) {
            'sqlite' => "strftime('%Y-%m', borrow_date)",
            'pgsql' => "to_char(borrow_date, 'YYYY-MM')",
            default => "DATE_FORMAT(borrow_date, '%Y-%m')", // mysql/mariadb
        };

        $monthlyBorrowings = Borrowing::query()
            ->select(
                DB::raw("$monthExpr as month"),
                DB::raw('COUNT(*) as count')
            )
            ->where('borrow_date', '>=', now()->subMonths(5)->startOfMonth())
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        // Fill missing months with 0
        $monthlyData = [];
        for ($i = 5; $i >= 0; $i--) {
            $month = now()->subMonths($i)->format('Y-m');
            $monthName = now()->subMonths($i)->format('M Y');
            $found = $monthlyBorrowings->firstWhere('month', $month);
            $monthlyData[] = [
                'month' => $monthName,
                'borrowings' => $found ? (int) $found->count : 0,
            ];
        }

        // Status distribution
        $statusDistribution = [
            [
                'name' => 'Borrowed',
                'value' => Borrowing::where('status', 'borrowed')->count(),
                'color' => '#3b82f6',
            ],
            [
                'name' => 'Returned',
                'value' => Borrowing::where('status', 'returned')->count(),
                'color' => '#10b981',
            ],
        ];

        // Books borrowed by category (sum of quantities)
        // PostgreSQL does not allow SELECT aliases in HAVING/ORDER BY; use the expression.
        $booksByCategory = Category::query()
            ->select('categories.id', 'categories.name')
            ->selectRaw('COALESCE(SUM(borrowing_details.quantity), 0) as total_borrowed')
            ->leftJoin('books', 'categories.id', '=', 'books.category_id')
            ->leftJoin('borrowing_details', 'books.id', '=', 'borrowing_details.book_id')
            ->leftJoin('borrowings', function ($join) {
                $join->on('borrowing_details.borrowing_id', '=', 'borrowings.id')
                    ->where('borrowings.status', '=', 'returned');
            })
            ->groupBy('categories.id', 'categories.name')
            ->havingRaw('COALESCE(SUM(borrowing_details.quantity), 0) > 0')
            ->orderByRaw('COALESCE(SUM(borrowing_details.quantity), 0) DESC')
            ->take(5)
            ->get()
            ->map(fn ($category) => [
                'name' => $category->name,
                'value' => (int) $category->total_borrowed,
            ]);

        return Inertia::render('borrowings/dashboard', [
            'stats' => $stats,
            'recentBorrowings' => $recentBorrowings,
            'topBorrowedBooks' => $topBorrowedBooks,
            'monthlyBorrowings' => $monthlyData,
            'statusDistribution' => $statusDistribution,
            'booksByCategory' => $booksByCategory,
        ]);
    }
}
