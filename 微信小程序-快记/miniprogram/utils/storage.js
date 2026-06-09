function get(key, defaultValue = null) {
  try {
    const value = wx.getStorageSync(key)
    if (value === '' || value === undefined) {
      return defaultValue
    }
    return value
  } catch (e) {
    console.warn('storage.get 失败:', key, e)
    return defaultValue
  }
}

function set(key, value) {
  try {
    wx.setStorageSync(key, value)
    return true
  } catch (e) {
    console.warn('storage.set 失败:', key, e)
    return false
  }
}

function remove(key) {
  try {
    wx.removeStorageSync(key)
    return true
  } catch (e) {
    console.warn('storage.remove 失败:', key, e)
    return false
  }
}

function getJSON(key, defaultValue = null) {
  const raw = get(key)
  if (raw === null) return defaultValue
  try {
    return JSON.parse(raw)
  } catch (e) {
    return defaultValue
  }
}

function setJSON(key, value) {
  try {
    return set(key, JSON.stringify(value))
  } catch (e) {
    console.warn('storage.setJSON 失败:', key, e)
    return false
  }
}

function getDefaultCategory() {
  return get('defaultCategory')
}

function setDefaultCategory(key) {
  return set('defaultCategory', key)
}

function getRecentCategories() {
  return getJSON('recentCategories', [])
}

function setRecentCategory(key) {
  let recent = getRecentCategories()
  recent = recent.filter(k => k !== key)
  recent.unshift(key)
  if (recent.length > 10) recent = recent.slice(0, 10)
  return setJSON('recentCategories', recent)
}

function getThemeMode() {
  return get('themeMode', 'auto')
}

function setThemeMode(mode) {
  return set('themeMode', mode)
}

module.exports = {
  get,
  set,
  remove,
  getJSON,
  setJSON,
  getDefaultCategory,
  setDefaultCategory,
  getRecentCategories,
  setRecentCategory,
  getThemeMode,
  setThemeMode
}