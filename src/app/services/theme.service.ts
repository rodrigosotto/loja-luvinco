import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private darkModeKey = 'darkMode';

  constructor() {
    this.applyTheme(this.isDarkMode());
  }

  isDarkMode(): boolean {
    const savedMode = localStorage.getItem(this.darkModeKey);
    return savedMode ? JSON.parse(savedMode) : false;
  }

  setDarkMode(isDarkMode: boolean): void {
    localStorage.setItem(this.darkModeKey, JSON.stringify(isDarkMode));
    this.applyTheme(isDarkMode);
  }

  private applyTheme(isDarkMode: boolean): void {
    if (isDarkMode) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }
}
