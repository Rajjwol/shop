
import Footer from '@/pages/Components/Footer';
import Header from '@/pages/Components/Header';

import { type ReactNode } from 'react';

// interface AppLayoutProps {
//     children: ReactNode;
//     breadcrumbs?: BreadcrumbItem[];
// }

// export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => (
//     <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
//         {children}
//     </AppLayoutTemplate>
// );
interface AppLayoutProps {
    children: ReactNode;

}

export default function AppLayout({ children }: AppLayoutProps) {
    return (
         <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-black pt-5">
            <Header />

            {/* Main grows to push footer down */}
            <main className="max-w-7xl mx-auto flex-1 px-4 sm:px-6 lg:px-8 py-6">
                {children}
            </main>

            <Footer />
        </div>
    );
}
