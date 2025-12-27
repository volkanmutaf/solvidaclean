// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
        logo: ['Poppins', 'sans-serif'],
        bricolage: ['Bricolage Grotesque', 'sans-serif'],
      },
      colors: {
        light: "#fdfffc",
        primary: "#2ec4b6",
        accent: "#ff9f1c",
        dark: "#011627",
        highlight: "#e71d36",
        review: "#00BFA6",
        solvidaBg: '#EAF6FF',
      },
      backgroundImage: {
        'clean-pattern': "url('/src/assets/bg-clean-icons.svg')",
      },
      animation: {
        "fade-in-up": "fadeInUp 1s ease-out",
        'marquee': 'marquee 30s linear infinite',
        'marquee-fast': 'marquee 20s linear infinite',
        'marquee-slow': 'marquee 40s linear infinite',
        'spin-slow-once': 'spin-slow-once 1s ease-in-out forwards',
        'bounce-once': 'bounce-once 0.7s ease-out forwards',
        'wiggle': 'wiggle 0.5s ease-in-out infinite alternate',
        'pulse-once': 'subtlePulse 1.5s ease-in-out forwards',
        // Ensure 'infinite' is set here for continuous blinking
        'blink-slow': 'blink 2s linear infinite',
        'strong-blink': 'strong-blink 5s ease-in-out infinite',
      },
      keyframes: {
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        'marquee': {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'spin-slow-once': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'bounce-once': {
          '0%, 100%': {
            transform: 'translateY(0)',
            animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)',
          },
          '50%': {
            transform: 'translateY(-10%)',
            animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)',
          },
        },
        'wiggle': {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        'subtlePulse': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.01)' },
        },
        'blink': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' }, // Tam kaybolacak
        },
        'strong-blink': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        
      },
    },
  },
  plugins: [require('@tailwindcss/line-clamp')],
  
};