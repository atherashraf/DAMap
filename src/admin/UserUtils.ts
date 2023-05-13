import MapApi from "../ol-map/utils/MapApi";

export interface UserInfo{
    access: string
    refresh: string
    updatedTime: number
    userInfo: {
        email: string
        name: string
        groups: string[]
        isStaff: boolean
        isSuperUser: boolean
    }
}
class UserUtils{

    static saveUser(userInfo: UserInfo){
        if(!userInfo.updatedTime){
            Object.assign(userInfo, {updatedTime: (new Date()).getTime()})
            console.log(userInfo)
        }
        localStorage.setItem("da_info", JSON.stringify(userInfo))
    }
    static removeUser(){
        console.log("removing item")
        localStorage.removeItem("da_info")
    }
    static getUser(): UserInfo{
        const info = localStorage.getItem("da_info")
        return JSON.parse(info)
    }
    static async isLoggedIn(){
        const userInfo = this.getUser()
        // console.log(userInfo);
        if(userInfo) {
            const r = await this.getAccessToken()
            return !!r
        }else{
            return false
        }
    }
    static isUpdateAccessRequired(){
        try {
            const userInfo = this.getUser()
            if(userInfo) {
                const d: Date = new Date()
                console.log(userInfo?.updatedTime)
                const diff = Math.abs(d.getTime() - userInfo?.updatedTime)
                console.log(diff)
                return diff >= 60000 // true if differnce is more than a min
            }else{
                return true
            }
        }catch(e){
            return true
        }
    }
    static async getAccessToken(){
        const userInfo = this.getUser()
        if(userInfo) {
            if (this.isUpdateAccessRequired()) {
                const r = await MapApi.getAccessToken(userInfo.refresh)
                console.log("access", r)
                if (r) {
                    const u = Object.assign(userInfo, {access: r, updatedTime: (new Date()).getTime()})
                    this.saveUser(u)
                }
                return r
            } else {
                return userInfo.access
            }
        }else{
            return null
        }
    }

    static getUserName() {
        const userInfo = this.getUser()
        return userInfo && userInfo.userInfo.name
    }
    static getUserEmail() {
        const userInfo = this.getUser()
        return userInfo && userInfo.userInfo.email
    }
    static getUserGroups() {
        const userInfo = this.getUser()
        return userInfo && userInfo.userInfo.groups
    }
}

export default UserUtils
