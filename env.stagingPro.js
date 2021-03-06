module.exports = {
  environment: 'stagingPro',
  axiosBaseUrl: '',
  axiosBaseApiUrl: '',
  exeLoginUrl: '/api/tenant/account/login',
  exeLogoutUrl: '/api/tenant/account/logout',
  getCsrfTokenDataUrl: '/api/tenant/account/csrfToken',
  getMasterDataUrl: '/api/tenant/account/post-login',
  resetPasswordRequestUrl: '/api/tenant/account/password/reset/request',
  resetPasswordUrl: '/api/tenant/account/password/reset/update/{uuid}',
  updatePasswordUrl: '/api/tenant/account/password/change/update',
  cmsSideNavUrl: '/cms/cms_sideNav.json',
  accountSideNavUrl: '/account/account_sideNav.json',
  communitySideNavUrl: '/community/community_sideNav.json',
  formSideNavUrl: '/form/form_sideNav.json',
  mmiSideNavUrl: '/api/tenant3/mmi/menu',
  cfmSideNavUrl: '/api/tenant3/cfm/menu',
  storageSideNavUrl: '/storage/storage_sideNav.json',
  communicationSideNavUrl: '/communication/communication_sideNav.json',
  contactSideNavUrl: '/contact/contact_sideNav.json',
  servicelauncherSideNavUrl: '/servicelauncher/servicelauncher_sideNav.json',
  getInitialSettingsUrl: '/api/tenant/account/initial-setting',
  getInitialProfileUrl: '/api/tenant/account/ceo/profile',
  updateInitialProfileUrl: '/api/tenant/account/ceo/profile',
  serviceStartUrl: '/api/tenant/account/initial-setting/service-start',
  servicelauncherListUrl: '/api/tenant/account/service-launcher/menu',
  servicelauncherNewsUrl: '/api/tenant/account/informations',
  getBizskyJournal:
    'https://dev-preview-journal-bizocean.gcp-colsis.com/api/column/items.json',
  getNotificationListUrl: '/api/tenant/account/notifications',
  readNotificationUrl: '/api/tenant/account/notifications/read',
  getCmsDashBoardKpiDataUrl: '/api/tenant/cms/kpi',
  getCirculationPageListUrl: '/api/tenant/cms/page-summary',
  getCmsBasicSettingsUrl: '/api/tenant/cms/setting/basic',
  getSetupStatusUrl: '/api/tenant/cms/setting/basic/setup/status',
  checkDomainUrl: '/api/tenant/cms/domain/check',
  updateCmsBasicSettingsUrl: '/api/tenant/cms/setting/basic',
  getBasicSettingCompleteStatusUrl: '/api/tenant/cms/setting/basic/comp/status',
  decideCmsDomainSettingsUrl: '/api/tenant/cms/domain/decide',
  updateCmsBasicSettingsSitesUrl: '/api/tenant/cms/setting/basic/sites',
  updateCmsBasicSettingsDesignUrl: '/api/tenant/cms/setting/basic/design',
  getCmsBasicSettingsDomainUrl: '/api/tenant/cms/domain',
  changeOwnDomainUrl: '/api/tenant/cms/domain/original/switch',
  getOwnDomainSetupStatusUrl:
    '/api/tenant/cms/domain/original/switch/setup/status',
  getCmsEditorComponentPartsUrl:
    '/apis/cms/editor/getCmsEditorComponentParts.json',
  getCmsEditorDataUrl: '/api/tenant/cms/page-datas/{id}',
  updateCmsEditorPageDataUrl: '/api/tenant/cms/page-datas/{id}',
  saveCustomPartsComponentUrl: '/api/tenant/cms/page-datas/custom',
  getCustomPartsListUrl: '/api/tenant/cms/page-datas/custom',
  deleteCustomPartsUrl: '/api/tenant/cms/page-datas/custom',
  getCmsEditorUploadImageListUrl: '/api/tenant/cms/page-datas/image',
  checkSameCmsEditorImageUploadUrl: '/api/tenant/cms/page-datas/image/check',
  uploadCmsEditorImageUrl: '/api/tenant/cms/page-datas/image',
  deleteCmsEditorImageUrl: '/api/tenant/cms/page-datas/image',
  uploadSettingBasicLogoUrl: '/api/tenant/cms/setting/basic/logo',
  checkCmsEditorPagePublishUrl:
    '/api/tenant/cms/page-datas/publish/status/{id}',
  getPublicManagementDataUrl: '/api/tenant/cms/setting/release',
  updatePublicManagementDataUrl: '/api/tenant/cms/setting/release',
  getCreateWebPageListUrl: '/api/tenant/cms/page-structure',
  updateWebPageListUrl: '/api/tenant/cms/page-structure',
  createWebPageUrl: '/api/tenant/cms/page-datas',
  deleteWebPageUrl: '/api/tenant/cms/page-datas',
  // mailListUrl: '/apis/communication/mailList.json',
  // createMailUrl: '/apis/communication/createMail.json',
  getFormDashBoardKpiDataUrl: '/api/tenant/tenantform/kpi',
  getDashBoardFormListUrl: '/api/tenant/tenantform/kpi/form-datas',
  downloadFormListDataUrl: '/api/tenant/tenantform/kpi/form-datas/csv',
  downloadAnswerReportFileUrl:
    '/api/tenant/tenantform/form-datas/{formId}/answers/{answerId}}/attachment/{formPartsId}',
  getFormListUrl: '/api/tenant/tenantform/form-datas',
  insertFormDataUrl: '/api/tenant/tenantform/form-datas',
  deleteFormDataUrl: '/api/tenant/tenantform/form-datas/{formId}',
  updateFormStatusUrl: '/api/tenant/tenantform/form-datas/{formId}/status',
  getContactWebAnswerDataListUrl:
    '/api/tenant/tenantform/form-datas/{formId}/answers',
  updateContactWebAnswerDataListUrl:
    '/api/tenant/tenantform/form-datas/{formId}/answers/{answerId}',
  deleteAnswerDataUrl:
    '/api/tenant/tenantform/form-datas/{formId}/answers/{answerId}',
  downloadFormAnswerDataUrl:
    '/api/tenant/tenantform/form-datas/{formId}/responses/csv',
  getFormBasicSettingsUrl: '/api/tenant/tenantform/setting',
  updateFormBasicSettingsUrl: '/api/tenant/tenantform/setting',
  getEditFormSettingsUrl: '/api/tenant/tenantform/form-datas/{formId}',
  updateEditFormSettingsUrl: '/api/tenant/tenantform/form-datas/{formId}',
  updatePublishSettingsUrl:
    '/api/tenant/tenantform/form-datas/{formId}/release',
  getTimeLineListUrl: '/api/tenant2/community/timeline',
  getPostTimeLineCommentUrl: '/api/tenant2/community/timeline/{postId}',
  deleteTimelineOwnOgpUrl: '/api/tenant2/community/message/{postId}/delete-ogp',
  updatePostCommentUrl: '/api/tenant2/community/message/{postId}',
  updateTimeLineChildCommentUrl: '/api/tenant2/community/comment/{commentId}',
  deleteTimeLineCommentUrl: '/api/tenant2/community/message/{postId}',
  deleteTimeLineChildCommentUrl: '/api/tenant2/community/comment/{commentId}',
  updateGoodNumUrl: '/api/tenant2/community/message/{postId}/good',
  postReportReasonForPostUrl: '/api/tenant2/community/message/{postId}/report',
  postReportReasonForCommentUrl:
    '/api/tenant2/community/comment/{commentId}/report',
  getTargetUserTimeLineListUrl: '/api/tenant2/community/message/list',
  getPostGroupRecentTimeLineUrl: '/api/tenant2/community/post-groups/recent',
  getPostGroupTimeLineUrl:
    '/api/tenant2/community/post-groups/{postGroupId}/timeline',
  getGroupMembersUrl:
    '/api/tenant2/community/post-groups/{postGroupId}/members',
  postGroupCommentUrl: '/api/tenant2/community/post-groups/{postGroupId}/posts',
  getProfileUrl: '/api/tenant2/community/profile',
  updateProfileUrl: '/api/tenant2/community/profile',
  updateProfileCoverImageUrl: '/api/tenant2/community/profile/cover-image',
  updateCorporateProfileCoverImageUrl:
    '/api/tenant2/community/profile/company-cover-image',
  updateGroupProfileCoverImageUrl:
    '/api/tenant2/community/post-groups/{postGroupId}/cover-image',
  // getCommunityNewsListUrl: '/apis/community/getCommunityNewsList.json',
  getBrowsingHistoryUrl: '/api/tenant2/community/footprint/list',
  addBrowsingHistoryUrl: '/api/tenant2/community/footprint',
  getPostGroupInfoUrl: '/api/tenant2/community/post-groups/{postGroupId}',
  getJoinGroupListUrl: '/api/tenant2/community/post-groups',
  createGroupProfileUrl: '/api/tenant2/community/post-groups',
  updateGroupProfileUrl: '/api/tenant2/community/post-groups/{postGroupId}',
  getCommunityGroupInvitationMemberUrl: '/api/tenant2/community/connections',
  postInvitationGroupMemberUrl:
    '/api/tenant2/community/post-groups/{postGroupId}/members',
  postCommentUrl: '/api/tenant2/community/message',
  getOGPDataUrl: '/api/tenant2/community/ogp',
  postReplyCommentUrl: '/api/tenant2/community/comment/{id}',
  postReplyChildCommentUrl: '/api/tenant2/community/reply/{id}',
  getRequestConnectionListUrl: '/api/tenant2/community/connection/request/list',
  connectionListUrl: '/api/tenant2/community/connection/list',
  requestConnectionUrl: '/api/tenant2/community/connection',
  cancelConnectionUrl: '/api/tenant2/community/connection/cancel',
  approvalConnectionUrl: '/api/tenant2/community/connection',
  deleteConnectionRequestUrl: '/api/tenant2/community/connection',
  updatePostDisplayUrl: '/api/tenant2/community/connection/timeline/view',
  getCommunitySearchResultDataUrl: '/api/tenant2/community/search/account/list',
  getCompanyMemberListUrl: '/api/tenant2/community/cxo/list/',
  getRecentlyMessageListUrl: '/api/tenant2/community/chat/member',
  updateChatReadStatusUrl: '/api/tenant2/community/chat/read',
  getCommunityMessageListUrl: '/api/tenant2/community/chat',
  postCommunityMessageUrl: '/api/tenant2/community/chat',
  deleteMessageUrl: '/api/tenant2/community/chat/{messageId}',
  getMessageFileUrl:
    '/api/tenant2/community/chat/{messageId}/file-download-url',
  deleteMessageTimelineOwnOgpUrl:
    '/api/tenant2/community/chat/{messageId}/delete-ogp',
  startChatGroupUrl: '/api/tenant2/community/chat/group',
  getCustomerListUrl: '/apis/community/message/getCustomerList.json',
  savePresignedUrlForDatabaseUrl:
    '/api/tenant2/community/chat/{messageId}/upload-file',
  getCashFlowReportUrl: '/api/tenant3/cfm/forecastReport',
  getSimulationListUrl: '/api/tenant3/cfm/simulationResultsAll',
  getSimulationResultsUrl: '/api/tenant3/cfm/simulationResults',
  saveSimulationUrl: '/api/tenant3/cfm/simulationResults',
  deleteSimulationUrl: '/api/tenant3/cfm/simulationResults',
  getAdvisorsListUrl: '/api/tenant3/cfm/advisors',
  getAdviceInfoUrl: '/api/tenant3/cfm/advice',
  checkSameMailAddressUrl: '/api/backoffice/email/{mailAddress}/check',
  getActivateDataUrl: '/api/tenant/account/external-tools/link-status/list',
  registUsageApplicationFormUrl: '/api/backoffice/applications',
  putCancellationUrl: '/api/tenant/account/contract/cancel',
  getCancelNoticeUrl: '/api/tenant/account/contract/cancel-notice',
  getContractInformationUrl: '/api/tenant/account/contract/state',
  getContractRecordVersionUrl: '/api/tenant/account/contract/record-version',
  getInvitationListUrl: '/api/tenant/account/client/list/invite',
  sendInvitationMailUrl: '/api/tenant/account/client/email/send',
  getAccountListUrl: '/api/tenant/account/accounts',
  getNewAccountDetailUrl: '/api/tenant/account/accounts/create',
  createNewAccountDetailUrl: '/api/tenant/account/accounts/create',
  getAccountDetailUrl: '/api/tenant/account/accounts/{accountId}',
  updateAccountDetailUrl: '/api/tenant/account/accounts/{accountId}',
  deleteAccountUrl: '/api/tenant/account/accounts',
  getAccountDetailHeaderUrl: '/api/tenant/account/accounts/header/',
  updateAccountDetailHeaderUrl: '/api/tenant/account/accounts/header/',
  getContractPlanUrl: '/api/tenant/account/contract/plan',
  checkApplicationOwnDomainOptionUrl: '/api/tenant/cms/domain/original/check',
  confirmedSubdomainUrl: '/api/tenant/cms/domain/original/register',
  getAccountTagUrl: '/api/tenant/account/tenant/common/tag',
  updateAccountTagUrl: '/api/tenant/account/tenant/common/tag',
  getAccountCommonSettingsUrl: '/api/tenant/account/tenant/common/setting',
  updateAccountCommonSettingsUrl: '/api/tenant/account/tenant/common/setting',
  resendInvitationMailUrl:
    '/api/tenant/account/invitation-account/email/resend',
  updateCorporateCoverImageUrl: '/api/tenant/account/cover-image',
  getCompanyDataUrl: '/api/tenant/account/tenant',
  updateCorporateDataUrl: '/api/tenant/account/tenant',
  updateCorporateProfileDataUrl: '/api/tenant/account/company/profile',
  getAddress: 'https://zipcloud.ibsnet.co.jp/api/search',
  getSaveConditionsUrl: '/api/tenant3/mmi/condition',
  insertSaveConditionsUrl: '/api/tenant3/mmi/condition',
  deleteSaveConditionsUrl: '/api/tenant3/mmi/condition',
  getMmiFunctionAuthorityUrl: '/api/tenant3/mmi/function-authority',
  putMmiActivateUrl: '/api/tenant3/mmi/activate',
  getMmiActivatedStateUrl: '/api/tenant3/mmi/activate',
  getMmiOwnCompanyUrl: '/api/tenant3/mmi/own-company',
  getMmiIndustriesUrl: '/api/tenant3/mmi/statistics-industries',
  getMmiTermUrl: '/api/tenant3/mmi/statistics-period',
  getCompanyMasterDataUrl: '/api/tenant3/mmi/company',
  getMmiAdvisorsUrl: '/api/tenant3/mmi/advisors',
  putMmiUpdateTenantInfoUrl: '/api/tenant3/mmi/tenant-info',
  postInvitationAccountUrl: '/api/tenant/account/invitation-account/{uuid}',
  getInvitationRecordVersionUrl:
    '/api/tenant/account/invitation-account/record-version/{uuid}',
  getStorageObjectsUrl: '/api/storage/objects',
  getStorageSharedUrl: '/api/storage/objects/shared',
  getStorageRecentUrl: '/api/storage/objects/recent',
  getStorageDeletedUrl: '/api/storage/objects/deleted',
  getStoragePinUrl: '/api/storage/objects/pin',
  createStorageFoldersUrl: '/api/storage/folders',
  getStorageUploadUrlUrl: '/api/storage/upload-url',
  registStorageFilesUrl: '/api/storage/files',
  deleteStorageObjectsUrl: '/api/storage/objects',
  copyStorageObjectUrl: '/api/storage/files/{id}/copy',
  getStorageShareLinksUrl: '/api/storage/share-links/{shareLinkId}',
  updateStorageFoldersUrl: '/api/storage/folders/{id}',
  updateStorageFilesUrl: '/api/storage/files/{id}',
  moveStorageDataUrl: '/api/storage/objects/{id}/move',
  updateStorageRestoreUrl: '/api/storage/objects/{id}/restore',
  getStorageDownloadUrl: '/api/storage/download-url',
  getStorageDownloadShareUrl:
    '/api/storage/share-links/{shareLinkId}/download-url',
  getStorageShareableMembersUrl: '/api/storage/shareable-members',
  getStorageSearchUrl: '/api/storage/objects/search',
  getStorageShareFoldersMembersUrl: '/api/storage/share-folders/{id}/members',
  createStorageShareFoldersUrl: '/api/storage/share-folders',
  updateStorageShareLinkUrl: '/api/storage/objects/{id}/share-link',
  updateStoragePinUrl: '/api/storage/objects/{id}/pin',
  getAdvisoryCompanyRecordVersionUrl:
    '/api/tenant/account/invitation-client-account/terms-of-service/{uuid}',
  postAdvisoryCompanyUrl:
    '/api/tenant/account/invitation-client-account/terms-of-service/{uuid}',
  getMailDetailUrl: '/apis/mail/mail-data/{mailId}',
  updateEditMailSettingsUrl: '/api/tenant/mail/mail-data/{mailId}',
  getMailContactsDistributionUrl: '/api/tenant/mail/contacts/distribution',
  getMailContactCountUrl: '/api/tenant/mail/contacts/count',
  getMailContactsCsvUrl: '/api/tenant/mail/contacts/csv',
  sendMailDataUrl: '/api/tenant/mail/mail-data/{mailId}/send',
  getMailBasicSettingsUrl: '/api/tenant/mail/setting/basic',
  updateMailBasicSettingsUrl: '/api/tenant/mail/setting/basic',
  getDefinitionsUrl: '/api/tenant/contact/definitions',
  getContactListUrl: '/api/tenant/contact/contacts',
  downloadContactListUrl: '/api/tenant/contact/contacts/csv',
  deleteContactDataUrl: '/api/tenant/contact/contacts',
  createContactDetailUrl: '/api/tenant/contact/contacts',
  getContactDetailUrl: '/api/tenant/contact/contacts/{id}',
  updateContactDetailUrl: '/api/tenant/contact/contacts/{id}',
  updateContactDetailCsvUrl: '/api/tenant/contact/contacts/csv',
  createTargetListUrl: '/api/tenant/contact/contacts',
  updateDisplayItemListUrl: '/api/tenant/contact/display-item-settings',
  getDataItemDefinitionsUrl: '/api/tenant/contact/data-item-definitions',
  saveDataItemDefinitionsUrl: '/api/tenant/contact/data-item-definitions',
  deleteDataItemDefinitionsUrl:
    '/api/tenant/contact/data-item-definitions/{id}',
  getMailListDataUrl: '/api/tenant/mail/page-datas',
  deleteMailUrl: '/api/tenant/mail/mail-data/{mailId}',
  postMailCopyUrl: '/api/tenant/mail/mail-data/{mailId}/copy',
  getMailSendReportUrl: '/api/tenant/mail/mail-data/{mailId}/send',
  postMailCreateUrl: '/api/tenant/mail/mail-data',
}
