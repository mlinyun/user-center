import { history } from '@@/core/history';
import type { RequestOptions } from '@@/plugin-request/request';
import type { RequestConfig } from '@umijs/max';
import { message, notification } from 'antd';

/**
 * 业务状态码枚举
 * 与后端 ResultCodeEnum 保持一致
 */
enum BusinessCode {
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
 * 错误展示类型
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
  name = 'BusinessError';
  /** 业务状态码 */
  code: number;
  /** 错误展示类型 */
  showType: ErrorShowType;
  /** 响应数据 */
  data?: any;

  constructor(code: number, message: string, showType: ErrorShowType, data?: any) {
    super(message);
    this.code = code;
    this.showType = showType;
    this.data = data;
  }
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
      console.warn('业务错误（静默）:', { code, message: errorMessage });
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
        message: '请求失败',
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
        history.push(`/user/login?redirect=${encodeURIComponent(redirect)}`);
      }, 100);
      break;

    default:
      message.error(errorMessage || '未知错误');
  }
};

/**
 * 处理网络错误
 * @param error Axios 错误对象
 */
const handleNetworkError = (error: any): void => {
  if (error.response) {
    // 服务器响应了状态码，但状态码超出了 2xx 范围
    const { status, statusText } = error.response;
    const errorMessage = `网络请求失败: ${status} ${statusText}`;

    // 根据 HTTP 状态码进行不同处理
    switch (status) {
      case 401:
        message.error('身份认证失败，请重新登录');
        setTimeout(() => {
          history.push('/user/login');
        }, 1000);
        break;
      case 403:
        message.error('您没有权限访问该资源');
        break;
      case 404:
        message.error('请求的资源不存在');
        break;
      case 500:
      case 502:
      case 503:
      case 504:
        notification.error({
          message: '服务器错误',
          description: '服务器出现异常，请稍后重试',
          duration: 4.5,
        });
        break;
      default:
        message.error(errorMessage);
    }
  } else if (error.request) {
    // 请求已发出，但没有收到响应
    notification.error({
      message: '网络异常',
      description: '无法连接到服务器，请检查网络连接',
      duration: 4.5,
    });
  } else {
    // 请求配置出错
    message.error('请求配置错误，请联系管理员');
  }

  console.error('网络错误详情:', error);
};

/**
 * @name 全局请求配置
 * @description 统一的请求错误处理和响应拦截
 * @doc https://umijs.org/docs/max/request#配置
 */
export const errorConfig: RequestConfig = {
  // 错误处理配置
  errorConfig: {
    /**
     * 错误抛出器
     * 判断响应是否为错误，如果是则抛出业务错误
     */
    errorThrower: (res: API.BaseResponse) => {
      const { success, code, message: errorMessage, data } = res;

      // 请求成功，不抛出错误
      if (success) {
        return;
      }

      // 获取错误展示类型
      const showType = getErrorShowType(code);

      // 抛出业务错误
      throw new BusinessError(code, errorMessage, showType, data);
    },

    /**
     * 错误处理器
     * 统一处理所有类型的错误
     */
    errorHandler: (error: any, opts: any) => {
      // 如果配置了跳过错误处理，则直接抛出
      if (opts?.skipErrorHandler) {
        throw error;
      }

      // 处理业务错误
      if (error instanceof BusinessError) {
        handleBusinessError(error);
        return;
      }

      // 处理网络错误
      handleNetworkError(error);
    },
  },

  /**
   * 请求拦截器
   * 在请求发送前进行处理
   */
  requestInterceptors: [
    (config: RequestOptions) => {
      // 可以在这里添加通用的请求头
      // 例如：添加 token、请求 ID、时间戳等
      const headers = {
        ...config.headers,
        // 'X-Request-ID': generateRequestId(),
        // 'X-Request-Time': Date.now().toString(),
      };

      return {
        ...config,
        headers,
      };
    },
  ],

  /**
   * 响应拦截器
   * 在响应到达业务代码前进行处理
   */
  responseInterceptors: [
    (response: any) => {
      const { data } = response;

      // 如果响应数据不是预期的格式，直接返回原始响应
      if (!data || typeof data !== 'object') {
        return response;
      }

      // 标准的后端响应格式
      const { success, code, message: errorMessage, data: responseData } = data as API.BaseResponse;

      // 检查是否为后端标准响应格式
      if (typeof success !== 'boolean' || typeof code !== 'number') {
        return response;
      }

      // 请求成功，返回数据部分
      if (success && code === BusinessCode.SUCCESS) {
        // 修改 response.data 为实际数据，这样业务代码可以直接使用
        return { ...response, data: responseData };
      }

      // 请求失败，抛出错误（会被 errorThrower 捕获）
      throw new BusinessError(
        code,
        errorMessage || '请求失败',
        getErrorShowType(code),
        responseData,
      );
    },
  ],
};
