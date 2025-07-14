const express = require('express');
const router = express.Router();

// Get available languages
router.get('/languages', (req, res) => {
  const languages = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'de', name: 'German', nativeName: 'Deutsch' },
    { code: 'zh', name: 'Chinese', nativeName: '中文' },
    { code: 'la', name: 'Latin', nativeName: 'Latina' },
    { code: 'tr', name: 'Turkish', nativeName: 'Türkçe' }
  ];
  res.json(languages);
});

// Change language
router.post('/change-language', (req, res) => {
  const { language } = req.body;
  const supportedLanguages = ['en', 'de', 'zh', 'la', 'tr'];
  
  if (!supportedLanguages.includes(language)) {
    return res.status(400).json({ 
      message: req.t('common.error'),
      error: 'Unsupported language' 
    });
  }
  
  // Set language in cookie
  res.cookie('i18next', language, { 
    maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
    httpOnly: true 
  });
  
  res.json({ 
    message: req.t('common.success'),
    language: language 
  });
});

// Get current language
router.get('/current-language', (req, res) => {
  res.json({ 
    language: req.language,
    languages: req.languages 
  });
});

module.exports = router; 