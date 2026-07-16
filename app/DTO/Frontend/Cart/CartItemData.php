<?php

namespace App\DTO\Frontend\Cart;

use App\Models\Course;

readonly class CartItemData
{
    public function __construct(
        public int $userId,
        public int $courseId,
        public float|int $price
    ) {}

    public static function fromCourse(int $userId, Course $course): self
    {
        return new self(
            userId: $userId,
            courseId: $course->id,
            price: $course->price
        );
    }
}
