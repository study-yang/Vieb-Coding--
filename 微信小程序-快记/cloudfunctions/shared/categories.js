/**
 * 云函数共享分类数据
 * 与前端 app-config.js 中的分类保持同步
 */

// 分类 key → 中文名映射
const CATEGORY_MAP = {
  food: '餐饮',
  transport: '交通',
  shopping: '购物',
  entertain: '娱乐',
  housing: '居家',
  medical: '医疗',
  education: '学习',
  dress: '服饰',
  pet: '宠物',
  travel: '旅行',
  social: '社交',
  beauty: '美容',
  digital: '数码',
  gift: '礼物',
  sport: '运动',
  other: '其他',
  salary: '工资',
  bonus: '奖金',
  investment: '理财',
  sidejob: '兼职',
  other_inc: '其他'
}

// AI prompt 中使用的分类中文名列表（仅支出，与前端 EXPENSE_CATEGORIES 对应）
const EXPENSE_CATEGORY_NAMES = [
  '餐饮', '交通', '购物', '娱乐', '居家', '医疗',
  '学习', '服饰', '宠物', '旅行', '社交', '美容', '数码',
  '礼物', '运动', '其他'
]

function getCategoryName(key) {
  return CATEGORY_MAP[key] || '其他'
}

module.exports = {
  CATEGORY_MAP,
  EXPENSE_CATEGORY_NAMES,
  getCategoryName
}
