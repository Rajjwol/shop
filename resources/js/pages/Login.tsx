import { useForm, Link } from '@inertiajs/react';
import React from 'react';

export default function Login() {
    // Initialize form state
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    // Handle form submit
    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!data.email || !data.password) {
            console.log('Please fill in both email and password.');
            return;
        }

        post('/login', {
            onStart: () => console.log('Submitting login form...'),
            onSuccess: (response: any) => {
                const user = response.props?.auth?.user;

                if (!user) {
                    console.log('No user info returned from server.');
                    return;
                }

                // Role-based redirect
                if (user.role === 'admin') {
                    window.location.href = '/admin/dashboard';
                } else {
                      window.location.href = '/';
                }
            },
            onError: (errs) => {
                console.log('Validation errors:', errs);
            },
            onFinish: () => console.log('Login request finished.'),
        });
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-500">
            <form
                onSubmit={submit}
                className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 p-8 rounded-2xl shadow-xl w-full max-w-md space-y-6 transition-colors duration-500"
            >
                <h2 className="text-2xl font-bold text-center">Login</h2>

                {/* Email input */}
                <div className="flex flex-col">
                    <input
                        type="email"
                        placeholder="Email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        className="w-full border border-gray-300 dark:border-gray-600 p-3 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
                        required
                    />
                    {errors.email && (
                        <span className="text-red-500 text-sm mt-1">{errors.email}</span>
                    )}
                </div>

                {/* Password input */}
                <div className="flex flex-col">
                    <input
                        type="password"
                        placeholder="Password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        className="w-full border border-gray-300 dark:border-gray-600 p-3 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
                        required
                    />
                    {errors.password && (
                        <span className="text-red-500 text-sm mt-1">{errors.password}</span>
                    )}
                </div>

                {/* Remember & Forgot */}
                <div className="flex items-center justify-between">
                    <label className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                            className="accent-purple-600"
                        />
                        <span>Remember me</span>
                    </label>
                    <Link href="/forgot-password" className="text-purple-600 hover:underline">
                        Forgot password?
                    </Link>
                </div>

                {/* Submit button */}
                <button
                    type="submit"
                    disabled={processing}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold p-3 rounded-lg shadow-md transition-colors disabled:opacity-50"
                >
                    {processing ? 'Logging in...' : 'Login'}
                </button>

                {/* Register link */}
                <div className="text-center">
                    <span className="text-gray-600 dark:text-gray-400">Don't have an account? </span>
                    <Link
                        href="/register"
                        className="text-purple-600 hover:underline font-semibold"
                    >
                        Register
                    </Link>
                </div>
            </form>
        </div>
    );
}
