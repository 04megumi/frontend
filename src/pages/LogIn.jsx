import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../css/LogIn.module.css';
import { login, jwt } from '../api/user.js';

function LogIn() {
  // 声明useLogInDTO && 绑定setFormData函数
  const [userLogInDTO, setUserLogInData] = useState({
    name: '',
    password: '',
  });
  // 声明error && 绑定setError函数
  const [error, setError] = useState(null);
  // 声明navigate路由
  const navigate = useNavigate();

  // 处理输入框变化
  const handleChange = (e) => {
    setUserLogInData({
      ...userLogInDTO,
      [e.target.name]: e.target.value,
    });
  };

  const checkJwt = async () => {
    const jwtToken = localStorage.getItem('jwt');
    const jwtR = await jwt(jwtToken);
    return jwtR.data.data;
  };

  // 处理表单提交
  const handleSubmit = async (e) => {
    e.preventDefault(); // 阻止默认提交行为
    setError(null); // 重置错误信息

    // 前端基本错误处理
    if (!userLogInDTO.name) {
      setError('用户名不能为空!');
      return;
    }
    if (!userLogInDTO.password) {
      setError('密码不能为空!');
      return;
    }

    try {
      const response = await login(userLogInDTO);
      if (response.success) {
        let code = response.data.code;
        let msg = response.data.msg;
        if (code === 100000) {
          localStorage.setItem('jwt', response.data.data);
          const data = await checkJwt();
          if (data.policies !== null && data.policies['rbac.login']) {
            navigate('/dashboard');
          } else {
            navigate('/imageCarousel');
          }
        } else {
          setError(msg);
        }
      } else {
        setError(error?.message || '登录请求失败，请稍后再试');
      }
    } catch (error) {
      setError(error);
    }
  };

  // 动态设置页面标题和图标
  useEffect(() => {
    const fetchPolicies = async () => {
      const data = await checkJwt();
      if (data.policies !== null && data.policies['rbac.login']) {
        navigate('/dashboard');
      }
    };

    fetchPolicies();

    document.title = '登录 - Your Consultant';
    const link = document.querySelector("link[rel='icon']");
    link.href = '/xiaoba.svg';

    // 组件卸载时恢复默认设置（可选）
    return () => {
      document.title = 'Default Title';
      link.href = '/xiaoba.svg';
    };
  }, [navigate]); // 依赖项中包括 navigate，确保导航功能正常

  return (
    <main className={styles.loginContainer}>
      {/* 左侧登录表单区域 */}
      <section className={styles.loginLeftSection}>
        <h1 className={styles.loginH1}>Log In •ᴗ•</h1>
        {/* 登录表单 */}
        <form className={styles.loginForm} onSubmit={handleSubmit}>
          {/* 用户名输入框 */}
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
          {/* 密码输入框 */}
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
          {/* 显示错误信息 */}
          {error && <p className={styles.errorText}>{error}</p>}
          {/* 忘记密码链接 */}
          <div className={styles.forgotPassword}>Forgot password?</div>
          {/* 登录按钮 */}
          <button className={styles.loginButton} type="submit">
            Log In
          </button>
          {/* 注册新账号的提示 */}
          <div className={styles.registerText}>
            Don't have an account?{' '}
            <a className={styles.register} href="/Register">
              Register
            </a>
          </div>
        </form>
      </section>
      {/* 右侧区域 (可以用于展示其他内容，如广告、提示等) */}
      <aside className={styles.loginRightSection}></aside>
    </main>
  );
}

export default LogIn;
