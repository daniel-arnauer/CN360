import { Bid, messages, Offer, PostedMessage, Project, ProjectStatus, StatusHistory } from './model'
import { context, logging, PersistentMap, PersistentVector, storage, u128 } from 'near-sdk-as'

// --- contract code goes below

// The maximum number of latest messages the contract returns.
const MESSAGE_LIMIT = 10;

export const CONTRACT_STORAGE_KEY = 'CHEAPEST_NEIGHBOR_CONTRACT'
export const PROJECT_ID_COUNTER_STORAGE_KEY = 'PROJECT_ID_COUNTER'


// Stores the projects
export const projectMapping = new PersistentMap<u64, Project>('project')

// Stores all the users which have an interaction with a project
export const userProjectMapping = new PersistentMap<string, Array<u64>>('user_project')

// Stores all project Ids
export const projectIds = new PersistentVector<u64>('project_ids')


/**
 * Generates a new project ID (counter)
 */
export function _getNewId(): u64 {
  const currentId = storage.getPrimitive<u64>(PROJECT_ID_COUNTER_STORAGE_KEY, 0)
  const newId = currentId + 1
  storage.set<u64>(PROJECT_ID_COUNTER_STORAGE_KEY, newId);
  return newId
}

/**
 * Upserts user to project
 * @return: Whether or not the value was inserted
 */
export function _upsertUserProject(userAddress: string, projectId: u64): boolean {
  let currentEntry = userProjectMapping.get(userAddress);
  if (currentEntry === null) {
    currentEntry = new Array<u64>();
  }
  for (let i: i32 = 0; i < currentEntry.length; i++) {
    if (currentEntry[i] === projectId) {
      return false
    }
  }
  currentEntry.push(projectId)
  userProjectMapping.set(userAddress, currentEntry)
  return true
}


/**
 * Create a new project, update user map
 * @return: id of the newly created project
 */
export function createProject(area: u64, location: string, postCode: string, name: string): u64 {
  // Input validation
  assert(area > 0, 'Area must be greater than 0')
  assert(location.length > 0, 'Location cannot be empty')
  assert(postCode.length > 0, 'Post Code cannot be empty')
  assert(name.length > 0, 'Name cannot be empty')

  // Create the new project
  const projectId = _getNewId()
  const newProject = new Project(area, location, postCode, name, projectId)
  projectMapping.set(projectId, newProject)

  // Update stake in project
  _upsertUserProject(context.sender, projectId)

  // Add project id to project ids
  projectIds.push(projectId)

  return projectId
}

/**
 * Creates a new offer for a project
 * @return: id of the newly created offer
 */
export function createOffer(projectId: u64, price: u128, finishDate: u64): u64 {
  // Input validation
  assert(price > u128.Zero, 'Price must be greater than 0')

  // Get the project
  const project = projectMapping.get(projectId)
  if (project === null) {
    logging.log('Project does not exist')
    return 0
  }

  // Check status
  const currentProjectStatus = _getCurrentProjectStatus(project)
  // For now both are okay: later on be more strict with state
  if (!(currentProjectStatus === ProjectStatus.WAITING_FOR_OFFER || currentProjectStatus === ProjectStatus.WAITING_FOR_FINANCING)) {
    return 0
  }

  // Create the new offer
  const offerId = _getNewId()

  // Append offer to mapping
  project.offers.push(new Offer(offerId, price, finishDate, context.sender))

  // Add status
  project.statusHistory.push(new StatusHistory(ProjectStatus.WAITING_FOR_FINANCING, context.blockIndex))

  // Save
  projectMapping.set(projectId, project)

  // Update stake in project
  _upsertUserProject(context.sender, projectId)

  return offerId
}


/**
 * Returns all user's available projects (requires filtering etc.)
 * @Todo: implement filtering etc.
 * @return: Array of projects
 */
export function getUserProjects(): Array<Project> {
  const userProjects = userProjectMapping.get(context.sender)
  if (userProjects === null || userProjects.length === 0) {
    return new Array<Project>()
  }
  const projects = new Array<Project>()
  for (let i: i32 = 0; i < userProjects.length; i++) {
    const project = projectMapping.get(userProjects[i])
    if (project !== null) {
      projects.push(project)
    }
  }
  return projects
}

/**
 * Create a new bid
 * @return: id of the newly created bid
 */
export function createBid(projectId: u64, offerId: u64): u64 {
  assert(context.attachedDeposit > u128.Zero, 'Deposit must be greater than 0')
  // Project
  const project = projectMapping.get(projectId)
  if (project === null) {
    logging.log('Project does not exist')
    return 0
  }

  // Find offer
  if (project.offers.length === 0) {
    logging.log('No offers for project')
    return 0
  }
  const status = _getCurrentProjectStatus(project)
  if (status !== ProjectStatus.WAITING_FOR_FINANCING) {
    logging.log('Project is not in waiting for financing state')
    return 0
  }

  let idx: i32 = -1
  for (let i: i32 = 0; i < project.offers.length; i++) {
    if (project.offers[i].id === offerId) {
      idx = i
      break
    }
  }
  if (idx === -1) {
    logging.log('Offer does not exist')
    return 0
  }

  // Bid status
  let currentlyFunded: u128 = u128.Zero
  for (let i: i32 = 0; i < project.offers[idx].bids.length; i++) {
    currentlyFunded = u128.add(currentlyFunded, project.offers[idx].bids[i].payedTokens)
  }
  // Currently funded
  // Not fully funded yet
  const missingFunds = u128.sub(project.offers[idx].price, currentlyFunded)
  let thisBid: u128 = context.attachedDeposit
  // Fully funded
  if (thisBid >= missingFunds) {
    // Project is fully funded
    project.statusHistory.push(new StatusHistory(ProjectStatus.DONE, context.blockIndex))

    // Project mapping
    thisBid = missingFunds
  }

  const bidId = _getNewId()
  const bid = new Bid(context.sender, context.blockIndex, thisBid, bidId)
  project.offers[idx].bids.push(bid)

  // Save
  projectMapping.set(projectId, project)

  return bidId
}

/**
 * Get all available projects
 * @Todo: implement filtering
 * @return: Array of projects
 */
export function getProjects(): Array<Project> {
  const projects = new Array<Project>();
  // Empty array
  if (projectIds.length === 0) {
    return projects
  }
  // Resolve all projects
  for (let i: i32 = 0; i < projectIds.length; i++) {
    const project = projectMapping.get(projectIds[i])
    if (project !== null) {
      projects.push(project)
    }
  }
  return projects
}


/**
 * Returns the current status of the project
 * @param project
 * @return: current status of the project - ProjectStatus
 */
export function _getCurrentProjectStatus(project: Project): ProjectStatus {
  assert(project != null && project.statusHistory.length > 0, 'Project cannot be null and statusHistory not empty')

  let idx: i32 = 0
  for (let i: i32 = 0; i < project.statusHistory.length; i++) {
    if (project.statusHistory[i].blockIndex > project.statusHistory[idx].blockIndex) {
      idx = i
    }
  }
  return project.statusHistory[idx].status
}



/**
 * Adds a new message under the name of the sender's account id.\
 * NOTE: This is a change method. Which means it will modify the state.\
 * But right now we don't distinguish them with annotations yet.
 */
export function addMessage(text: string): void {
  // Creating a new message and populating fields with our data
  const message = new PostedMessage(text);
  // Adding the message to end of the persistent collection
  messages.push(message);
}

/**
 * Returns an array of last N messages.\
 * NOTE: This is a view method. Which means it should NOT modify the state.
 */
export function getMessages(): PostedMessage[] {
  const numMessages = min(MESSAGE_LIMIT, messages.length);
  const startIndex = messages.length - numMessages;
  const result = new Array<PostedMessage>(numMessages);
  for(let i = 0; i < numMessages; i++) {
    result[i] = messages[i + startIndex];
  }
  return result;
}
