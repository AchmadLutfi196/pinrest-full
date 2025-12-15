import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services';

// Background images for mosaic
const backgroundImages = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuD3u24mvEnwG0j6gO4NjuPeixsooxe00YRe9zg0CbfK53mFwXZqOrJWMm4HZ7vRPdzqehbNf7N4fLS8jkk0hmgXj0LKFEQ1XomPoLEjts4GG5XuiLR4yUc-Jl9XsaH78nRh8m9aBxkg2-afJaxfOMd-tdBPATsl5ollvNGOEsyMQxWNYHwIBkWWVdrV583c-JUvlK4IHDQoLck5LiQuwwrsdzgEdLyRsY2sBZPv0TJSblouZ_zclq90izOVcZu9ZpzgKdTf7xH3e2Pq',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCDFKewmQ_DSESfWFe-BBxtZDoGQXb6d7YgcTuqLd2vZuN-Rbr647N36cFMbuMiVNVlY_eY5X5V449_1d7o6lm6hAD8RnJ_oHDTaduczqx70QG6JjKj3Is4LK_AYe9L0RWSSbvCBHrhlIuaFG9pkHvRs-pL97quLtBETa_InSHFtkcKtmUaehC2fQhu90swVeeq03e75TvamaIZxsgAdsMGoIJrZdRtlcSWjqlD2WcxKqfmMLrVmKpQ19ICVwUosRQo07-J8Yd4jq9k',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuA0HKC2jlD5vmcypf3MehEMcNzagg5IcUGNQLu_CSiMyKjYwWi4nC3FQABz40NdMh4D_L-_4u7zpGNtTuDw0_1gxjAWzvoAdF-k8Q-OOnl3zFHul0yBNJM4yohM1DkXlDbrh9aXhrTzTDnF6vtiKuq3kG97D4xCWWtIadbiLQnbECGDFC52guIrJI0QpNBCpaL9vxm_cA86fKjFi8rfVkPvDT-RE5GPO6eZ6veLcP4w0p8jtqo9mu7R92ueEkj4VxC_XisLlRJoORlo',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCPfYj6UMQB3fNjeYA7mIaPVSoxOYCI-04c5PRJZml88zibuewPoVVEwFxhhXLs40CVSzHOnNNjwiCFduahcoCjxqmLpSRhIkUCH2g89s4D6fr4WLurRNz_3ubudpQCOFSMZ-XHTrMNzaCEtsg8PHrWcMIee4LPKQpEFi6uaYhtLSt-JOBs6B5sZYJIqjo_UB0VbAVWpUOdpAdPlTMgHvpbsFaeL7rxNu2vqgGMomSPk5LjXHq8jReHU17f4vEnEnsXVfU8FbhydCbd',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBJ3dJrhZ8ZuefhHnhJheda5rq3veaHjiChU4vzIkMxYK4Iu9Zhr1fWgWPLWaO5UkoVKPe2qNjJMF5FXOGMX5yGD3lc47DqhnP1knNhzr8UBMsQW6K2VQZg5uGEHNzyvdvTQVaOjxf7vjzlf8wehYrMVwGrQ0WjFiyDvgrbjjGuh8aLFv2zfUE3cwqrTNPHE7YmzxhH6ZvvVa3Wg9d269QpGmfC28TfnUxl4Rk_dTKRr9O2Ez0LxByeES9aY7TMS1XV32Eug5gC6LmN',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDMc_9QCCMyKizQrBVIFKKDmGOHsTuF-ZtNN_QovFGwqe5fa-4ngbRuMS6pOIHXye2eXdV1lnmuTRVSsADlvp632n2aHhEc0mKu-jMPSPDrZqZFzTDqaA23ye5I8-BARf3VYy7Jn4atFwfjRxddeZVcQJ6cUNM2enNi1BHRvjnE_Mvnp9phOJjWdBNilAWObyHmEn8KQUzR43-t1VBXnjrVKvoLfP0Lv4c2B4Yo5kVzCA-xVsiST34i5hQsmEw26-MoaoaMVOEAFHzQ',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAKQcJTs8LLrUYHSeFhQj__Hldi19GdlYvBWzy0cIvuqFZZ4XCjD-BRIPOHvYY3ureDtf5dyYtZQLMJA89eFFDrRf1oeQhx0CEIH4-Lz8lqNzFL-b9VzikyE_p8yx7mNa4cMtoV15WR9NUX4bx52rV7L-EHaWPgJYOJxuCLQ2SlQhSzhSbt6akzsyXITtzCCIqFB5wimtwJLLwPnsa_IuoMTClSn5-s_gJIZl2zzb0ej8FCHVeRqJtTNL1TQh4sPN7idqmMuFMI27YP',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuD4lVJ0qeNoU4XyZjUwcHIHkBCB1ldYHSh1vx31ibny59qj4TlTgJdXjYca3y_S9fZnlur_mBbxEm8Pywgf-eHo04fIPXEJwiPqlaPNPBA2sTL8fEEv5EBjde0extr1hqvn8Ta-d3KpSvA9cmdsxlBWWXEIkPile_uGnP1cB-ueTZV6rMUbj3NTvl9mktsV-vu80jR8m1p2OJnw-LmHib_RH2DknsEztIK97rOIayNZx8B0WrK8XFQ6BCVqRQrnDFIhH8qIPGuI2N3S',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDy04cVzKuXQQfQKi4AONWiRhfKmYe27ThDRZr121xne7N2q2bF52cgyN5r1k9J-8e_UfLDSSACIHF4r9RqT1lUvTupaW_wF4U7P7Zh6UhWRk-D6VMa7sLqVhkloX7TX8h1otq9e6vod8vbbNYCCfzhvjnQO1IBqDSxQuoFRDQICdVM7b18lCuvMW7w5hVKVLXuXfrgKRF-67VHV7JQcZWOY6e1KkWoKBaRoSp-l46WjvB_sgy54csXuoIvfD8u7Aj35-Mp3W2VzyiX',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDwRC9OScn5OD0XTRpVK81JEIwTPtZwYjTSakdH82-GWCZTrc8E7OQemfXiqKEK1v-4scvuesYHOJVKse_z1f9duuShCVriiopchwYrxdBsm7n2u-nINxblbe9QXK7GB3zAPSeS7iQrPeUHCsZRpSuKgJkM-9kMQccQAkNpFpMQ3Le3jlEo386YE5q7pATSr5GNJEhS6sm6_7vDFAOwjX9ZV-pzq5eHZR4GudAXKYzMVygnlhy3Wj1Yyu00Uj9CHzOIJjfPPQPSsCoR',
];

export function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await authService.login({
        email: formData.email,
        password: formData.password,
      });
      
      login(response.access_token, response.user);
      navigate(from, { replace: true });
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-background-light font-[Manrope] antialiased overflow-hidden h-screen w-full relative text-text-main">
      {/* Background Mosaic */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-white/85 z-10 backdrop-blur-[2px]"></div>
        <div className="columns-2 md:columns-4 gap-4 p-4 opacity-30 grayscale-[20%] h-[120vh] -mt-10">
          {backgroundImages.map((src, index) => (
            <div key={index} className="break-inside-avoid mb-4">
              <img 
                className="w-full rounded-lg object-cover" 
                src={src} 
                alt={`Background ${index + 1}`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Login Card */}
      <div className="relative z-20 flex h-full w-full items-center justify-center p-4">
        <div className="w-full max-w-[480px] flex flex-col gap-8 rounded-[2rem] bg-surface-white/90 border border-white/60 shadow-xl backdrop-blur-xl p-6 sm:p-10">
          {/* Header */}
          <div className="flex flex-col gap-2 text-center">
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-pink-100 text-primary">
              <span className="material-symbols-outlined !text-3xl font-bold">bolt</span>
            </div>
            <h1 className="text-text-main text-3xl font-black leading-tight tracking-[-0.033em]">
              Welcome back
            </h1>
            <p className="text-text-sub text-base font-medium">
              Log in to discover your next inspiration
            </p>
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-2 gap-4">
            <button className="flex h-12 items-center justify-center gap-2 rounded-full bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27 3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10 5.35 0 9.25-3.67 9.25-9.09 0-1.15-.15-1.81-.15-1.81z"></path>
              </svg>
              <span className="text-sm font-bold">Google</span>
            </button>
            <button className="flex h-12 items-center justify-center gap-2 rounded-full bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.1 1.88-2.31 6.56 1.95 8.51zm-3.85-15.3c.6-1.35 1.57-2.34 2.97-2.92.54 1.62-.21 3.23-1.07 4.31-.9 1.15-2.22 1.95-3.51 1.86-.23-1.63.5-2.88 1.61-3.25z"></path>
              </svg>
              <span className="text-sm font-bold">Apple</span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="mx-4 flex-shrink-0 text-xs font-bold uppercase text-gray-400">Or with email</span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700 ml-4">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-5 pointer-events-none text-gray-400">
                  <span className="material-symbols-outlined text-[20px]">person</span>
                </div>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="block w-full rounded-full border-none bg-input-bg py-4 pl-12 pr-4 text-text-main placeholder-gray-400 focus:ring-2 focus:ring-primary/50 focus:bg-white sm:text-sm shadow-inner transition-all"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700 ml-4">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-5 pointer-events-none text-gray-400">
                  <span className="material-symbols-outlined text-[20px]">lock</span>
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="block w-full rounded-full border-none bg-input-bg py-4 pl-12 pr-12 text-text-main placeholder-gray-400 focus:ring-2 focus:ring-primary/50 focus:bg-white sm:text-sm shadow-inner transition-all"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 cursor-pointer text-gray-400 hover:text-primary transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between px-2">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                    className="peer h-5 w-5 appearance-none rounded border-2 border-gray-300 bg-white checked:bg-primary checked:border-primary transition-all focus:ring-0 focus:ring-offset-0 cursor-pointer"
                  />
                  <span className="material-symbols-outlined absolute left-0 top-0 pointer-events-none opacity-0 peer-checked:opacity-100 text-white text-[18px] font-bold">check</span>
                </div>
                <span className="text-sm font-medium text-gray-500 group-hover:text-gray-700 transition-colors">Remember me</span>
              </label>
              <a className="text-sm font-bold text-primary hover:text-primary-hover transition-colors" href="#">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 flex w-full items-center justify-center rounded-full bg-primary h-14 px-8 text-base font-bold text-white shadow-[0_4px_14px_0_rgba(236,72,153,0.39)] hover:shadow-[0_6px_20px_rgba(236,72,153,0.23)] hover:-translate-y-[1px] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Logging in...
                </span>
              ) : (
                'Log In'
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-sm text-gray-500">
              Don't have an account?{' '}
              <Link to="/register" className="font-bold text-gray-800 hover:text-primary transition-colors">
                Join now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
