import { useState } from 'react';
import { motion } from 'framer-motion';
import { ErrorAlert } from '../../components/ErrorAlert';
import { register, login } from '../../services/api';

interface LoginPageProps {
  onLogin: () => void;
}

export const LoginPage = ({ onLogin }: LoginPageProps) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleRegister = async () => {
    try {
      await register(email, password);
      alert('Registered successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    }
  };

  const handleLogin = async () => {
    try {
      const { token } = await login(email, password);
      localStorage.setItem('token', token);
      localStorage.setItem('userEmail', email);
      onLogin();
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    }
  };

  return (
    <div className="flex items-center justify-center p-4 min-h-screen">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md space-y-6"
      >
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            MorphoConseil
          </h1>
          <p className="text-gray-600 mt-2">Découvrez votre type morphologique</p>
        </motion.div>

        <ErrorAlert message={error} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
              placeholder="votre@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
              placeholder="••••••••"
            />
          </div>

          <div className="flex space-x-4 pt-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleRegister}
              className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 text-white py-2 px-4 rounded-lg hover:from-purple-700 hover:to-purple-800 transition duration-200 shadow-lg hover:shadow-xl"
            >
              S'inscrire
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogin}
              className="flex-1 bg-gradient-to-r from-pink-600 to-pink-700 text-white py-2 px-4 rounded-lg hover:from-pink-700 hover:to-pink-800 transition duration-200 shadow-lg hover:shadow-xl"
            >
              Se connecter
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="text-center text-sm text-gray-500 mt-6"
        >
          <p>En vous connectant, vous acceptez nos conditions d'utilisation</p>
        </motion.div>
      </motion.div>
    </div>
  );
}; 