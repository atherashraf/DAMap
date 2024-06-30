import MapApi from "../ol-map/utils/MapApi";

export interface UserInfo {
  accessToken: string;
  refreshToken: string;
  updatedTime: number;
  userInfo: {
    email: string;
    name: string;
    groups: string[];
    isStaff: boolean;
    isSuperUser: boolean;
  };
}
const AccessExpireTime: number = 30 * 60 * 1000;
class UserUtils {
  static saveUser(userInfo: UserInfo) {
    if (!userInfo.updatedTime) {
      Object.assign(userInfo, { updatedTime: new Date().getTime() });
    }
    localStorage.setItem("da_info", JSON.stringify(userInfo));
  }
  static removeUser() {
    localStorage.removeItem("da_info");
  }
  static getUser(): UserInfo {
    const info = localStorage.getItem("da_info") || null;
    return info && JSON.parse(info);
  }
  static async isLoggedIn() {
    const userInfo = this.getUser();
    if (userInfo) {
      const r = await this.getAccessToken();
      return !!r;
    } else {
      return false;
    }
  }
  static isUpdateAccessRequired(): boolean {
    try {
      const userInfo = this.getUser();
      if (userInfo) {
        const d: Date = new Date();
        const diff = Math.abs(d.getTime() - userInfo?.updatedTime);
        return diff >= AccessExpireTime; // true if differnce is more than a min
      } else {
        return true;
      }
    } catch (e) {
      return true;
    }
  }
  static async getAccessToken() {
    const userInfo = this.getUser();
    if (userInfo) {
      if (this.isUpdateAccessRequired()) {
        const r = await MapApi.getAccessToken(userInfo.refreshToken);

        if (r) {
          const u = Object.assign(userInfo, {
            access: r,
            updatedTime: new Date().getTime(),
          });
          this.saveUser(u);
        }
        return r;
      } else {

        return userInfo.accessToken;
      }
    } else {
      return null;
    }
  }

  static getUserName() {
    const userInfo = this.getUser();
    return userInfo && userInfo.userInfo.name;
  }
  static getUserEmail() {
    const userInfo = this.getUser();
    return userInfo && userInfo.userInfo.email;
  }
  static getUserGroups() {
    const userInfo = this.getUser();
    return userInfo && userInfo.userInfo.groups;
  }
}

export default UserUtils;
