import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const appName = "clinic-managed-users";
const secondaryApp = getApps().some((app) => app.name === appName)
  ? getApp(appName)
  : initializeApp(getApp().options, appName);

export const secondaryAuth = getAuth(secondaryApp);
