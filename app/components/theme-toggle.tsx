'use client'

import { useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

const storageKey = 'theme-preference'

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark')
  document.documentElement.dataset.theme = theme
  document.documentElement.style.colorScheme = theme
}

function getSystemTheme(): Theme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const [theme, setTheme] = useState<Theme>('light')

  useEffect(() => {
    const savedTheme = window.localStorage.getItem(storageKey)
    const initialTheme =
      savedTheme === 'light' || savedTheme === 'dark'
        ? savedTheme
        : getSystemTheme()

    applyTheme(initialTheme)
    setTheme(initialTheme)
    setMounted(true)

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => {
      if (!window.localStorage.getItem(storageKey)) {
        const nextTheme = getSystemTheme()
        applyTheme(nextTheme)
        setTheme(nextTheme)
      }
    }

    mediaQuery.addEventListener('change', handleChange)

    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  function toggleTheme() {
    const nextTheme = theme === 'dark' ? 'light' : 'dark'

    window.localStorage.setItem(storageKey, nextTheme)
    applyTheme(nextTheme)
    setTheme(nextTheme)
  }

  return (
    <button
      type="button"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      className="theme-muted theme-hover flex items-center rounded-full border px-3 py-1 text-sm theme-border"
      onClick={toggleTheme}
    >
      {mounted ? `mode: ${theme}` : 'mode'}
    </button>
  )
}
