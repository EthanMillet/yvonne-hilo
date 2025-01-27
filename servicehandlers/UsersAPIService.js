import { CommonAPIService } from "src/servicehandlers/CommonHandler";

export class UsersAPIService {
  constructor() {
    this.CommonAPIService = new CommonAPIService();
  }

  get(router) {
    const url = "/api/users";
    return this.CommonAPIService.getCall(url, "", router);
  }

  create(params, router) {
    const url = "/api/users";
    return this.CommonAPIService.postCall(url, params, router);
  }

  checkUsername(username, router) {
    const url = `/api/users/${username}/check`;
    return this.CommonAPIService.getCall(url, "", router);
  }

  registerUser(authGroupId, params, router) {
    const url = `/api/users/${authGroupId}/register`;
    return this.CommonAPIService.postCall(url, params, router);
  }

  validateUser(link, router) {
    const url = `/api/users/${link}/verify`;
    return this.CommonAPIService.getCall(url, "", router);
  }

  delete(id, router) {
    const url = `/api/users/${id}`;
    return this.CommonAPIService.deleteCall(url, null, router);
  }

  getById(userId, router) {
    const url = `/api/users/${userId}`;
    return this.CommonAPIService.getCall(url, "", router);
  }

  getOnboardingById(userId, onboardingKey, router) {
    const url = `/api/users/onboarding/${userId}/${onboardingKey}`;
    return this.CommonAPIService.getCall(url, "", router);
  }

  getGenders(router) {
    const url = "/api/users/genders";
    return this.CommonAPIService.getCall(url, "", router);
  }

  getUserTypes(router) {
    const url = "/api/users/types";
    return this.CommonAPIService.getCall(url, "", router);
  }

  getUserStatusList(router) {
    const url = "/api/users/status";
    return this.CommonAPIService.getCall(url, "", router);
  }

  update(userId, formData) {
    const url = `/api/users/${userId}`;
    return this.CommonAPIService.newFileCall(url, formData);
  }

  updateOnboarding(userId, formData) {
    const url = `/api/users/onboarding/${userId}`;
    return this.CommonAPIService.newFileCall(url, formData);
  }

  getUserWithAuthGroups(userId, router) {
    const url = `/api/users/${userId}/authgroups`;
    return this.CommonAPIService.getCall(url, "", router);
  }

  getCardPunchesForUser(data, router) {
    const url = "/api/cardPunches/user";
    return this.CommonAPIService.postCall(url, data, router);
  }
}
export default UsersAPIService;
