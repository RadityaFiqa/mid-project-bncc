<?php

namespace Database\Seeders;

use App\Models\Book;
use App\Models\Borrowing;
use App\Models\Category;
use App\Models\Member;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class LargeDatasetSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Tune these if needed (SQLite will take longer for 100k+ inserts)
        $categoriesCount = 200;
        $membersCount = 2000;
        $booksCount = 20000;
        $borrowingsCount = 100000;

        DB::disableQueryLog();
        $driver = DB::connection()->getDriverName();

        // Use Indonesian-ish locale (realistic names/addresses)
        $faker = \Faker\Factory::create('id_ID');
        $faker->seed(2026);

        $now = now();

        // -------- Categories (200)
        $this->command?->info("Seeding {$categoriesCount} categories...");
        Category::query()->truncate();
        $categoryRows = [];
        for ($i = 0; $i < $categoriesCount; $i++) {
            $categoryRows[] = [
                'name' => Str::title($faker->unique()->words(rand(1, 3), true)),
                'description' => $faker->optional(0.7)->paragraph(),
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }
        DB::table('categories')->insert($categoryRows);
        $categoryIds = DB::table('categories')->pluck('id')->all();

        // -------- Members (2,000)
        $this->command?->info("Seeding {$membersCount} members...");
        Member::query()->truncate();
        $memberRows = [];
        for ($i = 1; $i <= $membersCount; $i++) {
            $joinDate = $faker->dateTimeBetween('-3 years', 'now')->format('Y-m-d');
            $memberRows[] = [
                'member_code' => 'MBR-'.now()->format('Y').'-'.str_pad((string) $i, 6, '0', STR_PAD_LEFT),
                'name' => $faker->name(),
                'email' => $faker->unique()->safeEmail(),
                'phone' => $faker->optional(0.85)->phoneNumber(),
                'address' => $faker->optional(0.9)->address(),
                'join_date' => $joinDate,
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }
        DB::table('members')->insert($memberRows);
        $memberIds = DB::table('members')->pluck('id')->all();

        // -------- Books (20,000)
        $this->command?->info("Seeding {$booksCount} books...");
        Book::query()->truncate();
        $bookRows = [];
        $bookStocks = []; // id => stock (we’ll fill after insert)

        // Generate in chunks to keep memory stable
        $bookChunk = 2000;
        $created = 0;
        $faker->unique(true); // reset unique state to avoid memory blow from earlier uniques
        while ($created < $booksCount) {
            $batch = min($bookChunk, $booksCount - $created);
            $rows = [];
            for ($i = 0; $i < $batch; $i++) {
                $rows[] = [
                    'category_id' => $categoryIds[array_rand($categoryIds)],
                    'title' => $faker->sentence(rand(2, 5)),
                    'author' => $faker->name(),
                    'isbn' => $faker->unique()->isbn13(),
                    'publisher' => $faker->optional(0.8)->company(),
                    'publication_year' => $faker->optional(0.9)->numberBetween(1990, (int) $now->format('Y')),
                    // Start with decent stock so active borrowings feel realistic
                    'stock' => $faker->numberBetween(20, 150),
                    'cover_image' => null,
                    'description' => $faker->optional(0.7)->paragraphs(2, true),
                    'created_at' => $now,
                    'updated_at' => $now,
                ];
            }
            DB::table('books')->insert($rows);
            $created += $batch;
            $this->command?->info("  - books inserted: {$created}/{$booksCount}");
        }

        // Load book ids and stocks into memory (20k rows is OK)
        $books = DB::table('books')->select('id', 'stock')->get();
        $bookIds = [];
        foreach ($books as $b) {
            $bookIds[] = (int) $b->id;
            $bookStocks[(int) $b->id] = (int) $b->stock;
        }

        // -------- Borrowings (100,000) + Borrowing Details
        $this->command?->info("Seeding {$borrowingsCount} borrowings + details...");
        DB::table('borrowing_details')->truncate();
        Borrowing::query()->truncate();

        // Keep chunks small to avoid memory spikes (especially on SQLite / Windows)
        $borrowingChunk = 200;
        $detailInsertChunk = 500;
        $detailsBuffer = [];

        $borrowingsCreated = 0;
        while ($borrowingsCreated < $borrowingsCount) {
            $batch = min($borrowingChunk, $borrowingsCount - $borrowingsCreated);
            $rows = [];

            // create borrowing rows
            for ($i = 0; $i < $batch; $i++) {
                $status = $faker->boolean(70) ? 'returned' : 'borrowed';
                $borrowDate = $faker->dateTimeBetween('-18 months', 'now');
                $returnDate = null;
                if ($status === 'returned') {
                    $returnDate = (clone $borrowDate);
                    $returnDate->modify('+'.rand(1, 30).' days');
                    if ($returnDate > $now) {
                        $returnDate = clone $now;
                    }
                }

                $rows[] = [
                    'member_id' => $memberIds[array_rand($memberIds)],
                    'borrow_date' => $borrowDate->format('Y-m-d'),
                    'return_date' => $returnDate ? $returnDate->format('Y-m-d') : null,
                    'status' => $status,
                    'created_at' => $now,
                    'updated_at' => $now,
                ];
            }

            // Insert borrowings in one go
            DB::table('borrowings')->insert($rows);

            // Determine inserted ID range (driver-specific)
            $pdoLastId = (int) DB::getPdo()->lastInsertId();
            $firstId = $driver === 'sqlite'
                ? ($pdoLastId - $batch + 1)
                : $pdoLastId; // mysql returns first id for multi-row insert

            // Build details referencing those ids
            for ($offset = 0; $offset < $batch; $offset++) {
                $borrowingId = $firstId + $offset;
                $status = $rows[$offset]['status'];

                $items = rand(1, 3);
                $picked = [];
                for ($k = 0; $k < $items; $k++) {
                    // pick unique book per borrowing
                    $bookId = $bookIds[array_rand($bookIds)];
                    while (isset($picked[$bookId])) {
                        $bookId = $bookIds[array_rand($bookIds)];
                    }
                    $picked[$bookId] = true;

                    $qty = rand(1, 2);

                    // If active borrowing, keep stock realistic by decrementing in-memory
                    if ($status === 'borrowed') {
                        if (($bookStocks[$bookId] ?? 0) < $qty) {
                            // if insufficient, skip this book and try another
                            $k--;
                            unset($picked[$bookId]);
                            continue;
                        }
                        $bookStocks[$bookId] -= $qty;
                    }

                    $detailsBuffer[] = [
                        'borrowing_id' => $borrowingId,
                        'book_id' => $bookId,
                        'quantity' => $qty,
                        'created_at' => $now,
                        'updated_at' => $now,
                    ];
                }
            }

            // Flush details buffer
            if (count($detailsBuffer) >= $detailInsertChunk) {
                DB::table('borrowing_details')->insert($detailsBuffer);
                $detailsBuffer = [];
            }

            $borrowingsCreated += $batch;
            $this->command?->info("  - borrowings inserted: {$borrowingsCreated}/{$borrowingsCount}");
        }

        if (!empty($detailsBuffer)) {
            DB::table('borrowing_details')->insert($detailsBuffer);
        }

        // Persist adjusted stocks for currently borrowed items (in chunks via CASE)
        $this->command?->info("Updating book stocks (reflecting active borrowings)...");
        $updateChunk = 500;
        $bookIdList = array_keys($bookStocks);
        for ($i = 0; $i < count($bookIdList); $i += $updateChunk) {
            $ids = array_slice($bookIdList, $i, $updateChunk);

            $caseSql = 'CASE id ';
            $bindings = [];
            foreach ($ids as $id) {
                $caseSql .= 'WHEN ? THEN ? ';
                $bindings[] = $id;
                $bindings[] = max(0, (int) $bookStocks[$id]);
            }
            $caseSql .= 'END';

            $placeholders = implode(',', array_fill(0, count($ids), '?'));
            $bindings = array_merge($bindings, $ids);

            DB::update(
                "UPDATE books SET stock = {$caseSql}, updated_at = ? WHERE id IN ({$placeholders})",
                array_merge($bindings, [$now])
            );
        }

        $this->command?->info('Large dataset seeding completed.');
    }
}
