import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, MessageSquare, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import clsx from 'clsx';
import { useAuth } from '../lib/AuthContext';

export default function Layout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const location = useLocation();
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Failed to log out', error);
        }
    };

    const navigation = [
        { name: 'Atölye Yönetimi', href: '/', icon: LayoutDashboard },
        { name: 'Sipariş Oluşturma', href: '/orders', icon: ShoppingCart },
        { name: 'Mesaj Şablonları', href: '/templates', icon: MessageSquare },
    ];

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Mobile sidebar backdrop */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={clsx(
                "fixed inset-y-0 left-0 z-50 w-64 bg-primary transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0",
                isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between h-16 px-4 bg-primary-light">
                        <span className="text-xl font-bold text-white">Dinçer Kuyumculuk</span>
                        <button
                            className="md:hidden text-white hover:text-gray-200"
                            onClick={() => setIsSidebarOpen(false)}
                        >
                            <X size={24} />
                        </button>
                    </div>

                    <nav className="flex-1 px-2 py-4 space-y-1">
                        {navigation.map((item) => {
                            const isActive = location.pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    className={clsx(
                                        "flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors",
                                        isActive
                                            ? "bg-primary-light text-white"
                                            : "text-gray-300 hover:bg-primary-light hover:text-white"
                                    )}
                                    onClick={() => setIsSidebarOpen(false)}
                                >
                                    <item.icon className="mr-3 h-5 w-5" />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="p-4 border-t border-primary-light">
                        <button
                            onClick={handleLogout}
                            className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
                        >
                            <LogOut className="mr-3 h-5 w-5" />
                            Çıkış Yap
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="flex items-center justify-between h-16 px-4 bg-white shadow-sm md:hidden">
                    <button
                        className="text-gray-500 hover:text-gray-700 focus:outline-none"
                        onClick={() => setIsSidebarOpen(true)}
                    >
                        <Menu size={24} />
                    </button>
                    <span className="text-lg font-semibold text-gray-900">Dinçer Kuyumculuk</span>
                    <div className="w-6" /> {/* Spacer for centering */}
                </header>

                <main className="flex-1 overflow-auto p-4 md:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
