# 🎋 AI诗词生成器 - 阿里云部署教程

> 专为新手小白准备的详细部署指南

---

## 📋 目录

1. [准备工作](#准备工作)
2. [连接到服务器](#连接到服务器)
3. [安装Nginx](#安装nginx)
4. [创建网站目录](#创建网站目录)
5. [上传文件](#上传文件)
6. [配置Nginx](#配置nginx)
7. [设置防火墙](#设置防火墙)
8. [测试访问](#测试访问)
9. [常见问题](#常见问题)

---

## 🛠️ 准备工作

### 你需要准备

- ✅ 阿里云轻量应用服务器（已创建）
- ✅ 服务器IP地址
- ✅ 服务器密码（或密钥）
- ✅ 本地电脑（Windows/Mac）
- ✅ 我们的AI诗词生成器项目文件

### 查看服务器信息

1. 登录阿里云控制台：https://www.aliyun.com
2. 进入"轻量应用服务器"
3. 找到你的服务器，查看：
   - **公网IP地址**：例如 `47.98.xxx.xxx`
   - **操作系统**：CentOS 或 Ubuntu
   - **端口**：22（SSH）

---

## 🔗 连接到服务器

### Windows用户 - 使用PowerShell

1. **打开PowerShell**
   - 按 `Win + X`，选择"Windows PowerShell"
   - 或者按 `Win + R`，输入 `powershell`，回车

2. **连接到服务器**
   ```powershell
   ssh root@你的服务器IP
   ```
   例如：
   ```powershell
   ssh root@47.98.123.456
   ```

3. **输入密码**
   - 第一次连接会提示输入密码
   - 输入你在阿里云设置的root密码
   - ⚠️ 输入时屏幕不会显示，这是正常的，输入完按回车即可

### Mac/Linux用户 - 使用终端

1. **打开终端**
   - Mac：按 `Command + Space`，搜索"终端"
   - Linux：按 `Ctrl + Alt + T`

2. **连接到服务器**
   ```bash
   ssh root@你的服务器IP
   ```
   例如：
   ```bash
   ssh root@47.98.123.456
   ```

3. **输入密码**
   - 输入你在阿里云设置的root密码
   - ⚠️ 输入时屏幕不会显示，这是正常的，输入完按回车即可

### 连接成功的标志

看到类似这样的界面就成功了：
```
Welcome to Alibaba Cloud Elastic Compute Service!
[root@localhost ~]#
```

---

## 📦 安装Nginx

Nginx是一个网页服务器，用来托管我们的网站。

### 如果你的服务器是 CentOS（大多数阿里云服务器）

在终端输入以下命令，一行一行输入：

```bash
# 第一步：安装Nginx
yum install nginx -y

# 第二步：启动Nginx
systemctl start nginx

# 第三步：设置开机自启动
systemctl enable nginx

# 第四步：检查Nginx状态
systemctl status nginx
```

看到 `active (running)` 就表示安装成功了！

### 如果你的服务器是 Ubuntu

```bash
# 第一步：更新软件包列表
apt update

# 第二步：安装Nginx
apt install nginx -y

# 第三步：启动Nginx
systemctl start nginx

# 第四步：设置开机自启动
systemctl enable nginx

# 第五步：检查Nginx状态
systemctl status nginx
```

---

## 📁 创建网站目录

我们需要一个地方来存放网站文件。

```bash
# 创建网站目录
mkdir -p /var/www/poem-generator

# 给目录设置权限
chmod -R 755 /var/www/poem-generator

# 进入目录确认
cd /var/www/poem-generator
pwd
```

你应该看到 `/var/www/poem-generator`

---

## 📤 上传文件

现在把我们的AI诗词生成器文件上传到服务器。

### 方法一：使用SCP命令（本地上传，推荐新手）

在你本地电脑的操作：

1. **Windows用户**：打开PowerShell，进入AI诗词生成器文件夹所在的目录
2. **Mac/Linux用户**：打开终端，进入AI诗词生成器文件夹所在的目录

3. **执行上传命令**
   ```bash
   scp -r ./AI诗词生成器/* root@你的服务器IP:/var/www/poem-generator/
   ```
   例如：
   ```bash
   scp -r ./AI诗词生成器/* root@47.98.123.456:/var/www/poem-generator/
   ```

4. **输入服务器密码**

5. **等待上传完成**（大约几秒钟）

### 方法二：使用WinSCP图形界面工具

1. **下载WinSCP**：https://winscp.net/eng/download.php
2. **安装并打开**
3. **连接到服务器**：
   - 主机名：你的服务器IP
   - 用户名：root
   - 密码：你的服务器密码
4. **点击登录**
5. **左侧**：本地电脑，找到AI诗词生成器文件夹
6. **右侧**：服务器，导航到 `/var/www/poem-generator`
7. **拖拽文件**：从左侧拖到右侧

### 方法三：使用FileZilla

1. **下载FileZilla**：https://filezilla-project.org/
2. **安装并打开**
3. **连接设置**（和WinSCP类似）
4. **传输文件**

---

## ⚙️ 配置Nginx

让Nginx知道我们的网站在哪里。

```bash
# 创建配置文件
nano /etc/nginx/conf.d/poem-generator.conf
```

复制粘贴以下内容：

```nginx
server {
    listen 80;
    server_name 你的服务器IP或域名;
    
    # 网站根目录
    root /var/www/poem-generator;
    
    # 默认首页
    index index.html;
    
    # 日志文件（可选）
    access_log /var/log/nginx/poem_access.log;
    error_log /var/log/nginx/poem_error.log;
    
    # 处理请求
    location / {
        try_files $uri $uri/ =404;
    }
}
```

⚠️ **重要**：把"你的服务器IP或域名"替换成你的实际IP地址！

例如：
```nginx
server_name 47.98.123.456;
```

**保存并退出**：
- 按 `Ctrl + X`
- 输入 `y` 确认保存
- 按回车

**重启Nginx**：
```bash
# 重启Nginx使配置生效
systemctl restart nginx

# 检查Nginx状态
systemctl status nginx
```

---

## 🔒 设置防火墙

让外部可以访问我们的网站。

### CentOS 系统

```bash
# 查看防火墙状态
systemctl status firewalld

# 如果防火墙是开启的，开放80端口
firewall-cmd --permanent --add-service=http

# 重载防火墙规则
firewall-cmd --reload

# 确认80端口已开放
firewall-cmd --list-ports
```

### Ubuntu 系统

```bash
# 查看防火墙状态
ufw status

# 如果防火墙是开启的，开放80端口
ufw allow 80/tcp

# 确认规则已添加
ufw status
```

---

## ✅ 测试访问

### 基础测试

在服务器上检查：

```bash
# 检查Nginx是否在运行
ps aux | grep nginx

# 检查端口是否监听
netstat -tlnp | grep :80
```

### 浏览器访问

在浏览器中输入：

```
http://你的服务器IP/
```

例如：
```
http://47.98.123.456/
```

如果看到AI诗词生成器的网页，恭喜你！🎉 部署成功了！

---

## 🌐 配置域名访问（可选）

如果你有域名，想用域名访问：

### 阿里云DNS解析

1. 登录阿里云控制台
2. 进入"云解析DNS"
3. 添加解析记录：
   - **记录类型**：A记录
   - **主机记录**：@（或www）
   - **记录值**：你的服务器IP
   - **TTL**：10分钟

4. 修改Nginx配置
   ```bash
   nano /etc/nginx/conf.d/poem-generator.conf
   ```
   
   把：
   ```nginx
   server_name 你的服务器IP或域名;
   ```
   
   改成：
   ```nginx
   server_name your-domain.com;
   ```
   
   保存退出

5. 重启Nginx
   ```bash
   systemctl restart nginx
   ```

6. 等待几分钟DNS生效，然后访问你的域名

---

## 🔧 常见问题

### 问题1：连接被拒绝

**错误信息**：`Connection refused` 或 `Connection timeout`

**解决方法**：
1. 检查服务器IP是否正确
2. 检查阿里云控制台的安全组是否开放了22端口
3. 在阿里云控制台 → 轻量应用服务器 → 防火墙，添加22端口规则

### 问题2：密码错误

**错误信息**：`Permission denied`

**解决方法**：
1. 确认密码输入正确
2. 在阿里云控制台可以重置密码
3. 重置后需要重启服务器

### 问题3：网页打不开

**错误信息**：`无法访问此网站`

**解决方法**：
1. 检查Nginx是否运行：`systemctl status nginx`
2. 检查防火墙：`systemctl status firewalld`
3. 开放80端口：`firewall-cmd --permanent --add-port=80/tcp`
4. 重启服务：`systemctl restart nginx`
5. 检查阿里云安全组是否开放80端口

### 问题4：上传文件失败

**错误信息**：`No such file or directory`

**解决方法**：
1. 确认本地电脑当前目录有AI诗词生成器文件夹
2. 检查文件夹路径是否正确
3. 确认服务器目录存在：`ls -la /var/www/poem-generator`

### 问题5：502 Bad Gateway

**错误信息**：浏览器显示502错误

**解决方法**：
1. 检查Nginx配置：`nginx -t`
2. 检查文件权限：`ls -la /var/www/poem-generator/`
3. 设置正确权限：`chmod -R 755 /var/www/poem-generator`

---

## 🎉 部署成功后的下一步

1. **启用HTTPS（SSL证书）**
   - 使用Let's Encrypt免费证书
   - 或者阿里云免费证书

2. **设置域名HTTPS**
   ```bash
   # 安装certbot
   yum install certbot python3-certbot-nginx -y  # CentOS
   apt install certbot python3-certbot-nginx -y  # Ubuntu
   
   # 获取证书
   certbot --nginx -d your-domain.com
   ```

3. **设置定时备份**

4. **监控网站访问**

---

## 📞 获取帮助

如果在部署过程中遇到问题：

1. **查看Nginx错误日志**：
   ```bash
   tail -f /var/log/nginx/error.log
   ```

2. **查看系统日志**：
   ```bash
   journalctl -xe
   ```

3. **重启Nginx**：
   ```bash
   systemctl restart nginx
   ```

4. **检查端口占用**：
   ```bash
   netstat -tlnp | grep :80
   ```

---

## 💡 快速命令参考

```bash
# 重启Nginx
systemctl restart nginx

# 查看Nginx状态
systemctl status nginx

# 检查Nginx配置
nginx -t

# 查看网站文件
ls -la /var/www/poem-generator

# 重启服务器
reboot

# 查看内存使用
free -h

# 查看磁盘使用
df -h
```

---

## 🎊 恭喜！

如果一切顺利，你现在应该可以通过 `http://你的服务器IP/` 访问AI诗词生成器了！

快去试试吧！ 🎋

---

**版本**：1.0  
**更新日期**：2024年  
**作者**：AI Assistant
