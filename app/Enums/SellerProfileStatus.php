<?php

namespace App\Enums;

enum SellerProfileStatus: string
{
    case PENDING = 'pending';
    case APPROVED = 'approved';
    case REJECTED = 'rejected';
}
