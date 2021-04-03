export interface InstallationProposalAttrs {
  id: number;
  resourceId: number;
  updatedAt?: Date;
}

export class InstallationProposal implements InstallationProposalAttrs {
  public id: number;
  public resourceId: number;
  public updatedAt?: Date;

  constructor(attrs: InstallationProposalAttrs) {
    this.id = attrs.id;
    this.resourceId = attrs.resourceId;
    this.updatedAt = attrs.updatedAt;
  }
}
