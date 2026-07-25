<?php

namespace App\DTO\Shared;

use Illuminate\Http\Request;

readonly class NotificationFilterData
{
    public function __construct(
        public ?string $startDate = null,
        public ?string $endDate = null,
        public ?string $type = null
    ) {}

    public static function fromRequest(Request $request): self
    {
        return new self(
            $request->input('start_date'),
            $request->input('end_date'),
            $request->input('type')
        );
    }
}
