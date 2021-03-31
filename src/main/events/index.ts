import { on, reply } from "./helpers";

import { AddBmsHandler } from "../../core/handlers/AddBmsHandler";
import { LocalDbBmsRepository } from "../../core/repositories/BmsRepository";
import { LocalDbObservationRepository } from "../../core/repositories/ObservationRepository";
import { LocalDbResourceRepository } from "../../core/repositories/ResourceRepository";
import { MockSpecFetcher } from "../../core/adapters/SpecFetcher";
import { mockBmsSpec } from "../../__mock__/mocks";

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

on("addBms", async (event, { specUrl }) => {
  const resources = await addBmsHandler.handle(specUrl);
  reply(event)("updateResources", { resources });
});
