import { defineStore } from "pinia";
import { ref } from "vue";
import { getLoginUserInfo, userLogin, userLogout } from "@/api/user.ts";

/**
 * 登录用户状态管理 Store
 *
 * 存储和管理登录用户信息的状态
 * API 返回的是 BaseResponse 完整响应体，包含 data 字段为实际数据
 */
const useLoginUserStore = defineStore("loginUser", () => {
    /**
     * 登录用户信息
     * 初始值：未登录状态
     */
    const loginUser = ref<API.UserLoginVO>({
        userName: "未登录",
    });

    /**
     * 获取当前登录用户信息
     *
     * 调用后端 API 获取当前登录的用户详细信息
     * API 返回 BaseResponseUserLoginVO，需要从 data 字段提取实际用户信息
     *
     * @returns {boolean} 获取成功返回 true，失败返回 false
     */
    async function fetchLoginUser(): Promise<boolean> {
        try {
            // API 返回 BaseResponseUserLoginVO，需要获取 data 字段
            const response = await getLoginUserInfo();

            // 检查响应的 data 字段中是否有有效的用户信息
            if (response?.data && response.data.id) {
                loginUser.value = response.data;
                return true;
            }

            // 无效的用户信息，设置为未登录状态
            loginUser.value = {
                userName: "未登录",
            };
            return false;
        } catch (error) {
            console.error("获取登录用户信息失败:", error);
            // 获取失败时设置为未登录状态
            loginUser.value = {
                userName: "未登录",
            };
            return false;
        }
    }

    /**
     * 用户登录
     *
     * 使用账号密码进行登录
     * API 返回 BaseResponseUserLoginVO，需要从 data 字段提取实际用户信息
     *
     * @param {string} userAccount - 用户账号
     * @param {string} userPassword - 用户密码
     * @returns {boolean} 登录成功返回 true，失败返回 false
     */
    async function doLogin(userAccount: string, userPassword: string): Promise<boolean> {
        try {
            // API 返回 BaseResponseUserLoginVO，需要获取 data 字段
            const response = await userLogin({
                userAccount,
                userPassword,
            });

            // 检查响应的 data 字段中是否有有效的用户信息
            if (response?.data && response.data.id) {
                loginUser.value = response.data;
                return true;
            }

            return false;
        } catch (error) {
            console.error("登录失败:", error);
            return false;
        }
    }

    /**
     * 用户登出
     *
     * 退出登录，清除用户会话
     * API 返回 BaseResponseBoolean，需要从 data 字段提取操作结果
     *
     * @returns {boolean} 登出成功返回 true，失败返回 false
     */
    async function doLogout(): Promise<boolean> {
        try {
            // API 返回 BaseResponseBoolean，需要获取 data 字段
            const response = await userLogout();

            // 检查响应的 data 字段中的操作结果
            if (response?.data === true) {
                // 清除用户信息
                loginUser.value = {
                    userName: "未登录",
                };
                return true;
            }

            return false;
        } catch (error) {
            console.error("登出失败:", error);
            return false;
        }
    }

    /**
     * 设置登录用户信息
     *
     * 手动设置登录用户信息（通常在同步状态时使用）
     *
     * @param {API.UserLoginVO} newLoginUser - 新的用户登录信息
     */
    function setLoginUser(newLoginUser: API.UserLoginVO): void {
        loginUser.value = newLoginUser;
    }

    /**
     * 清除登录用户信息
     *
     * 将用户状态设置为未登录
     */
    function clearLoginUser(): void {
        loginUser.value = {
            userName: "未登录",
        };
    }

    /**
     * 检查用户是否已登录
     *
     * @returns {boolean} 用户已登录返回 true，否则返回 false
     */
    function isLoggedIn(): boolean {
        return loginUser.value.id != null && loginUser.value.id !== undefined;
    }

    return {
        // 状态
        loginUser,

        // 方法
        fetchLoginUser,
        doLogin,
        doLogout,
        setLoginUser,
        clearLoginUser,
        isLoggedIn,
    };
});

export default useLoginUserStore;
