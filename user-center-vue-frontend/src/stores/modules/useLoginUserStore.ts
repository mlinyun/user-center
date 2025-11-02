import { defineStore } from "pinia";
import { ref } from "vue";
import { getLoginUserInfo, userLogin, userLogout } from "@/api/user.ts";
import { BusinessCode } from "@/constants/request";

/**
 * 存储登录用户信息状态
 */
const useLoginUserStore = defineStore("loginUser", () => {
    const loginUser = ref<API.UserLoginVO>({
        userName: "未登录",
    });

    /**
     * 获取当前登录用户信息
     */
    async function fetchLoginUser() {
        try {
            const { data } = await getLoginUserInfo();
            if (data?.code === BusinessCode.SUCCESS && data.data) {
                loginUser.value = data.data;
                return true;
            }
            loginUser.value = {
                userName: "未登录",
            };
        } catch (error) {
            console.error("获取登录用户信息失败:", error);
            // 获取失败时设置为未登录状态
            loginUser.value = {
                userName: "未登录",
            };
        }
        return false;
    }

    /**
     * 用户登录
     * @param userAccount 用户账号
     * @param userPassword 用户密码
     */
    async function doLogin(userAccount: string, userPassword: string) {
        try {
            const { data } = await userLogin({
                userAccount,
                userPassword,
            });
            if (data?.code === BusinessCode.SUCCESS && data.data) {
                loginUser.value = data.data;
                return true;
            }
        } catch (error) {
            console.error("登录失败:", error);
        }
        return false;
    }

    /**
     * 用户登出
     */
    async function doLogout() {
        try {
            const { data } = await userLogout();
            if (data?.code === BusinessCode.SUCCESS) {
                loginUser.value = {
                    userName: "未登录",
                };
                return true;
            }
        } catch (error) {
            console.error("登出失败:", error);
        }
        return false;
    }

    /**
     * 设置登录用户信息
     * @param newLoginUser 用户登录信息
     */
    function setLoginUser(newLoginUser: API.UserLoginVO) {
        loginUser.value = newLoginUser;
    }

    return {
        loginUser,
        fetchLoginUser,
        doLogin,
        doLogout,
        setLoginUser,
    };
});

export default useLoginUserStore;
