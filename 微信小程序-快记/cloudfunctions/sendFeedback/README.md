请在 CloudBase 控制台或云函数配置中设置以下环境变量（不要把密码写入仓库）:

- SMTP_USER: 发件邮箱（例如 3423913491@qq.com）
- SMTP_PASS: 发件邮箱授权码或密码

设置方法：
1. 登录 CloudBase 控制台 → 选择对应环境。
2. 进入「云函数」→ 找到 `sendFeedback` → 配置 → 环境变量，填入 `SMTP_USER` 和 `SMTP_PASS`。
3. 保存并重新部署云函数。

注意：如使用 QQ 邮箱，SMTP_PASS 应使用邮箱的授权码而非登录密码。