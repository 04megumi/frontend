import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../css/LogIn.module.css';
import { login, me } from '../api/user.js';

function LogIn() {
  const [userLogInDTO, setUserLogInData] = useState({
    name: '',
    password: '',
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const handleChange = (e) => {
    setUserLogInData({
      ...userLogInDTO,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setError(null);
    if (!userLogInDTO.name) {
      setError('用户名不能为空!');
      return;
    }
    if (!userLogInDTO.password) {
      setError('密码不能为空!');
      return;
    }
    localStorage.removeItem("jwt");
    try {
      const response = await login(userLogInDTO);
      if (response.success) {
        localStorage.setItem('jwt', response.data);
        const meResponse = await me();
        if (meResponse.success) {
          if (!meResponse.data.policies['rbac.login']) {
            navigate('/imageCarousel');
          } else {
            navigate('/dashboard');
          }
        } else {
          setError(meResponse.message);
        }
      } else {
        setError(response.message || '登录请求失败，请稍后再试');
      }
    } catch (error) {
      setError(error);
    }
  };

  useEffect(() => {
    const fetchPolicies = async () => {
      const response = await me();
      if (response.success && response.data.policies['rbac.login']) {
        navigate('/dashboard');
      }
    };
    if(localStorage.getItem("jwt")!==null) {
      fetchPolicies();
    }
    document.title = '登录 - Your Consultant';
    const link = document.querySelector("link[rel='icon']");
    link.href = '/xiaoba.svg';
    return () => {
      document.title = 'Default Title';
      link.href = '/xiaoba.svg';
    };
  }, [navigate]); 

  return (
    <main className={styles.loginContainer}>
      <section className={styles.loginLeftSection}>
        <h1 className={styles.loginH1}>Log In •ᴗ•</h1>
        <form className={styles.loginForm} onSubmit={handleSubmit}>
          <div className={styles.loginInputGroup}>
            <input
              type="text"
              name="name"
              placeholder="name"
              value={userLogInDTO.name}
              onChange={handleChange}
            />
            <span className={styles.icon}>📧</span>
          </div>
          <div className={styles.loginInputGroup}>
            <input
              type="password"
              name="password"
              placeholder="password"
              value={userLogInDTO.password}
              onChange={handleChange}
            />
            <span className={styles.icon}>🔒</span>
          </div>
          {error && <p className={styles.errorText}>{error}</p>}
          <div className={styles.forgotPassword}>Forgot password?</div>
          <button className={styles.loginButton} type="submit">
            Log In
          </button>
          <div className={styles.registerText}>
            Don't have an account?{' '}
            <a className={styles.register} href="/Register">
              Register
            </a>
          </div>
        </form>
      </section>
      <aside className={styles.loginRightSection}></aside>
    </main>
  );
}

export default LogIn;
