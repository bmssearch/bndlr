import ExtensibleCustomError from "extensible-custom-error";

export class RequestError extends ExtensibleCustomError {}
export class ManifestInvalidError extends ExtensibleCustomError {}
export class DestinationNotFoundError extends ExtensibleCustomError {}
