import { FormikConfig, useFormik } from "formik";
type CoreResourceSelectionMethod = "first" | "latest";

export interface PreferencesInput {
  installationDist: string;

  coreResourceSelectionMethod: CoreResourceSelectionMethod;
  installsPatchResources: boolean;
  installsAdditionalResources: boolean;

  downloadUnsupportedDomains: string;

  identicalDomainsList: string;

  intervalMin: number;
  launchOnStartup: boolean;
}

const fmk = (config: FormikConfig<PreferencesInput>) =>
  useFormik<PreferencesInput>(config);
export type FormikType = ReturnType<typeof fmk>;
