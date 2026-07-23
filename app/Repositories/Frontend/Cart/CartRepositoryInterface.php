<?php

namespace App\Repositories\Frontend\Cart;

interface CartRepositoryInterface
{
    public function getCartByUserId(int $userId);

    public function findItemInCart(int $cartId, int $courseId);

    public function addItemToCart(int $cartId, int $courseId, float|int $price);

    public function getCartItemById(int $cartItemId);

    public function removeItemFromCart(int $cartItemId);

    public function getCartItemsWithRelations(int $cartId, array $relations = []);

    public function getCouponForCourse(int $courseId);
}
