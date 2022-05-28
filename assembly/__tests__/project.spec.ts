import {
  _getCurrentProjectStatus,
  _getNewId,
  _upsertUserProject, createBid,
  createOffer,
  createProject, getOffers, getProjects, offerMapping,
  PROJECT_ID_COUNTER_STORAGE_KEY, projectIds,
  projectMapping,
  userProjectMapping
} from '../main'
import { logging, storage, u128, VMContext } from 'near-sdk-as'
import { DEFAULT_PROJECT_STATUS, Offer, Project, ProjectStatus, StatusHistory } from '../model'

describe('project', () => {

  describe('_getNewId', () => {
    beforeEach(() => {
      storage.set(PROJECT_ID_COUNTER_STORAGE_KEY, 1)
    })
    it('should generate a new id', () => {
      const id = _getNewId()
      expect(id).toStrictEqual(2, 'id should be 2')
    })
    it('should use default value of 1 if not set', () => {
      storage.delete(PROJECT_ID_COUNTER_STORAGE_KEY)
      const id = _getNewId()
      expect(id).toStrictEqual(1, 'id should be 1 if empty')
    })
    it('should match the state in the chain', () => {
      const id = _getNewId()
      expect(id).toStrictEqual(2, 'id should be 2')
      const chainState = storage.getPrimitive<u64>(PROJECT_ID_COUNTER_STORAGE_KEY, -1)
      expect(chainState).toStrictEqual(id, 'chain state MUST match returned ID')
    })
  })

  describe('_upsertUserProject',  () => {
    const userAddress = 'cheapesttests.testnet'
    const projectId = 1
    beforeEach(() => {
      userProjectMapping.delete(userAddress)
    })
    it('should add project if not exists in list and return true', () => {
      const result = _upsertUserProject(userAddress, projectId)
      expect(result).toStrictEqual(true, 'Should return true if inserted')

      const res = userProjectMapping.get(userAddress)
      expect(res).not.toBe(null, 'state should match chain')
      if (res == null) {
        expect(true).toStrictEqual(false, 'ERROR in testcase should not happen')
        return
      }

      expect(res.length).toStrictEqual(1, 'array length on chain should be 1')
      expect(res[0]).toStrictEqual(projectId, 'state must match projectId')
    })
    it('should return false if project already added and should not add', () => {
      const arr = new Array<u64>();
      arr.push(projectId)
      userProjectMapping.set(userAddress, arr)

      const result = _upsertUserProject(userAddress, projectId)
      expect(result).toStrictEqual(false, 'should not add to arr')

      const res = userProjectMapping.get(userAddress)
      if (res === null) {
        expect(true).toStrictEqual(false, 'Should not happen - deleted entry')
        return
      }
      expect(res.length).toStrictEqual(1, 'should not add to chain arr')
      expect(res[0]).toStrictEqual(projectId)
    })
    it('should also add if multiple projects exist', () => {
      const arr = new Array<u64>();
      arr.push(42);
      userProjectMapping.set(userAddress, arr)

      const result = _upsertUserProject(userAddress, projectId)
      expect(result).toStrictEqual(true, 'should add to array')


      const res = userProjectMapping.get(userAddress)
      if (res === null) {
        expect(true).toStrictEqual(false, 'Should not happen - deleted entry')
        return
      }
      expect(res.length).toStrictEqual(2, 'should not add to chain arr')
      expect(res).toIncludeEqual(42, 'should have previous entry')
      expect(res).toIncludeEqual(projectId, 'should have added entry')
    })
  })

  describe('createProject', () => {
    beforeEach(() => {
      storage.delete(PROJECT_ID_COUNTER_STORAGE_KEY)
      projectMapping.delete(1)
    })
    it('should create a new project', () => {
      const userAddress = 'cheapesttests.testnet'
      VMContext.setSigner_account_id(userAddress)
      const projectId = createProject(25, 'Testing', 'TestingPost', 'TestingName')
      expect(projectId).toStrictEqual(1, 'Project id should be 1')

      const chainProject = projectMapping.get(projectId, null)
      if (chainProject === null) {
        expect(false).toStrictEqual(true, 'Project should not be null')
        return
      }
      expect(chainProject).toBeTruthy()
      expect(chainProject.id).toStrictEqual(projectId, 'should match projectId')
      expect(chainProject.creator).toStrictEqual(userAddress, 'should match context.sender')
      expect(chainProject.area).toStrictEqual(25, 'Area should be 25')
      expect(chainProject.postCode).toStrictEqual('TestingPost', 'post code should match')
      expect(chainProject.location).toStrictEqual('Testing', 'location should match')
      expect(chainProject.name).toStrictEqual('TestingName', 'name should match')
      expect(chainProject.statusHistory.length).toStrictEqual(1, 'statusHistory should be empty')
      expect(chainProject.statusHistory[0].status).toStrictEqual(DEFAULT_PROJECT_STATUS, 'status should be default')
    })
  })

  describe('_getCurrentProjectStatus', () => {
    const projectId = 1
    const DEFAULT_BLOCK_INDEX = 1
    const username = 'cheaptest.testnet'
    beforeEach(() => {
      projectMapping.set(projectId, new Project(25, 'test', 'test', 'test', projectId, DEFAULT_BLOCK_INDEX))
    })
    it('should return the default status of the project', () => {
      const project = projectMapping.get(projectId)
      if (project === null) {
        expect(true).toStrictEqual(false, 'Invalid test case setup')
        return
      }
      const currentStatus = _getCurrentProjectStatus(project)
      expect(currentStatus).toStrictEqual(DEFAULT_PROJECT_STATUS, 'should match default status')
    })
    it('should return the status with the highest blockIndex', () => {
      const project = projectMapping.get(projectId)
      if (project === null || project.statusHistory.length === 0) {
        expect(true).toStrictEqual(false, 'Invalid test case setup')
        return
      }
      const statusHistory = project.statusHistory
      statusHistory.push(new StatusHistory(ProjectStatus.WAITING_FOR_FINANCING, DEFAULT_BLOCK_INDEX + 1))
      project.statusHistory = statusHistory

      const currentStatus = _getCurrentProjectStatus(project)
      expect(currentStatus).toStrictEqual(ProjectStatus.WAITING_FOR_FINANCING, 'should match status with highest blockIndex')
    })
    it('should return status with the highest blockIndex even if there are multiple states', () => {
      const project = projectMapping.get(projectId)
      if (project === null || project.statusHistory.length === 0) {
        expect(true).toStrictEqual(false, 'Invalid test case setup')
        return
      }
      const statusHistory = project.statusHistory
      statusHistory.push(new StatusHistory(ProjectStatus.WAITING_FOR_FINANCING, DEFAULT_BLOCK_INDEX + 1))
      statusHistory.push(new StatusHistory(ProjectStatus.DONE, DEFAULT_BLOCK_INDEX + 2))
      project.statusHistory = statusHistory

      const currentStatus = _getCurrentProjectStatus(project)
      expect(currentStatus).toStrictEqual(ProjectStatus.DONE, 'should match status with highest blockIndex')
    })
  })

  describe('createOffer', () => {
    const projectId = 1
    const DEFAULT_BLOCK_INDEX = 1
    beforeEach(() => {
      projectMapping.set(projectId, new Project(25, 'test', 'test', 'test', projectId, DEFAULT_BLOCK_INDEX))
      offerMapping.set(projectId, new Array<Offer>())
      storage.set<u64>(PROJECT_ID_COUNTER_STORAGE_KEY, 1)
    })
    it('should create an offer', () => {
      const offer = new Offer(1, u128.One, 67, 'test')
      expect(offer.id).toStrictEqual(1)
      expect(offer.price).toStrictEqual(u128.One)
      expect(offer.finishDate).toStrictEqual(67)
      expect(offer.contractor).toStrictEqual('test')
      const offerArray = new Array<Offer>();
      offerArray.push(offer)
      expect(offerArray.length).toStrictEqual(1)
      expect(offerArray[0].id).toStrictEqual(1)
    })
    it('should create a new offer', () => {
      const offerId = createOffer(projectId, u128.One, 68)
      expect(offerId).toBeTruthy()
      expect(offerId).toStrictEqual(2, 'offer Id should be 2')
    })
    it('should add the offer', () => {
      const offerId = createOffer(projectId, u128.One, 6868)
      expect(offerId).toStrictEqual(2, 'offer Id should be 2')

      const offers = getOffers(projectId)
      if (offers === null) {
        expect(true).toStrictEqual(false, 'Should not happen - deleted entry')
        return
      }
      expect(offers.length).toStrictEqual(1, 'should have one offer')
    })
    it('should update the statusHistory correctly', () => {
      const offerId = createOffer(projectId, u128.One, 68)

      const project = projectMapping.get(projectId)
      if (project == null) {
        expect(true).toStrictEqual(false, 'ERROR in getting project')
        return
      }
      expect(project.statusHistory.length).toStrictEqual(2)
      for (let i: i32 = 0; i < project.statusHistory.length; i++) {
        const status = project.statusHistory[i]
        expect(status.status === ProjectStatus.WAITING_FOR_OFFER || status.status === ProjectStatus.WAITING_FOR_FINANCING).toBeTruthy()
      }
    })
    it('should only work if the project is in the correct status', () => {
      const project = projectMapping.get(projectId)
      if (project == null) {
        expect(true).toStrictEqual(false, 'ERROR in getting project')
        return
      }
      project.statusHistory.push(new StatusHistory(ProjectStatus.DONE, DEFAULT_BLOCK_INDEX + 1))
      projectMapping.set(projectId, project)

      const offerId = createOffer(projectId, u128.One, 68)
      expect(offerId).toStrictEqual(0)
    })
    it('should not create an offer if the project is not in the correct status', () => {
      const project = projectMapping.get(projectId)
      if (project == null) {
        expect(true).toStrictEqual(false, 'ERROR in getting project')
        return
      }
      project.statusHistory.push(new StatusHistory(ProjectStatus.DONE, DEFAULT_BLOCK_INDEX + 1))
      projectMapping.set(projectId, project)

      const offerId = createOffer(projectId, u128.One, 68)
      expect(offerId).toStrictEqual(0)
    })
  })

  describe('createBid', () => {
    const projectId = 1;
    const offerId = 2;
    const tester = 'cheapnear.test'
    beforeEach(() => {
      projectMapping.delete(projectId)
      const project = new Project(25, 'test', 'test', 'test', projectId, 1)
      // project.offers.push(new Offer(offerId, u128.One, 68, tester))
      const offers = new Array<Offer>()
      offers.push(new Offer(offerId, u128.One, 68, tester))
      offerMapping.set(projectId, offers)

      projectMapping.set(projectId, project)
      storage.set<u64>(PROJECT_ID_COUNTER_STORAGE_KEY, 2)
    })
    it('Should the status to "WAITING_FOR_FINISHED_PROJECT" when fully funded', () => {
      VMContext.setAttached_deposit(new u128(10000))
      const bidId = createBid(projectId, offerId)
      expect(bidId).toStrictEqual(3)

      const project = projectMapping.get(projectId)
      if (project == null) {
        expect(true).toStrictEqual(false, 'ERROR in getting project')
        return
      }
      expect(project.statusHistory.length).toStrictEqual(2)
      for (let i: i32 = 0; i < project.statusHistory.length; i++) {
        const status = project.statusHistory[i]
        expect(status.status === ProjectStatus.DONE || status.status === ProjectStatus.WAITING_FOR_OFFER).toBeTruthy()
      }
    })
  })
})