import { stackflow } from "@stackflow/react";
import type { StackflowPlugin, StackflowPluginHook } from "@stackflow/core";
import { basicRendererPlugin } from "@stackflow/plugin-renderer-basic";
import { historySyncPlugin } from "@stackflow/plugin-history-sync";
import { basicUIPlugin } from "@stackflow/plugin-basic-ui";
import { activities } from "./activities";

const authPlugin: any = {
  key: "auth-plugin",
  preEffect: ({ actions }: Parameters<StackflowPluginHook>[0]) => {
    // In a real app, you'd get this from a more robust global state.
    const isLoggedIn = (window as any).__isLoggedIn;
    const activity = actions.getStack().activities.at(-1);

    if (!isLoggedIn && activity?.name === "TC07_ProfileScreen" && activity.id) {
      actions.replace({
        activityId: activity.id,
        activityName: "TC07_LoginScreen",
        activityParams: {
          redirectTo: activity.name,
        },
      });
    }
  },
};

const stack = stackflow({
  transitionDuration: 350,
  activities,
  plugins: [
    () => authPlugin,
    basicRendererPlugin(),
    basicUIPlugin({
      theme: "cupertino",
    }),
    historySyncPlugin({
      routes: {
        A: "/",
        B: "/b",
        C: "/c",
        D: "/d",
        Login: "/login",
        Home: "/home",
        Product: "/product/:productId",
        Order: "/order",
        PaymentComplete: "/payment-complete",
        PopToTest: "/pop-to-test",
        Modal: "/modal",
        ErrorScreen: "/error",

        // Routes for new navigation test cases
        NavHomeScreen: "/nav-home",
        ListScreen: "/nav-list",
        DetailScreen: "/nav-detail/:id",
        Step1Screen: "/nav-step1",
        Step2Screen: "/nav-step2",
        Step3Screen: "/nav-step3",
        SuccessScreen: "/nav-success",

        // Routes for TC1
        TC1_HomeScreen: "/nav-tc1-home",
        TC1_Screen1: "/nav-tc1-screen1",
        TC1_Screen2: "/nav-tc1-screen2",

        // Routes for TC2
        TC2_ListScreen: "/nav-tc2-list",
        TC2_DetailScreen: "/nav-tc2-detail/:id",

        // Routes for TC3
        TC3_Step1Screen: "/nav-tc3-step1",
        TC3_Step2Screen: "/nav-tc3-step2",
        TC3_Step3Screen: "/nav-tc3-step3",

        // Routes for TC4
        MainTabs: "/nav-tc4-tabs",

        // Routes for TC5
        ArticleScreen: "/nav-tc5-article/:id",

        // Routes for TC6
        TC06_HomeScreen: "/nav-tc6-home",
        TC06_ModalScreen: "/nav-tc6-modal",

        // Routes for TC7
        TC07_HomeScreen: "/nav-tc7-home",
        TC07_LoginScreen: "/nav-tc7-login",
        TC07_ProfileScreen: "/nav-tc7-profile",
      },
      fallbackActivity: () => "NavHomeScreen",
      useHash: true,
    }),
  ],
  initialActivity: () => "NavHomeScreen",
});

export const { Stack } = stack;
export default stack;
