import {
  Home,
  Login,
} from "@router/scenes/index";

export const mainRouterList: IRouterConfig[] = [
  {
    title: "Home",
    path: "/",
    component: Home
  },
  {
    title: "Login",
    path: "/login",
    component: Login
  },
];

