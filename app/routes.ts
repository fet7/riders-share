import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("signup", "routes/signup.tsx"),
    route("signin", "routes/signin.tsx"),
    route("signout", "routes/signout.tsx"),
    route("shareholders", "routes/shareholders/shareholders.tsx"),
    route("statements", "routes/deposits/deposits.tsx"),
    route("deposits", "routes/shareholder-deposits/shareholder-deposits.tsx"),
    route("dashboard", "routes/dashboard.tsx"),
    route("shareholder", "routes/shareholder.tsx"),
    route("deposit", "routes/deposit.tsx"),
] satisfies RouteConfig;
