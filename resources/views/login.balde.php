<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Đăng Nhập Hệ Thống</title>
    <!-- Nhúng Tailwind CSS để giao diện đẹp luôn mà không cần viết file CSS riêng -->
    <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
</head>
<body class="bg-gray-100 flex items-center justify-center min-h-screen">

    <div class="bg-white p-8 rounded-2xl shadow-md w-full max-w-md transition-all duration-300 hover:shadow-lg">
        <!-- Tiêu đề -->
        <div class="text-center mb-8">
            <h2 class="text-3xl font-bold text-gray-800">Chào mừng trở lại</h2>
            <p class="text-gray-500 mt-2 text-sm">Vui lòng đăng nhập vào tài khoản của bạn</p>
        </div>

        <!-- Form Đăng Nhập -->
        <form action="#" method="POST" class="space-y-6">
            <!-- Email Input -->
            <div>
                <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Địa chỉ Email</label>
                <input type="email" id="email" name="email" required autocomplete="email"
                    class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all"
                    placeholder="name@company.com">
            </div>

            <!-- Password Input -->
            <div>
                <div class="flex justify-between items-center mb-1">
                    <label for="password" class="block text-sm font-medium text-gray-700">Mật khẩu</label>
                    <a href="#" class="text-sm font-medium text-blue-600 hover:underline">Quên mật khẩu?</a>
                </div>
                <input type="password" id="password" name="password" required autocomplete="current-password"
                    class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all"
                    placeholder="••••••••">
            </div>

            <!-- Ghi nhớ đăng nhập -->
            <div class="flex items-center">
                <input id="remember" name="remember" type="checkbox"
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
                <label for="remember" class="ml-2 block text-sm text-gray-700 select-none">
                    Ghi nhớ đăng nhập
                </label>
            </div>

            <!-- Nút Đăng Nhập -->
            <button type="submit"
                class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                Đăng nhập
            </button>
        </form>

        <!-- Chuyển sang Đăng ký -->
        <div class="text-center mt-6">
            <p class="text-sm text-gray-600">
                Chưa có tài khoản? 
                <a href="#" class="font-medium text-blue-600 hover:underline">Đăng ký ngay</a>
            </p>
        </div>
    </div>

</body>
</html>