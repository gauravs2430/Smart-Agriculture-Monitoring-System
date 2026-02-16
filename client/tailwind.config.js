/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            transitionDuration: {
                '400': '400ms',
                '600': '600ms',
            },
            trasnsitionTimingFunction: {
               'smooth': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',    
            'bounce': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
            },
        },
    },
    plugins: [],
}