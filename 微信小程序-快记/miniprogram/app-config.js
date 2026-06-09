const CLOUD_ENV_ID = 'kuaiji-d1g40gf21f7a1f4e7'

const EXPENSE_CATEGORIES = [
  { key: 'food',       emoji: '🍜', name: '餐饮',   color: '#FF6B35' },
  { key: 'transport',  emoji: '🚗', name: '交通',   color: '#3B82F6' },
  { key: 'shopping',   emoji: '🛒', name: '购物',   color: '#8B5CF6' },
  { key: 'entertain',  emoji: '🎮', name: '娱乐',   color: '#EC4899' },
  { key: 'housing',    emoji: '🏠', name: '居家',   color: '#10B981' },
  { key: 'medical',    emoji: '💊', name: '医疗',   color: '#EF4444' },
  { key: 'education',  emoji: '📚', name: '学习',   color: '#F59E0B' },
  { key: 'dress',      emoji: '👗', name: '服饰',   color: '#6366F1' },
  { key: 'pet',        emoji: '🐱', name: '宠物',   color: '#F97316' },
  { key: 'travel',     emoji: '✈️', name: '旅行',   color: '#06B6D4' },
  { key: 'social',     emoji: '🎓', name: '社交',   color: '#A855F7' },
  { key: 'beauty',     emoji: '💄', name: '美容',   color: '#F43F5E' },
  { key: 'digital',    emoji: '📱', name: '数码',   color: '#64748B' },
  { key: 'gift',       emoji: '🎁', name: '礼物',   color: '#E11D48' },
  { key: 'sport',      emoji: '⚽', name: '运动',   color: '#22C55E' },
  { key: 'other',      emoji: '📋', name: '其他',   color: '#94A3B8' }
]

const INCOME_CATEGORIES = [
  { key: 'salary',     emoji: '💰', name: '工资',   color: '#52C41A' },
  { key: 'bonus',      emoji: '🎉', name: '奖金',   color: '#52C41A' },
  { key: 'investment', emoji: '📈', name: '理财',   color: '#52C41A' },
  { key: 'sidejob',    emoji: '💼', name: '兼职',   color: '#52C41A' },
  { key: 'other_inc',  emoji: '📋', name: '其他',   color: '#52C41A' }
]

const CATEGORY_NAME_MAP = {}
EXPENSE_CATEGORIES.forEach(c => { CATEGORY_NAME_MAP[c.key] = c.name })
INCOME_CATEGORIES.forEach(c => { CATEGORY_NAME_MAP[c.key] = c.name })

const DEFAULT_BUDGET_AMOUNTS = [50, 100, 150, 200, 300]
const DEFAULT_MONTHLY_BUDGETS = [2000, 3000, 5000, 8000, 10000]

const PERIOD_OPTIONS = [
  { key: 'week', name: '本周' },
  { key: 'month', name: '本月' },
  { key: 'lastMonth', name: '上月' }
]

// 订阅消息模板 ID（需在微信公众平台申请后填入）
const SUBSCRIBE_TEMPLATE_ID = ''

module.exports = {
  CLOUD_ENV_ID,
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
  CATEGORY_NAME_MAP,
  DEFAULT_BUDGET_AMOUNTS,
  DEFAULT_MONTHLY_BUDGETS,
  PERIOD_OPTIONS,
  SUBSCRIBE_TEMPLATE_ID
}