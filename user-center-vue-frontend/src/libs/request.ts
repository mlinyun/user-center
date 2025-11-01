import axios, {
    type AxiosInstance,
    type AxiosRequestConfig,
    type AxiosResponse,
    type AxiosError,
    type InternalAxiosRequestConfig,
} from "axios";
import { message, notification } from "ant-design-vue";

/**
 * 业务状态码枚举
 * 与后端 ResultCodeEnum 保持一致
 */
export enum BusinessCode {
    /** 成功 */
    SUCCESS = 20000,
    /** 请求参数错误 */
    PARAM_ERROR = 40000,
    /** 未登录 */
    NOT_LOGIN = 40100,
    /** 无权限 */
    NO_AUTH = 40101,
    /** 禁止访问 */
    FORBIDDEN = 40300,
    /** 资源不存在 */
    NOT_FOUND = 40400,
    /** 服务器内部错误 */
    SERVER_ERROR = 50000,
    /** 操作失败 */
    OPERATION_ERROR = 50001,
}

/**
 * 错误展示类型枚举
 */
enum ErrorShowType {
    /** 静默处理，不展示错误 */
    SILENT = 0,
    /** 警告提示消息 */
    WARN_MESSAGE = 1,
    /** 错误提示消息 */
    ERROR_MESSAGE = 2,
    /** 通知提示 */
    NOTIFICATION = 3,
    /** 页面跳转 */
    REDIRECT = 9,
}

/**
 * 业务错误类
 */
class BusinessError extends Error {
    /** 错误名称 */
    name = "BusinessError";
    /** 业务状态码 */
    code: number;
    /** 错误展示类型 */
    showType: ErrorShowType;
    /** 响应数据 */
    data?: unknown;

    constructor(code: number, message: string, showType: ErrorShowType, data?: unknown) {
        super(message);
        this.code = code;
        this.showType = showType;
        this.data = data;
    }
}

/**
 * 扩展的 Axios 请求配置
 */
interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
    /** 是否跳过错误处理 */
    skipErrorHandler?: boolean;
    /** 自定义错误展示类型 */
    errorShowType?: ErrorShowType;
}

/**
 * 根据业务状态码获取错误展示类型
 * @param code 业务状态码
 * @returns 错误展示类型
 */
const getErrorShowType = (code: number): ErrorShowType => {
    // 客户端错误使用错误消息
    if (code >= 40000 && code < 50000) {
        // 未登录需要重定向
        if (code === BusinessCode.NOT_LOGIN) {
            return ErrorShowType.REDIRECT;
        }
        // 无权限使用通知
        if (code === BusinessCode.NO_AUTH) {
            return ErrorShowType.NOTIFICATION;
        }
        return ErrorShowType.ERROR_MESSAGE;
    }
    // 服务器错误使用通知
    if (code >= 50000) {
        return ErrorShowType.NOTIFICATION;
    }
    // 其他情况使用错误消息
    return ErrorShowType.ERROR_MESSAGE;
};

/**
 * 处理业务错误
 * @param error 业务错误对象
 */
const handleBusinessError = (error: BusinessError): void => {
    const { code, message: errorMessage, showType } = error;

    switch (showType) {
        case ErrorShowType.SILENT:
            // 静默处理，不展示任何信息
            console.warn("业务错误（静默）:", { code, message: errorMessage });
            break;

        case ErrorShowType.WARN_MESSAGE:
            // 警告消息提示
            message.warning(errorMessage);
            break;

        case ErrorShowType.ERROR_MESSAGE:
            // 错误消息提示
            message.error(errorMessage);
            break;

        case ErrorShowType.NOTIFICATION:
            // 通知提示
            notification.error({
                message: "请求失败",
                description: errorMessage,
                duration: 4.5,
            });
            break;

        case ErrorShowType.REDIRECT:
            // 页面跳转（通常用于未登录）
            message.error(errorMessage);
            // 延迟跳转，确保用户看到错误提示
            setTimeout(() => {
                const { pathname, search } = window.location;
                // 保存当前路径，登录后可以返回
                const redirect = pathname + search;
                window.location.href = `/user/login?redirect=${encodeURIComponent(redirect)}`;
            }, 100);
            break;

        default:
            message.error(errorMessage || "未知错误");
    }
};

/**
 * 处理网络错误
 * @param error Axios 错误对象
 */
const handleNetworkError = (error: AxiosError): void => {
    if (error.response) {
        // 服务器响应了状态码，但状态码超出了 2xx 范围
        const { status, statusText } = error.response;
        const errorMessage = `网络请求失败: ${status} ${statusText}`;

        // 根据 HTTP 状态码进行不同处理
        switch (status) {
            case 401:
                message.error("身份认证失败，请重新登录");
                setTimeout(() => {
                    window.location.href = "/user/login";
                }, 1000);
                break;
            case 403:
                message.error("您没有权限访问该资源");
                break;
            case 404:
                message.error("请求的资源不存在");
                break;
            case 500:
            case 502:
            case 503:
            case 504:
                notification.error({
                    message: "服务器错误",
                    description: "服务器出现异常，请稍后重试",
                    duration: 4.5,
                });
                break;
            default:
                message.error(errorMessage);
        }
    } else if (error.request) {
        // 请求已发出，但没有收到响应
        notification.error({
            message: "网络异常",
            description: "无法连接到服务器，请检查网络连接",
            duration: 4.5,
        });
    } else {
        // 请求配置出错
        message.error("请求配置错误，请联系管理员");
    }

    console.error("网络错误详情:", error);
};

/**
 * 创建 Axios 实例
 */
class RequestService {
    private instance: AxiosInstance;

    constructor() {
        // axios 配置
        const axiosConfig: AxiosRequestConfig = {
            baseURL: import.meta.env.VITE_API_URL || "/api", // 基础 URL
            timeout: 30000, // 请求超时时间（30秒）
            withCredentials: true, // 允许跨域携带 cookie
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
            },
        };

        // 创建 axios 实例
        this.instance = axios.create(axiosConfig);

        // 设置请求拦截器
        this.setupRequestInterceptors();

        // 设置响应拦截器
        this.setupResponseInterceptors();
    }

    /**
     * 设置请求拦截器
     */
    private setupRequestInterceptors(): void {
        this.instance.interceptors.request.use(
            (config: InternalAxiosRequestConfig) => {
                // 可以在这里添加通用的请求头
                // 例如：添加 token、请求 ID、时间戳等
                const headers = {
                    ...config.headers,
                    // 'X-Request-ID': this.generateRequestId(),
                    // 'X-Request-Time': Date.now().toString(),
                };

                return {
                    ...config,
                    headers,
                } as InternalAxiosRequestConfig;
            },
            (error: AxiosError) => {
                // 请求错误处理
                console.error("请求配置错误:", error);
                message.error("请求配置错误，请稍后重试");
                return Promise.reject(error);
            }
        );
    }

    /**
     * 设置响应拦截器
     */
    private setupResponseInterceptors(): void {
        this.instance.interceptors.response.use(
            (response: AxiosResponse) => {
                const { data, config } = response;
                const extendedConfig = config as ExtendedAxiosRequestConfig;

                // 如果响应数据不是预期的格式，直接返回原始响应
                if (!data || typeof data !== "object") {
                    return response;
                }

                // 标准的后端响应格式
                const {
                    success,
                    code,
                    message: errorMessage,
                    data: responseData,
                } = data as API.BaseResponse<unknown>;

                // 检查是否为后端标准响应格式
                if (typeof success !== "boolean" || typeof code !== "number") {
                    return response;
                }

                // 请求成功
                if (success && code === BusinessCode.SUCCESS) {
                    return response;
                }

                // 请求失败，处理错误
                const showType = extendedConfig.errorShowType || getErrorShowType(code);
                const businessError = new BusinessError(
                    code,
                    errorMessage || "请求失败",
                    showType,
                    responseData
                );

                // 如果配置了跳过错误处理，直接抛出错误
                if (extendedConfig.skipErrorHandler) {
                    return Promise.reject(businessError);
                }

                // 特殊处理未登录的情况
                if (code === BusinessCode.NOT_LOGIN) {
                    // 不是获取用户信息的请求，并且用户目前不是已经在登录页面
                    const isLoginRequest =
                        response.request?.responseURL?.includes("user/get/login") ||
                        response.request?.responseURL?.includes("user/getLoginUserInfo");
                    const isLoginPage = window.location.pathname.includes("/user/login");

                    if (!isLoginRequest && !isLoginPage) {
                        handleBusinessError(businessError);
                    }
                } else {
                    // 其他错误统一处理
                    handleBusinessError(businessError);
                }

                return Promise.reject(businessError);
            },
            (error: AxiosError) => {
                const extendedConfig = error.config as ExtendedAxiosRequestConfig;

                // 如果配置了跳过错误处理，直接抛出错误
                if (extendedConfig?.skipErrorHandler) {
                    return Promise.reject(error);
                }

                // 处理网络错误
                handleNetworkError(error);

                return Promise.reject(error);
            }
        );
    }

    /**
     * 生成唯一的请求 ID
     * @returns 请求 ID
     */
    private generateRequestId(): string {
        return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    }

    /**
     * 获取 axios 实例
     */
    public getInstance(): AxiosInstance {
        return this.instance;
    }
}

// 创建请求服务实例
const requestService = new RequestService();

// 导出 axios 实例
export default requestService.getInstance();
