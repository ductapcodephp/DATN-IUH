<?php

namespace App\DTO\Seller;

use Illuminate\Http\Request;

readonly class SellerProfileData
{
    public function __construct(
        public int $user_id,
        public string $headline,
        public string $bio,
        public ?string $website,
        public ?string $tax_number,
        public string $bank_name,
        public string $bank_account_number,
        public string $bank_account_name,
        public mixed $identity_card_front,
        public mixed $identity_card_back
    ) {}

    public static function fromRequest(Request $request): self
    {
        return new self(
            user_id: $request->user()->id,
            headline: $request->input('headline'),
            bio: $request->input('bio'),
            website: $request->input('website'),
            tax_number: $request->input('tax_number'),
            bank_name: $request->input('bank_name'),
            bank_account_number: $request->input('bank_account_number'),
            bank_account_name: $request->input('bank_account_name'),
            identity_card_front: $request->file('identity_card_front'),
            identity_card_back: $request->file('identity_card_back')
        );
    }

    public function toArray(): array
    {
        return [
            'user_id' => $this->user_id,
            'headline' => $this->headline,
            'bio' => $this->bio,
            'website' => $this->website,
            'tax_number' => $this->tax_number,
        ];
    }
}
