/** @type {import('tailwindcss').Config} */
export default {
   content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
   theme: {
      extend: {
         colors: {
            "maple-red": "#D32F2F",
            "maple-red-light": "#EF5350",
            "maple-red-dark": "#B71C1C",
            "charcoal-gray": "#2C2C2C",
            "charcoal-gray-light": "#424242",
            "warm-amber": "#FFB300",
            "warm-amber-light": "#FFCA28",
            "whisper-white": "#FAFAFA",
            "light-slate": "#E0E0E0",
            "community-green": "#43A047",
            "community-green-light": "#66BB6A",
            "alert-red": "#C62828",
            "royal-blue": "#1976D2",
            "royal-blue-light": "#42A5F5",
            "lavender-purple": "#7E57C2",
            "lavender-purple-light": "#9575CD",
            "teal-accent": "#26A69A",
            "teal-accent-light": "#4DB6AC",
         },
         animation: {
            float: "float 6s ease-in-out infinite",
            "float-slow": "float 8s ease-in-out infinite",
            "float-slow-reverse": "float 10s ease-in-out infinite reverse",
            "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
            "slide-in-right": "slideInRight 0.5s ease-out",
            "slide-in-left": "slideInLeft 0.5s ease-out",
            "slide-in-up": "slideInUp 0.5s ease-out",
            "fade-in": "fadeIn 0.5s ease-out",
            "bounce-in": "bounceIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
            "spin-slow": "spin 3s linear infinite",
         },
         keyframes: {
            float: {
               "0%, 100%": { transform: "translateY(0)" },
               "50%": { transform: "translateY(-20px)" },
            },
            slideInRight: {
               "0%": { transform: "translateX(100%)", opacity: 0 },
               "100%": { transform: "translateX(0)", opacity: 1 },
            },
            slideInLeft: {
               "0%": { transform: "translateX(-100%)", opacity: 0 },
               "100%": { transform: "translateX(0)", opacity: 1 },
            },
            slideInUp: {
               "0%": { transform: "translateY(20px)", opacity: 0 },
               "100%": { transform: "translateY(0)", opacity: 1 },
            },
            fadeIn: {
               "0%": { opacity: 0 },
               "100%": { opacity: 1 },
            },
            bounceIn: {
               "0%": { transform: "scale(0.3)", opacity: 0 },
               "50%": { transform: "scale(1.05)", opacity: 0.9 },
               "70%": { transform: "scale(0.9)", opacity: 1 },
               "100%": { transform: "scale(1)", opacity: 1 },
            },
         },
         zIndex: {
            5: "5",
            15: "15",
         },
      },
   },
   plugins: [require("@tailwindcss/forms"), require("@tailwindcss/aspect-ratio")],
};
