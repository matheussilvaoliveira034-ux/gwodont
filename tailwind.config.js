/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#1a2e4a',       // Azul institucional escuro histórico da GW Odontologia
          blue: '#2563a8',       // Azul clínico principal
          'blue-light': '#3b82f6',
          'blue-soft': '#e8f0fb', // Fundo sutil institucional
          bg: '#ffffff',          // Fundo predominante branco
          surface: '#f8fafc',    // Fundo neutro auxiliar
          'surface-card': '#ffffff',
          border: '#e2e8f0',     // Linhas e divisórias discretas
          text: '#0f172a',       // Texto de títulos de alta legibilidade
          'text-body': '#334155', // Texto corrido
          'text-muted': '#64748b',// Texto auxiliar
          whatsapp: '#25D366',
          'whatsapp-dark': '#128C7E',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'card-subtle': '0 1px 3px 0 rgba(15, 23, 42, 0.05), 0 1px 2px -1px rgba(15, 23, 42, 0.05)',
        'card-hover': '0 10px 25px -5px rgba(26, 46, 74, 0.08), 0 8px 10px -6px rgba(26, 46, 74, 0.04)',
        'header': '0 1px 10px 0 rgba(26, 46, 74, 0.06)',
        'blue-glow': '0 12px 30px -5px rgba(37, 99, 235, 0.45)',
        'blue-glow-lg': '0 20px 40px -5px rgba(37, 99, 235, 0.6)',
        'card-blue': '0 10px 25px -5px rgba(30, 58, 138, 0.12)',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '0.9', transform: 'scale(1.05)' },
        },
      },
      animation: {
        marquee: 'marquee 25s linear infinite',
        'pulse-glow': 'pulseGlow 4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
