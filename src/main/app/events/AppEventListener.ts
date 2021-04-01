import { on, reply } from "./helpers";

import { AddBmsHandler } from "../../../core/handlers/AddBmsHandler";
import { EventEmitterQueue } from "../../../core/adapters/Queue";
import { LocalDbBmsRepository } from "../../../core/repositories/BmsRepository";
import { LocalDbObservationRepository } from "../../../core/repositories/ObservationRepository";
import { LocalDbResourceRepository } from "../../../core/repositories/ResourceRepository";
import { MockSpecFetcher } from "../../../core/adapters/SpecFetcher";
import { Resource } from "../../../core/models/Resource";
import { mockBmsSpec } from "../../../__mock__/mocks";

const specFetcher = new MockSpecFetcher(mockBmsSpec);
const bmsRepository = new LocalDbBmsRepository();
const observationRepository = new LocalDbObservationRepository();
const resourceRepoisotry = new LocalDbResourceRepository();

const addBmsHandler = new AddBmsHandler(
  specFetcher,
  bmsRepository,
  observationRepository,
  resourceRepoisotry
);

export class AppEventListener {
  constructor(private resourceInstallationQueue: EventEmitterQueue<Resource>) {}

  public register = () => {
    on("requestAddBms", async (event, { specUrl }) => {
      const resources = await addBmsHandler.handle(specUrl);
      reply(event)("updateResources", { resources });
    });

    on("requestInstallResources", async (event, { resources }) => {
      resources.forEach((v) => {
        this.resourceInstallationQueue.put(v);
      });
    });
  };
}
