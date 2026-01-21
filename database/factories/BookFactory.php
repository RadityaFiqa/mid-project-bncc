<?php

namespace Database\Factories;

use App\Models\Book;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Book>
 */
class BookFactory extends Factory
{
    protected $model = Book::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'category_id' => 1,
            'title' => $this->faker->sentence(3),
            'author' => $this->faker->name(),
            'isbn' => $this->faker->unique()->isbn13(),
            'publisher' => $this->faker->optional(0.8)->company(),
            'publication_year' => (int) $this->faker->numberBetween(1990, (int) now()->format('Y')),
            'stock' => $this->faker->numberBetween(10, 120),
            'cover_image' => null,
            'description' => $this->faker->optional(0.7)->paragraphs(2, true),
        ];
    }
}
