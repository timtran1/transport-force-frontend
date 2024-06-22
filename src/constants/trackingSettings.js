let enableAnonUsers = import.meta.env.VITE_ENABLE_ANON_USERS
let enableXRAY = import.meta.env.VITE_ENABLE_XRAY

if (enableAnonUsers === undefined) {
    enableAnonUsers = true
} else {
    enableAnonUsers = enableAnonUsers === "true"
}

if (enableXRAY === undefined) {
    enableXRAY = true
} else {
    enableXRAY = enableXRAY === "true"
}

export default {
    enableAnonUsers,
    enableXRAY
}