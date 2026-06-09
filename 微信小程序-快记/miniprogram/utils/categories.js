const { EXPENSE_CATEGORIES, INCOME_CATEGORIES, CATEGORY_NAME_MAP } = require('../app-config.js')
const storage = require('./storage.js')

function getExpenseCategories() {
  return EXPENSE_CATEGORIES
}

function getIncomeCategories() {
  return INCOME_CATEGORIES
}

function getAllCategories() {
  return [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES]
}

function getCategoryByKey(key) {
  return getAllCategories().find(c => c.key === key) || null
}

function getCategoryName(key) {
  return CATEGORY_NAME_MAP[key] || '其他'
}

function isExpenseCategory(key) {
  return EXPENSE_CATEGORIES.some(c => c.key === key)
}

function isIncomeCategory(key) {
  return INCOME_CATEGORIES.some(c => c.key === key)
}

function getQuickCategories(limit = 4) {
  const recent = storage.getRecentCategories()
  if (recent.length >= limit) {
    return recent.slice(0, limit).map(key => getCategoryByKey(key)).filter(Boolean)
  }
  return EXPENSE_CATEGORIES.slice(0, limit)
}

function getDefaultCategory() {
  const defaultCat = storage.getDefaultCategory()
  if (defaultCat) {
    return getCategoryByKey(defaultCat)
  }
  return EXPENSE_CATEGORIES[0]
}

function setDefaultCategory(key) {
  storage.setDefaultCategory(key)
  const app = getApp()
  if (app) app.globalData.defaultCategory = key
}

function updateRecentCategory(key) {
  storage.setRecentCategory(key)
}

module.exports = {
  getExpenseCategories,
  getIncomeCategories,
  getAllCategories,
  getCategoryByKey,
  getCategoryName,
  isExpenseCategory,
  isIncomeCategory,
  getQuickCategories,
  getDefaultCategory,
  setDefaultCategory,
  updateRecentCategory
}
