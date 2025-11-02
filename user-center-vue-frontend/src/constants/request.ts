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
export enum ErrorShowType {
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
