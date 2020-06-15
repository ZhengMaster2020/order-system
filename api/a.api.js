import oldApi from './api.js'
import commonApi from './common-api.js'
import securityCodeApi from './security-code-api.js'
import productionPlanListApi from './production-plan-list-api.js'
import productionPrenatalBatchListApi from './production-prenatal-batch-list-api.js'
import FQASettingApi from './FQA-setting-api.js'
import channerlStoreSettingsApi from './channerl-store-settings-api'
import CSKQOutboundApplicationApi from './CSKQ-outbound-application-api'
import storageApplicationApi from './storage-application-api'

/**
 * 旧版本接口 => api.js
 * 
 * 公共接口 => common-api.js
 * 
 * 防伪码接口 => security-code-api.js
*/ 
export default {
  ...oldApi,
  ...commonApi,
  ...securityCodeApi,
  ...productionPlanListApi,
  ...productionPrenatalBatchListApi,
  ...FQASettingApi,
  ...channerlStoreSettingsApi,
  ...CSKQOutboundApplicationApi,
  ...channerlStoreSettingsApi,
  ...storageApplicationApi
}