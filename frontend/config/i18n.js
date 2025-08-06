import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import translations
import enCommon from '../locales/en/common.json';
import enAuth from '../locales/en/auth.json';
import enGoals from '../locales/en/goals.json';
import enHabits from '../locales/en/habits.json';
import enJournal from '../locales/en/journal.json';

import deCommon from '../locales/de/common.json';
import deAuth from '../locales/de/auth.json';
import deGoals from '../locales/de/goals.json';
import deHabits from '../locales/de/habits.json';
import deJournal from '../locales/de/journal.json';

import zhCommon from '../locales/zh/common.json';
import zhAuth from '../locales/zh/auth.json';
import zhGoals from '../locales/zh/goals.json';
import zhHabits from '../locales/zh/habits.json';
import zhJournal from '../locales/zh/journal.json';

import laCommon from '../locales/la/common.json';
import laAuth from '../locales/la/auth.json';
import laGoals from '../locales/la/goals.json';
import laHabits from '../locales/la/habits.json';
import laJournal from '../locales/la/journal.json';

import trCommon from '../locales/tr/common.json';
import trAuth from '../locales/tr/auth.json';
import trGoals from '../locales/tr/goals.json';
import trHabits from '../locales/tr/habits.json';
import trJournal from '../locales/tr/journal.json';

const resources = {
  en: {
    common: enCommon,
    auth: enAuth,
    goals: enGoals,
    habits: enHabits,
    journal: enJournal,
  },
  de: {
    common: deCommon,
    auth: deAuth,
    goals: deGoals,
    habits: deHabits,
    journal: deJournal,
  },
  zh: {
    common: zhCommon,
    auth: zhAuth,
    goals: zhGoals,
    habits: zhHabits,
    journal: zhJournal,
  },
  la: {
    common: laCommon,
    auth: laAuth,
    goals: laGoals,
    habits: laHabits,
    journal: laJournal,
  },
  tr: {
    common: trCommon,
    auth: trAuth,
    goals: trGoals,
    habits: trHabits,
    journal: trJournal,
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    defaultNS: 'common',
    ns: ['common', 'auth', 'goals', 'habits', 'journal'],
  });

// React Native için dil algılama
const getStoredLanguage = async () => {
  try {
    const storedLanguage = await AsyncStorage.getItem('userLanguage');
    if (storedLanguage) {
      i18n.changeLanguage(storedLanguage);
    }
  } catch (error) {
    console.log('Error loading stored language:', error);
  }
};

getStoredLanguage();

export default i18n; 