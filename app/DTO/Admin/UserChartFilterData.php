<?php

namespace App\DTO\Admin;

class UserChartFilterData
{
    public function __construct(
        public readonly string $type,
        public readonly ?string $startDate,
        public readonly ?string $endDate
    ) {}

    public static function fromRequest(array $data): self
    {
        $type = $data['type'] ?? null;
        $startDate = $data['start_date'] ?? null;
        $endDate = $data['end_date'] ?? null;

        if (empty($type) && empty($startDate)) {
            $type = 'week';
        }

        return new self(
            $type ?? 'week',
            $startDate,
            $endDate
        );
    }
}
