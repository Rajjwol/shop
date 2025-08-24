import { useForm } from '@inertiajs/react';
import { Link } from '@inertiajs/react';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/login');
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-500">
            <form
                onSubmit={submit}
                className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 p-8 rounded-2xl shadow-xl w-full max-w-md space-y-6 transition-colors duration-500"
            >
                <h2 className="text-2xl font-bold text-center">Login</h2>

                <div className="flex flex-col">
                    <input
                        type="email"
                        placeholder="Email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        className="w-full border border-gray-300 dark:border-gray-600 p-3 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
                    />
                    {errors.email && <span className="text-red-500 text-sm mt-1">{errors.email}</span>}
                </div>

                <div className="flex flex-col">
                    <input
                        type="password"
                        placeholder="Password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        className="w-full border border-gray-300 dark:border-gray-600 p-3 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
                    />
                    {errors.password && <span className="text-red-500 text-sm mt-1">{errors.password}</span>}
                </div>

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

                <button
                    type="submit"
                    disabled={processing}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold p-3 rounded-lg shadow-md transition-colors disabled:opacity-50"
                >
                    {processing ? 'Logging in...' : 'Login'}
                </button>

                {/* Register Button */}
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
