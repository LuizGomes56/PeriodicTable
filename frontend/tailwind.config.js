/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{html,js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            backgroundColor: {
                "rose-250": "rgb(251 192 200)",
                "gold": "hsl(50, 100%, 87.5%)",
                "wrong": "#f87171",
                "correct": "#00fa9a"
            }
        }
    },
    darkMode: 'class',
    plugins: [],
}