import { context, u128 } from "near-sdk-as";

export const DEFAULT_PROJECT_STATUS = ProjectStatus.WAITING_FOR_OFFER;

/**
 * Stores a single bid which then stores the history of ownership
 */
@nearBindgen
export class Bid {
  // Bid id
  id: u64

  // User's addresss
  user: string

  // Index of the block
  blockIndex: u64

  // Amount of payed tokens in that particular bid
  payedTokens: u128

  constructor(user: string, blockIndex: u64, payedTokens: u128, bidId: u64) {
    this.user = user;
    this.blockIndex = blockIndex;
    this.payedTokens = payedTokens;
    this.id = bidId;
  }
}

/**
 * Enum of different status of the project
 */
export const enum ProjectStatus {
  // Offers for the project from the contractor
  WAITING_FOR_OFFER = 1,

  // Project financing state
  WAITING_FOR_FINANCING = 2,

  // Until project is finished
  WAITING_FOR_FINISHED_PROJECT = 3,

  // Project is finished
  DONE = 4
}

/**
 * Stores the status history
 */
@nearBindgen
export class StatusHistory {
  status: ProjectStatus
  blockIndex: u64

  constructor(status: ProjectStatus, blockIndex: u64) {
    this.blockIndex = blockIndex
    this.status = status
  }
}

/**
 * Represents a single offer (from contractor) that contains the bids from the users; the first offer that reaches a fully financed state wins.
 */
@nearBindgen
export class Offer {
  // Unique offer ID
  id: u64;

  // Total price estimated by the contractor
  price: u128;

  // Timestamp until date should be finished
  finishDate: u64;

  // Address of the contractor
  contractor: string;

  // All the bids
  bids: Array<Bid>;

  constructor(id: u64, price: u128, finishDate: u64, contractor: string) {
    this.bids = new Array<Bid>();
    this.id = id;
    this.price = price;
    this.finishDate = finishDate;
    this.contractor = contractor;
  }
}

/**
 * Represents each individual project
 */
@nearBindgen
export class Project {
  /**
   * This should later on be extended or even stored off-chain (in case of images or other bigger documents)
   * Only represents the most important information, but for this prototype it should be sufficient
   */
  // Area in square metres
  area: u64;

  // name of the street and house number
  location: string;

  // Postal code
  postCode: string;

  // Project name
  name: string;

  // IPFS reference
  // reference: string

  // Stores the history of status (latest entry [ordered by blockIndex] is the current status)
  statusHistory: Array<StatusHistory>;

  // Stores offers
  offers: Array<Offer>

  // Creator address
  creator: string;

  // projectId
  id: u64;

  constructor(area: u64, location: string, postCode: string, name: string, id: u64, blockIndex: u64 = context.blockIndex) {
    this.area = area;
    this.location = location;
    this.postCode = postCode;
    this.name = name;
    this.statusHistory = new Array<StatusHistory>();
    this.statusHistory.push(new StatusHistory(DEFAULT_PROJECT_STATUS, blockIndex));
    this.offers = new Array<Offer>();
    this.creator = context.sender;
    this.id = id;
  }
}
