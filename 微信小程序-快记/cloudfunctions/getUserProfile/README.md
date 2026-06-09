请在 CloudBase 控制台或云函数配置中设置以下环境变量（不要把 AppSecret 写入仓库）:

- APPID: 小程序的 AppID
- APPSECRET: 小程序的 AppSecret

设置方法：
1. 登录 CloudBase 控制台 → 选择对应环境。
2. 进入「云函数」→ 找到 `getUserProfile` → 配置 → 环境变量，填入 `APPID` 和 `APPSECRET`。
3. 保存并重新部署云函数。

说明：当前仓库中的 `config.json` 已将 `APPSECRET` 清空为占位，部署前请务必在控制台补齐。