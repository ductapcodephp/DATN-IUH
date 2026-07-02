import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react'; // ĐẲNG CẤP: Import thêm thằng Link của Inertia

export default function Dashboard() {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        {/* Flexbox để dàn dòng chữ và nút sang 2 bên cho đẹp */}
                        <div className="p-6 text-gray-900 flex justify-between items-center">
                            <span>You're logged in! Chúc mừng mày đã vào được hệ thống!</span>

                            {/* NÚT ĐĂNG XUẤT CHUẨN BẢO MẬT BẮN REQUEST POST */}
                            <Link
                                href="/logout"
                                method="post"
                                as="button"
                                className="inline-flex items-center rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                            >
                                Đăng xuất an toàn
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
