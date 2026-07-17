<?php

use App\Providers\AppServiceProvider;
use App\Providers\FrontendRepositoryServiceProvider;
use App\Providers\SellerRepositoryServiceProvider;

return [
    AppServiceProvider::class,
    FrontendRepositoryServiceProvider::class,
    SellerRepositoryServiceProvider::class,
];
