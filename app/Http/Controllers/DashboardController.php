<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\Borrowing;
use App\Models\BorrowingDetail;
use App\Models\Category;
use App\Models\Member;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Cache key for dashboard data.
     */
    private const CACHE_KEY = 'dashboard_data';

    /**
     * Cache TTL in seconds (5 minutes).
     */
    private const CACHE_TTL = 300;

    /**
     * Display the main dashboard.
     */
    public function index(Request $request): Response
    {
        $data = Cache::remember(self::CACHE_KEY, self::CACHE_TTL, function () {
            return $this->getDashboardData();
        });

        $data['success'] = $request->session()->get('success');

        return Inertia::render('dashboard', $data);
    }

    /**
     * Refresh the dashboard cache.
     */
    public function refreshCache(): void
    {
        Cache::forget(self::CACHE_KEY);
        Cache::remember(self::CACHE_KEY, self::CACHE_TTL, function () {
            return $this->getDashboardData();
        });
    }

    /**
     * Get dashboard data from database.
     */
    private function getDashboardData(): array
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
            'total_categories' => Category::count(),
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

        return [
            'stats' => $stats,
            'recentBorrowings' => $recentBorrowings,
            'topBorrowedBooks' => $topBorrowedBooks,
            'monthlyBorrowings' => $monthlyData,
            'statusDistribution' => $statusDistribution,
            'booksByCategory' => $booksByCategory,
            'last_updated' => now()->toIso8601String(),
        ];
    }

    /**
     * Refresh dashboard cache and redirect back.
     */
    public function refresh(Request $request): \Illuminate\Http\RedirectResponse
    {
        $this->refreshCache();

        return redirect()->route('dashboard')->with('success', 'Dashboard data refreshed.');
    }
}
