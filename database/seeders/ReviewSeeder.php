<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Course;
use App\Models\User;
use App\Models\Review;
use Faker\Factory as Faker;

class ReviewSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $courses = Course::all();
        $users = User::where('current_role', 'student')->inRandomOrder()->limit(50)->get();

        if ($users->isEmpty()) {
            $users = User::inRandomOrder()->limit(50)->get();
        }

        $faker = Faker::create('vi_VN');

        $count = 0;
        foreach ($courses as $course) {
            $numReviews = rand(3, 10);
            $selectedUsers = $users->random(min($numReviews, $users->count()));
            
            foreach ($selectedUsers as $user) {
                // Tạo hoặc lấy order giả để có order_id
                $order = \App\Models\Order::firstOrCreate(
                    ['user_id' => $user->id, 'course_id' => $course->id],
                    [
                        'amount_original' => $course->price ?? 0,
                        'amount_paid' => $course->price ?? 0,
                        'commission_rate' => 20,
                        'status' => 'completed',
                        'payment_method' => 'wallet'
                    ]
                );

                Review::updateOrCreate(
                    ['user_id' => $user->id, 'course_id' => $course->id],
                    [
                        'order_id' => $order->id,
                        'rating' => rand(3, 5),
                        'content' => $faker->realText(100),
                        'created_at' => now()->subDays(rand(1, 30)),
                        'updated_at' => now()->subDays(rand(1, 30)),
                    ]
                );
                $count++;
            }
        }
        
        $this->command->info("Created {$count} reviews successfully!");
    }
}
