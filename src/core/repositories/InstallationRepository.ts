import { Installation, InstallationStatus } from "../models/Installation";

export interface InstallationRepository {
  list: (limit: number) => Promise<Installation[]>;

  fetchLatestForResource: (resourceId: number) => Promise<Installation | null>;

  create: (
    resourceId: number,
    status: InstallationStatus
  ) => Promise<Installation>;

  updateStatus: (id: number, status: InstallationStatus) => Promise<void>;
  delete: (id: number) => Promise<void>;
}
