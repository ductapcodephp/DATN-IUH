import { Link } from '@inertiajs/react';

export default function ResponsiveNavLink({
    active = false,
    className = '',
    children,
    ...props
}) {
    return (
        <Link
            {...props}
            className={`tw-flex tw-w-full tw-items-start tw-border-l-4 tw-py-2 tw-pe-4 tw-ps-3 ${
                active
                    ? 'tw-border-indigo-400 tw-bg-indigo-50 tw-text-indigo-700 focus:tw-border-indigo-700 focus:tw-bg-indigo-100 focus:tw-text-indigo-800'
                    : 'tw-border-transparent tw-text-gray-600 hover:tw-border-gray-300 hover:tw-bg-gray-50 hover:tw-text-gray-800 focus:tw-border-gray-300 focus:tw-bg-gray-50 focus:tw-text-gray-800'
            } tw-text-base tw-font-medium tw-transition tw-duration-150 tw-ease-in-out focus:tw-outline-none ${className}`}
        >
            {children}
        </Link>
    );
}
