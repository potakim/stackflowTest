import { stackflow } from "@stackflow/react";
import { basicRendererPlugin } from "@stackflow/plugin-renderer-basic";
import { historySyncPlugin } from "@stackflow/plugin-history-sync";
import { basicUIPlugin } from "@stackflow/plugin-basic-ui";
import * as screens from "../components/screens";
import * as navScreens from "../components/navigation_screens";

const allActivities = {
  ...screens,
  ...navScreens,
  TC1_HomeScreen: navScreens.TC1_HomeScreen,
  TC1_Screen1: navScreens.TC1_Screen1,
  TC1_Screen2: navScreens.TC1_Screen2,
};

const stack = stackflow({
  transitionDuration: 350,
  activities: allActivities,
  plugins: [
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
      },
      fallbackActivity: () => "A",
      useHash: true,
    }),
  ],
  initialActivity: () => "A",
});

export const { Stack, useFlow } = stack;
export default stack;
