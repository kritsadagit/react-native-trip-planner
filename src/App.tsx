import React, { FC } from "react";
import AppNavigator from "./routes/AppNavigator";
import { PortalProvider } from "@gorhom/portal";
import { Text, TextInput, AppState } from "react-native";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import reducers from "./redux/reducers";
import thunk from "redux-thunk";
import logger from "redux-logger";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

(Text as any).defaultProps = {};
(Text as any).defaultProps.maxFontSizeMultiplier = 1;
(Text as any).defaultProps.allowFontScaling = false;

(TextInput as any).defaultProps = {};
(TextInput as any).defaultProps.maxFontSizeMultiplier = 1;
(TextInput as any).defaultProps.allowFontScaling = false;

const App: FC = () => {
  // AppState.addEventListener("change", async (nextAppState) => {
  //   if (nextAppState === "background") {
  //     await GoogleSignin.signOut();
  //   }
  // });

  return (
    <Provider
      store={configureStore({
        reducer: reducers,
        middleware: [thunk, logger],
      })}
    >
      <PortalProvider>
        <AppNavigator />
      </PortalProvider>
    </Provider>
  );
};

export default App;
