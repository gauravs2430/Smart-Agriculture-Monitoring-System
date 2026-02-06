import React, { useState } from 'react';
import { User, Lock, Mail, ArrowRight, Leaf } from 'lucide-react';
import axios from 'axios';

const Auth = ({ onLogin }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState('');

    const { name, email, password } = formData;

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const url = isLogin
                ? '/api/auth/login'
                : '/api/auth/register';

            const body = isLogin
                ? { email, password }
                : { name, email, password };

            const res = await axios.post(url, body);

            if (res.data.success) {
                if (!isLogin) {
                    // Registration Successful -> Switch to Login
                    setIsLogin(true);
                    setError('');
                    // alert("Registration Successful! Please login.");
                    setFormData({ name: '', email: '', password: '' });
                } else {
                    // Login Successful
                    // Token is stored in HttpOnly Cookie by server
                    // Pass user data to parent (App.jsx)
                    onLogin(res.data.user);
                }
            }
        } catch (err) {
            console.error("Auth Error:", err);
            if (err.response) {
                setError(err.response.data.msg || `Error: ${err.response.status} ${err.response.statusText}`);
            } else if (err.request) {
                setError('Network Error. Cannot reach server. Check if backend is running.');
            } else {
                setError(err.message);
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-900 to-green-700 flex items-center justify-center p-6 relative overflow-hidden">

            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                <Leaf size={400} className="absolute -top-20 -left-20 animate-pulse text-green-300" />
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-2xl shadow-2xl w-full max-w-md relative z-10">
                <div className="text-center mb-8">
                    <div className="inline-block p-4 rounded-full bg-green-500/20 mb-4 text-green-300">
                        <User size={32} />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-2">
                        {isLogin ? 'Welcome Back' : 'Join AgriSmart'}
                    </h2>
                    <p className="text-green-100">
                        {isLogin ? 'Sign in to access your dashboard' : 'Create an account to start monitoring'}
                    </p>
                </div>

                {error && (
                    <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-3 rounded-lg mb-6 text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={onSubmit} className="space-y-4">
                    {!isLogin && (
                        <div className="relative">
                            <User className="absolute left-3 top-3.5 text-green-200" size={18} />
                            <input
                                type="text"
                                placeholder="Full Name"
                                name="name"
                                value={name}
                                onChange={onChange}
                                required={!isLogin}
                                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 border border-green-500/30 text-white placeholder-green-200 focus:outline-none focus:border-green-400 focus:bg-white/20 transition-all"
                            />
                        </div>
                    )}
                    <div className="relative">
                        <Mail className="absolute left-3 top-3.5 text-green-200" size={18} />
                        <input
                            type="email"
                            placeholder="Email Address"
                            name="email"
                            value={email}
                            onChange={onChange}
                            required
                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 border border-green-500/30 text-white placeholder-green-200 focus:outline-none focus:border-green-400 focus:bg-white/20 transition-all"
                        />
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-3 top-3.5 text-green-200" size={18} />
                        <input
                            type="password"
                            placeholder="Password"
                            name="password"
                            value={password}
                            onChange={onChange}
                            required
                            minLength="6"
                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 border border-green-500/30 text-white placeholder-green-200 focus:outline-none focus:border-green-400 focus:bg-white/20 transition-all"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 bg-green-500 hover:bg-green-400 text-white font-bold rounded-xl shadow-lg hover:shadow-green-500/30 transition-all duration-300 flex items-center justify-center gap-2 mt-2"
                    >
                        {isLogin ? 'Sign In' : 'Create Account'} <ArrowRight size={20} />
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <button
                        onClick={() => { setIsLogin(!isLogin); setError(''); }}
                        className="text-green-200 hover:text-white underline underline-offset-4 text-sm font-medium transition-colors"
                    >
                        {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Auth;
