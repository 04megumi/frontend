import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import styles from '../css/Register.module.css';
import { register } from '../api/user'
  
function Register() {
  const [formData, setFormData] = useState({ 
    name: "", 
    password: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError(null)
    // 密码强度检查
    if (name === "password") {
      if (value.length < 8) {
        setPasswordStrength("Weak ❌");
      } else if (value.match(/[A-Z]/) && value.match(/[0-9]/)) {
        setPasswordStrength("Strong ✅");
      } else {
        setPasswordStrength("Medium ⚠️");
      }
    }

    // 密码一致性检查
    if (name === "confirmPassword") {
      const isValid = value === formData.password;
      setError(isValid ? "" : "密码不一致");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("密码不一致");
      return;
    }
    if (passwordStrength !== "Strong ✅") {
      setError("密码强度不够, 请重新设置密码");
      return;
    }

    try {
      const response = await register({
        "name": formData.name,     
        "password": formData.password 
      });
      if (response.success) {
        let code = response.data.code;
        let msg = response.data.msg;
        if (code===100000) {
          navigate("/LogIn");
        } else {
          setError(msg);
        }
      } else {
        setError(error?.message || '注册请求失败，请稍后再试');
      }
    } catch (error) {
      setError(error);
    }
  };

  // 动态设置页面标题和图标
  useEffect(() => {
    document.title = '注册 - Your Consultant';
    const link = document.querySelector("link[rel='icon']");
    link.href = '/xiaoba.svg'; 

    // 组件卸载时恢复默认设置（可选）
    return () => {
      document.title = 'Default Title';
      link.href = '/xiaoba.svg';
    };
  }, []);

  return (
    <main className={styles.registerContainer}>
      <section className={styles.registerLeftSection}>
        <h1 className={styles.registerH1}>Hi There! •₃•</h1>
        <form className={styles.registerForm} onSubmit={handleSubmit}>
          {/* 用户名输入框 */}
          <div className={styles.registerInputGroup}>
            <input
              type="text"
              name="name"
              placeholder="name"
              value={formData.name}
              onChange={handleChange}
            />
            <span className={styles.icon}>📧</span>
          </div>
          {/* 密码输入框 */}
          <div className={styles.registerInputGroup}>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
          {/* 确认密码输入框 */}
          <div className={styles.registerInputGroup}>
            <input
              type={showPassword ? 'text' : 'password'}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            <span className={styles.icon}>🔒</span>
          </div>
          {/* 密码强度显示 */}
          <div className={styles.passwordStrength}>{passwordStrength}</div>
          {/* 错误信息 */}
          {error && <div className={styles.errorText}>{error}</div>}
          {/* 注册按钮 */}
          <button className={styles.registerButton} type="submit">
            Register
          </button>
        </form>
      </section>
      <section className={styles.registerRightSection}></section>
    </main>
  );
}

export default Register;