<?php

namespace Database\Factories;

use App\Models\Member;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Member>
 */
class MemberFactory extends Factory
{
    protected $model = Member::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'member_code' => 'MBR-'.now()->format('Ymd').'-'.Str::upper(Str::random(4)),
            'name' => $this->faker->name(),
            'email' => $this->faker->unique()->safeEmail(),
            'phone' => $this->faker->optional(0.85)->phoneNumber(),
            'address' => $this->faker->optional(0.85)->address(),
            'join_date' => $this->faker->dateTimeBetween('-3 years', 'now')->format('Y-m-d'),
        ];
    }
}
