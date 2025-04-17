import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import styles from '../css/Register.module.css';
import { register } from "../api/user.js";
  
function Register() {
  const [formData, setFormData] = useState({ 
    name: "", 
    password: "",
    confirmPassword: "", // 确认密码
    email: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(""); // 密码强度
  const navigate = useNavigate();

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

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
    e.preventDefault(); // 阻止表单默认提交行为

    // 如果密码不一致，直接返回
    if (formData.password !== formData.confirmPassword) {
      setError("密码不一致");
      return;
    }

    try {
      const response = await register(formData); // 调用 API 发送注册请求
      if (response.code === 100000) {
        alert("注册成功！即将跳转到登录页面");
        navigate("/LogIn"); // 注册成功后跳转到 login 页面
      }
    } catch (error) {
      if (error.response?.status === 100900) {
        setError("用户名已存在");
      } else {
        setError(error.response?.data?.message || "注册失败，请重试");
      }
      console.error("注册失败:", error.response?.data || error.message);
    }
  };

  return (
    <div className={styles.registerContainer}>
      <div className={styles.registerLeftSection}>
        <h1 className={styles.registerH1}>Hi There! •₃•</h1>

        <form className={styles.registerform} onSubmit={handleSubmit}>
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
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password} 
              onChange={handleChange} 
            />
            <span className={styles.icon}>🔒</span>
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>

          {/* 确认密码输入框 */}
          <div className={styles.registerInputGroup}>
            <input 
              type="password" 
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
          <button className={styles.registerButton}>Register</button>
        </form>
      </div>

      <div className={styles.registerRightSection}></div>
    </div>
  );
}

export default Register;