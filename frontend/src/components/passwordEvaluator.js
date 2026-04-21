function analyzePasswordStrength(password) {
    const checks = {
    length:      password.length >= 8,
    uppercase:   /[A-Z]/.test(password),
    lowercase:   /[a-z]/.test(password),
    number:      /[0-9]/.test(password),
    punctuation: /[^A-Za-z0-9]/.test(password),  
  };

  const score = Object.values(checks).filter(Boolean).length;

  return { checks, score };

}
function getStrength(score) {
  if (score <= 2) return { label: 'weak',   bars: 1 };
  if (score <= 3) return { label: 'fair',   bars: 2 };
  if (score <= 4) return { label: 'good',   bars: 3 };
  return             { label: 'strong', bars: 4 };
}

export { analyzePasswordStrength, getStrength };