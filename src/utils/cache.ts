const defaultKeyName = 'u_infos564446'
export const setLocal = (content: any, name = defaultKeyName) => {
  localStorage.setItem(name, JSON.stringify(content))
}

export const getLocal = (name = defaultKeyName): any => {
  const content = localStorage.getItem(name)
  if (!content) return null
  return JSON.parse(content)
}
