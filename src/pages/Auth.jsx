import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../lib/AuthContext';

export default function Auth() {
    const [isLogin, setIsLogin] = useState(true);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login, signup } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const formData = new FormData(e.target);
        const email = formData.get('email');
        const password = formData.get('password');
        const name = formData.get('name');

        try {
            if (isLogin) {
                await login(email, password);
            } else {
                await signup(email, password, name);
            }
            navigate('/');
        } catch (err) {
            console.error(err);
            setError(
                err.code === 'auth/invalid-credential' ? 'E-posta veya şifre hatalı.' :
                    err.code === 'auth/email-already-in-use' ? 'Bu e-posta adresi zaten kullanımda.' :
                        'Giriş yapılırken bir hata oluştu. Lütfen tekrar deneyin.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute -top-[20%] -right-[10%] w-[70%] h-[70%] rounded-full bg-secondary/20 blur-3xl opacity-50" />
                <div className="absolute -bottom-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-primary/10 blur-3xl opacity-50" />
            </div>

            <div className="max-w-md w-full space-y-8 z-10">
                <div className="text-center">
                    <motion.h2
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="mt-6 text-4xl font-extrabold text-gray-900 tracking-tight"
                    >
                        Dinçer Kuyumculuk
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="mt-2 text-sm text-gray-600"
                    >
                        {isLogin ? 'Hesabınıza giriş yapın' : 'Yeni bir hesap oluşturun'}
                    </motion.p>
                </div>

                <motion.div
                    className="bg-white py-8 px-4 shadow-xl rounded-2xl sm:px-10 border border-gray-100 backdrop-blur-sm bg-opacity-90"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100">
                            {error}
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <AnimatePresence mode="wait">
                            {!isLogin && (
                                <motion.div
                                    key="name-field"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                        Ad Soyad
                                    </label>
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <User className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            id="name"
                                            name="name"
                                            type="text"
                                            required={!isLogin}
                                            className="focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-gray-300 rounded-lg p-2.5 transition-colors"
                                            placeholder="Adınız Soyadınız"
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                E-posta Adresi
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-gray-300 rounded-lg p-2.5 transition-colors"
                                    placeholder="ornek@email.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Şifre
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    className="focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-gray-300 rounded-lg p-2.5 transition-colors"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {isLogin && (
                            <div className="flex items-center justify-end">
                                <div className="text-sm">
                                    <a href="#" className="font-medium text-primary hover:text-primary-light transition-colors">
                                        Şifrenizi mi unuttunuz?
                                    </a>
                                </div>
                            </div>
                        )}

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-primary/30 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                                    {loading ? (
                                        <Loader2 className="h-5 w-5 text-primary-light animate-spin" />
                                    ) : (
                                        <ArrowRight className="h-5 w-5 text-primary-light group-hover:text-white transition-colors" />
                                    )}
                                </span>
                                {loading ? 'İşlem yapılıyor...' : isLogin ? 'Giriş Yap' : 'Kayıt Ol'}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">
                                    {isLogin ? 'Hesabınız yok mu?' : 'Zaten hesabınız var mı?'}
                                </span>
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-1 gap-3">
                            <button
                                onClick={() => { setIsLogin(!isLogin); setError(''); }}
                                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
                            >
                                {isLogin ? 'Yeni Hesap Oluştur' : 'Giriş Yap'}
                            </button>
                        </div>
                    </div>
                </motion.div>

                <div className="text-center text-xs text-gray-400">
                    &copy; 2026 Dinçer Kuyumculuk. Tüm hakları saklıdır.
                </div>
            </div>
        </div>
    );
}
