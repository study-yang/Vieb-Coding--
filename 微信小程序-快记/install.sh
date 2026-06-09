# 进入 repo 根
cd "e:/Vibe Coding/微信小程序-快记"

# 遍历 cloudfunctions 并运行修复（建议先备份/在分支上）
for d in cloudfunctions/*; do
  if [ -f "$d/package.json" ]; then
    echo "== $d =="
    (cd "$d" && npm ci)                       # 安装依赖（CI 推荐使用 npm ci）
    (cd "$d" && npm audit --audit-level=moderate) || true
    (cd "$d" && npm audit fix) || true        # 尝试安全自动修复
    # 若 audit 报告仍有高危问题，可考虑：
    # (cd "$d" && npm audit fix --force) || true
  fi
done