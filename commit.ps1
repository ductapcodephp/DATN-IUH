$ErrorActionPreference = "SilentlyContinue"

git add app/Console/Commands/ReleaseSellerEarnings.php app/Http/Controllers/Finance/ app/Models/SystemWallet.php app/Models/SystemWalletTransaction.php app/Models/WalletBonus.php app/Repositories/Finance/ app/Services/Finance/ database/migrations/*wallet*.php database/migrations/*wallet_transactions*.php database/migrations/*wallet_bonuses*.php database/migrations/2026_07_20_182619_add_balance_pending_available_to_wallets_table.php database/migrations/2026_07_20_182634_add_order_id_and_earning_type_to_wallet_transactions_table.php database/migrations/2026_07_21_102226_add_status_to_wallets_table.php database/migrations/2026_07_20_193542_create_system_wallets_table.php database/migrations/2026_07_20_195222_create_system_wallet_transactions_table.php database/migrations/2026_07_21_103500_create_wallet_bonuses_table.php database/migrations/2026_07_21_111834_add_max_bonus_amount_to_wallet_bonuses_table.php app/Services/Payment/ resources/js/Pages/Frontend/Dashboard/BankAccounts/ resources/js/Pages/Frontend/Dashboard/Wallet/ resources/js/Pages/Frontend/Dashboard/BankAccounts.jsx resources/js/Pages/Frontend/Dashboard/Wallet.jsx resources/js/Pages/Seller/BankAccounts/ resources/js/Pages/Seller/Wallet/ resources/js/Pages/Seller/Revenues.jsx .agents/workflow/refund_and_earning.md
git commit -m "feat: finance and wallet system"

git add app/Http/Controllers/Frontend/CommentController.php app/Repositories/Frontend/Comments/ app/Services/Frontend/CommentService.php database/migrations/2026_07_21_183400_add_nestedset_to_comments_table.php database/seeders/CommentSeeder.php resources/js/Pages/Frontend/Course/Components/CommentsPanel.jsx
git commit -m "feat: course comments system"

git add app/Http/Controllers/Seller/VipPackageController.php database/seeders/VipPackagesTableSeeder.php resources/js/Pages/Seller/VipPackages/
git commit -m "feat: seller VIP packages"

git add app/Services/Seller/ resources/js/Pages/Seller/Courses/ resources/js/Pages/Seller/Curriculum/ resources/js/Pages/Seller/Coupons/ resources/js/Pages/Seller/Students/ public/assets/seller/ resources/js/Pages/Seller/
git commit -m "feat: seller curriculum and course management"

git add resources/js/Pages/Frontend/ resources/js/Components/ resources/js/Layouts/ resources/css/ resources/views/
git commit -m "style: frontend UI and layouts"

git add .
git commit -m "chore: update routes, auth, and core files"

git push origin HEAD
