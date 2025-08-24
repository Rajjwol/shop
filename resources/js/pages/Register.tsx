import { useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/register');
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-500">
            <form
                onSubmit={submit}
                className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 p-8 rounded-2xl shadow-xl w-full max-w-md space-y-6 transition-colors duration-500"
            >
                <h2 className="text-2xl font-bold text-center">Create Account</h2>

                {/* Name Input */}
                <div className="flex flex-col">
                    <input
                        type="text"
                        placeholder="Name"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        className="w-full border border-gray-300 dark:border-gray-600 p-3 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
                    />
                    {errors.name && <span className="text-red-500 text-sm mt-1">{errors.name}</span>}
                </div>

                {/* Email Input */}
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

                {/* Password Input */}
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

                {/* Confirm Password */}
                <div className="flex flex-col">
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        className="w-full border border-gray-300 dark:border-gray-600 p-3 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={processing}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold p-3 rounded-lg shadow-md transition-colors disabled:opacity-50"
                >
                    {processing ? 'Registering...' : 'Register'}
                </button>

                {/* Footer */}
                <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                    Already have an account? <a href="/login" className="text-purple-600 hover:underline">Login</a>
                </p>
            </form>
        </div>
    );
}
