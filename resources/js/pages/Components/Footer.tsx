

export default function Footer() {
    return (
        <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 mt-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row justify-between items-center">
                {/* Logo / Brand */}
                <div className="text-purple-600 dark:text-purple-400 font-bold text-lg">
                    MyStore
                </div>

                {/* Navigation Links */}
                <div className="flex space-x-4 mt-4 md:mt-0 text-gray-600 dark:text-gray-300">
                    <a href="/" className="hover:text-purple-600 dark:hover:text-purple-400">Home</a>
                    <a href="/products" className="hover:text-purple-600 dark:hover:text-purple-400">Products</a>
                    <a href="/about" className="hover:text-purple-600 dark:hover:text-purple-400">About</a>
                    <a href="/contact" className="hover:text-purple-600 dark:hover:text-purple-400">Contact</a>
                </div>

                {/* Copyright */}
                <div className="text-gray-400 dark:text-gray-500 mt-4 md:mt-0 text-sm">
                    &copy; {new Date().getFullYear()} MyStore. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
