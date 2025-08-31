export default function Footer() {
    return (
 <footer className="w-full border-t border-gray-700 bg-gray-900 text-gray-400">
            <div className="mx-auto flex max-w-7xl flex-col items-center justify-between px-4 py-6 md:flex-row">
                <div className="text-lg font-bold text-purple-600">MyStore</div>

                <div className="mt-2 flex space-x-4 md:mt-0">
                    <a href="/" className="hover:text-purple-400">Home</a>
                    <a href="/products" className="hover:text-purple-400">Products</a>
                    <a href="/about" className="hover:text-purple-400">About</a>
                    <a href="/contact" className="hover:text-purple-400">Contact</a>
                </div>

                <div className="mt-2 text-sm md:mt-0">
                    &copy; {new Date().getFullYear()} MyStore. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
