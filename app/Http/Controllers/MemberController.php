<?php

namespace App\Http\Controllers;

use App\Http\Requests\MemberStoreRequest;
use App\Http\Requests\MemberUpdateRequest;
use App\Models\Borrowing;
use App\Models\Member;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class MemberController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $members = Member::query()
            ->withCount([
                'borrowings as active_borrowings_count' => fn ($q) => $q->where('status', 'borrowed'),
            ])
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('members/index', [
            'members' => $members,
            'success' => $request->session()->get('success'),
            'error' => $request->session()->get('error'),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('members/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(MemberStoreRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $data['join_date'] = $data['join_date'] ?? now()->toDateString();
        $data['member_code'] = $this->generateMemberCode();

        Member::create($data);

        return redirect()->route('members.index')
            ->with('success', 'Member registered successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Member $member): Response
    {
        $activeBorrowings = Borrowing::query()
            ->where('member_id', $member->id)
            ->where('status', 'borrowed')
            ->count();

        return Inertia::render('members/show', [
            'member' => $member,
            'activeBorrowingsCount' => $activeBorrowings,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Member $member): Response
    {
        return Inertia::render('members/edit', [
            'member' => $member,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(MemberUpdateRequest $request, Member $member): RedirectResponse
    {
        $data = $request->validated();
        $data['join_date'] = $data['join_date'] ?? $member->join_date?->toDateString();

        $member->update($data);

        return redirect()->route('members.index')
            ->with('success', 'Member updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Member $member): RedirectResponse
    {
        $activeBorrowings = Borrowing::query()
            ->where('member_id', $member->id)
            ->where('status', 'borrowed')
            ->count();

        if ($activeBorrowings > 0) {
            return redirect()->route('members.index')
                ->with('error', "Cannot delete member who still has {$activeBorrowings} active borrowing(s).");
        }

        $member->delete();

        return redirect()->route('members.index')
            ->with('success', 'Member deleted successfully.');
    }

    private function generateMemberCode(): string
    {
        do {
            $code = 'MBR-'.now()->format('Ymd').'-'.Str::upper(Str::random(4));
        } while (Member::where('member_code', $code)->exists());

        return $code;
    }
}
