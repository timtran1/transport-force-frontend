export default import.meta.env.DEV ?
    import.meta.env.VITE_APP_BACKEND || window.VITE_APP_BACKEND || 'https://synovia-api.deepsel.com'
    :
    import.meta.env.VITE_APP_BACKEND || window.VITE_APP_BACKEND || 'https://synovia-api.deepsel.com';