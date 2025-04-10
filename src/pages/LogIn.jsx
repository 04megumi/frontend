import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../css/LogIn.module.css';
import { login } from "../api/logIn";
import { userMe } from "../api/rbac";


function LogIn() {
  const [formData, setFormData] = useState({
    name: "",
    password: "",
  });
  const [error, setError] = useState(null); // 错误信息状态
  const navigate = useNavigate();

  // 动态设置页面标题和图标
  useEffect(() => {
    document.title = '登录 - Your Consultant';
    const link = document.querySelector("link[rel='icon']");
    link.href = '/xiaoba.svg';

    // 组件卸载时恢复默认设置（可选）
    return () => {
      document.title = 'Default Title';
      link.href = '/xiaoba.svg';
    };
  }, []);


  // 处理输入框变化
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // 处理表单提交
  const handleSubmit = async (e) => {
    e.preventDefault(); // 阻止默认提交行为
    setError(null); // 重置错误信息
    console.log("Submitting form", formData);
    try {
      const response = await login({
        name: formData.name,
        password: formData.password,
      });
      console.log(response);
  
      localStorage.setItem("jwt", response.data.data.token);
      console.log("JWT saved:", localStorage.getItem("jwt"));
      navigate("/imageCarousel");  // 跳转到 ImageCarousel 页面

    } catch (error) {
      console.log("Error occurred:", error);  // 观察请求失败时的错误信息
      setError("登录失败,请检查账号密码或网络连接");
    }
  };
  // 组件加载时，检查 JWT 是否有效
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // 从 localStorage 获取 JWT
        const jwt = localStorage.getItem('jwt');
        if (jwt) {
          // 后端提供一个检查 JWT 的 API
          const response = await userMe(jwt);
          if (response.code === 100000) {
            console.log("JWT 有效，直接跳转");
            navigate("/imageCarousel"); // 跳转到主页
          } else {
            console.log("JWT 失效");
          }
        }
      } catch (error) {
        console.log("JWT 校验失败或请求错误", error);
      }
    };

    // 如果用户已经登录且有有效的 JWT，直接跳转
    checkAuth();
  }, [navigate]);

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginLeftSection}>
        <h1 className={styles.loginH1}>Log In •ᴗ•</h1>

        <form className={styles.loginForm} onSubmit={handleSubmit}>
          <div className={styles.loginInputGroup}>
            <input
              type="text"
              name="name"
              placeholder="name"
              value={formData.name}
              onChange={handleChange}
            />
            <span className={styles.icon}>📧</span>
          </div>

          <div className={styles.loginInputGroup}>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
            <span className={styles.icon}>🔒</span>
          </div>

          {/* 显示错误信息 */}
          {error && <p className={styles.errorText}>{error}</p>}

          <div className={styles.forgotPassword}>Forgot password?</div>

          <button className={styles.loginButton} type="submit">Log In</button>

          <div className={styles.registerText}>
            Don't have an account?{" "}
            <a className={styles.register} href="/Register">Register</a>
          </div>
        </form>
      </div>
      <div className={styles.loginRightSection}></div>
    </div>
  );
}

export default LogIn;