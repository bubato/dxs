module.exports = {
  environment: 'development',
  axiosBaseUrl: '',
  axiosBaseApiUrl: '',
  exeLoginUrl: '/apis/exeLogin.json',
  exeLogoutUrl: '/apis/exeLogout.json',
  getCsrfTokenDataUrl: '/apis/common/getCsrfTokenData.json',
  getMasterDataUrl: '/apis/common/getMasterData.json',
  resetPasswordRequestUrl: '/apis/resetPasswordRequest.json',
  resetPasswordUrl: '/apis/resetPassword.json',
  updatePasswordUrl: '/apis/updatePassword.json',
  cmsSideNavUrl: '/cms/cms_sideNav.json',
  accountSideNavUrl: '/account/account_sideNav.json',
  communitySideNavUrl: '/community/community_sideNav.json',
  contactSideNavUrl: '/contact/contact_sideNav.json',
  mailSideNavUrl: '/mail/mail_sideNav.json',
  formSideNavUrl: '/form/form_sideNav.json',
  mmiSideNavUrl: '/mmi/mmi_sideNav.json',
  cfmSideNavUrl: '/apis/cfm/cfm_sideNav.json',
  storageSideNavUrl: '/storage/storage_sideNav.json',
  communicationSideNavUrl: '/communication/communication_sideNav.json',
  servicelauncherSideNavUrl: '/servicelauncher/servicelauncher_sideNav.json',
  getInitialSettingsUrl: '/apis/starter/getInitialSettings.json',
  getInitialProfileUrl: '/apis/account/getInitialProfile.json',
  updateInitialProfileUrl: '/apis/account/updateInitialProfile.json',
  serviceStartUrl: '/apis/starter/serviceStart.json',
  servicelauncherListUrl: '/apis/servicelauncher/servicelauncher.json',
  servicelauncherNewsUrl: '/apis/servicelauncher/tenantNews.json',
  getBizskyJournal:
    'https://dev-preview-journal-bizocean.gcp-colsis.com/api/column/items.json',
  getNotificationListUrl: '/apis/common/getNotificationList.json',
  readNotificationUrl: '/apis/common/readNotification.json',
  getCmsDashBoardKpiDataUrl: '/apis/cms/dashboard/getCmsDashBoardKpiData.json',
  getCirculationPageListUrl: '/apis/cms/dashboard/getCirculationPageList.json',
  getCmsBasicSettingsUrl: '/apis/cms/basicSettings/getBasicSettings.json',
  getSetupStatusUrl: '/apis/cms/basicSettings/getSetupStatus.json',
  checkDomainUrl: '/apis/cms/basicSettings/checkDomain.json',
  updateCmsBasicSettingsUrl: '/apis/cms/basicSettings/updateBasicSettings.json',
  getBasicSettingCompleteStatusUrl:
    '/apis/cms/basicSettings/getBasicSettingCompleteStatus.json',
  decideCmsDomainSettingsUrl:
    '/apis/cms/basicSettings/decideCmsDomainSettings.json',
  updateCmsBasicSettingsSitesUrl:
    '/apis/cms/basicSettings/updateCmsBasicSettingsSites.json',
  updateCmsBasicSettingsDesignUrl:
    '/apis/cms/basicSettings/updateCmsBasicSettingsDesign.json',
  getCmsBasicSettingsDomainUrl:
    '/apis/cms/basicSettings/getCmsBasicSettingsDomain.json',
  changeOwnDomainUrl: '/apis/cms/basicSettings/changeOwnDomain.json',
  getOwnDomainSetupStatusUrl:
    '/apis/cms/basicSettings/getOwnDomainSetupStatus.json',
  getCmsEditorComponentPartsUrl:
    '/apis/cms/editor/getCmsEditorComponentParts.json',
  getCmsEditorDataUrl: '/apis/cms/editor/getCmsEditorData.json',
  updateCmsEditorPageDataUrl: '/apis/cms/editor/updateCmsEditorPageData.json',
  saveCustomPartsComponentUrl: '/apis/cms/editor/saveCustomPartsComponent.json',
  getCustomPartsListUrl: '/apis/cms/editor/getCustomPartsList.json',
  deleteCustomPartsUrl: '/apis/cms/editor/deleteCustomParts.json',
  getCmsEditorUploadImageListUrl:
    '/apis/cms/editor/getCmsEditorUploadImageList.json',
  checkSameCmsEditorImageUploadUrl:
    '/apis/cms/editor/checkSameCmsEditorImageUpload.json',
  uploadCmsEditorImageUrl: '/apis/cms/editor/uploadCmsEditorImage.json',
  deleteCmsEditorImageUrl: '/apis/cms/editor/deleteCmsEditorImage.json',
  uploadSettingBasicLogoUrl:
    '/apis/cms/basicSettings/uploadSettingBasicLogo.json',
  checkCmsEditorPagePublishUrl:
    '/apis/cms/editor/checkCmsEditorPagePublish.json',
  getPublicManagementDataUrl: '/apis/cms/publish/getPublicManagementData.json',
  updatePublicManagementDataUrl:
    '/apis/cms/publish/updatePublicManagementData.json',
  getCreateWebPageListUrl: '/apis/cms/createWebPage/getCreateWebPageList.json',
  updateWebPageListUrl: '/apis/cms/createWebPage/updateWebPageList.json',
  createWebPageUrl: '/apis/cms/createWebPage/createWebPage.json',
  deleteWebPageUrl: '/apis/cms/createWebPage/deleteWebPage.json',
  mailListUrl: '/apis/communication/mailList.json',
  createMailUrl: '/apis/communication/createMail.json',
  getFormDashBoardKpiDataUrl:
    '/apis/form/dashboard/getFormDashBoardKpiData.json',
  getDashBoardFormListUrl: '/apis/form/dashboard/getDashBoardFormList.json',
  downloadFormListDataUrl: '/apis/form/dashboard/downloadFormListData.json',
  getFormListUrl: '/apis/form/formList/getFormList.json',
  deleteFormDataUrl: '/apis/form/formList/deleteFormData.json',
  insertFormDataUrl: '/apis/form/formList/insertFormData.json',
  updateFormStatusUrl: '/apis/form/formList/updateFormStatus.json',
  getContactWebAnswerDataListUrl:
    '/apis/form/contactWebAnswerData/getContactWebAnswerDataList.json',
  updateContactWebAnswerDataListUrl:
    '/apis/form/contactWebAnswerData/updateContactWebAnswerDataList.json',
  deleteAnswerDataUrl: '/apis/form/contactWebAnswerData/deleteAnswerData.json',
  downloadFormAnswerDataUrl:
    '/apis/form/contactWebAnswerData/downloadFormAnswerData.json',
  downloadAnswerReportFileUrl:
    '/apis/form/contactWebAnswerData/downloadAnswerReportFile.json',
  getFormBasicSettingsUrl: '/apis/form/basicSettings/getFormBasicSettings.json',
  updateFormBasicSettingsUrl:
    '/apis/form/basicSettings/updateFormBasicSettings.json',
  getEditFormSettingsUrl:
    '/apis/form/editFormSettings/getEditFormSettings.json',
  updateEditFormSettingsUrl:
    '/apis/form/editFormSettings/updateEditFormSettings.json',
  updatePublishSettingsUrl:
    '/apis/form/editFormSettings/updatePublishSettings.json',
  getTimeLineListUrl: '/apis/community/timeline/getTimeLineList.json',
  getPostTimeLineCommentUrl:
    '/apis/community/timeline/getPostTimeLineComment.json',
  deleteTimelineOwnOgpUrl: '/apis/community/timeline/deleteTimelineOwnOgp.json',
  updatePostCommentUrl: '/apis/community/timeline/updatePostComment.json',
  updateTimeLineChildCommentUrl:
    '/apis/community/timeline/updateTimeLineChildComment.json',
  deleteTimeLineCommentUrl:
    '/apis/community/timeline/deleteTimeLineComment.json',
  deleteTimeLineChildCommentUrl:
    '/apis/community/timeline/deleteTimeLineChildComment.json',
  updateGoodNumUrl: '/apis/community/timeline/updateGoodNum.json',
  postReportReasonForPostUrl:
    '/apis/community/timeline/postReportReasonForPost.json',
  postReportReasonForCommentUrl:
    '/apis/community/timeline/postReportReasonForComment.json',
  getTargetUserTimeLineListUrl:
    '/apis/community/timeline/getTargetUserTimeLineList.json',
  getPostGroupRecentTimeLineUrl:
    '/apis/community/group/getPostGroupRecentTimeLine.json',
  getPostGroupTimeLineUrl: '/apis/community/group/getPostGroupTimeLine.json',
  getGroupMembersUrl: '/apis/community/group/getGroupMembers.json',
  postGroupCommentUrl: '/apis/community/group/postGroupComment.json',
  getProfileUrl: '/apis/community/profile/getProfile.json',
  updateProfileUrl: '/apis/community/profile/updateProfile.json',
  updateProfileCoverImageUrl:
    '/apis/community/profile/updateProfileCoverImage.json',
  updateCorporateProfileCoverImageUrl:
    '/apis/community/company/updateCorporateProfileCoverImage.json',
  updateGroupProfileCoverImageUrl:
    '/apis/community/group/updateGroupProfileCoverImage.json',
  getCommunityNewsListUrl: '/apis/community/getCommunityNewsList.json',
  getBrowsingHistoryUrl: '/apis/community/getBrowsingHistory.json',
  addBrowsingHistoryUrl: '/apis/community/timeline/addBrowsingHistory.json',
  getPostGroupInfoUrl: '/apis/community/group/getPostGroupInfo.json',
  getJoinGroupListUrl: '/apis/community/group/getJoinGroupList.json',
  createGroupProfileUrl: '/apis/community/group/createGroupProfile.json',
  updateGroupProfileUrl: '/apis/community/group/updateGroupProfile.json',
  getCommunityGroupInvitationMemberUrl:
    '/apis/community/group/getCommunityGroupInvitationMember.json',
  postInvitationGroupMemberUrl:
    '/apis/community/group/postInvitationGroupMember.json',
  postCommentUrl: '/apis/community/timeline/postComment.json',
  getOGPDataUrl: '/apis/community/timeline/getOGPData.json',
  postReplyCommentUrl: '/apis/community/timeline/postReplyComment.json',
  postReplyChildCommentUrl:
    '/apis/community/timeline/postReplyChildComment.json',
  getRequestConnectionListUrl: '/apis/community/getRequestConnectionList.json',
  connectionListUrl: '/apis/community/connectionList.json',
  requestConnectionUrl: '/apis/community/requestConnection.json',
  cancelConnectionUrl: '/apis/community/cancelConnection.json',
  approvalConnectionUrl: '/apis/community/approvalConnection.json',
  updatePostDisplayUrl: '/apis/community/updatePostDisplay.json',
  deleteConnectionRequestUrl: '/apis/community/deleteConnectionRequest.json',
  getCommunitySearchResultDataUrl:
    '/apis/community/getCommunitySearchResultData.json',
  getCompanyDataUrl: '/apis/account/getCompanyData.json',
  getCompanyMemberListUrl: '/apis/community/company/getCompanyMemberList.json',
  getRecentlyMessageListUrl:
    '/apis/community/message/getRecentlyMessageList.json',
  updateChatReadStatusUrl: '/apis/community/message/updateChatReadStatus.json',
  getCommunityMessageListUrl:
    '/apis/community/message/getCommunityMessageList.json',
  postCommunityMessageUrl: '/apis/community/message/postCommunityMessage.json',
  deleteMessageUrl: '/apis/community/message/deleteMessage.json',
  getMessageFileUrl: '/apis/community/message/getMessageFile.json',
  deleteMessageTimelineOwnOgpUrl:
    '/apis/community/message/deleteMessageTimelineOwnOgp.json',
  startChatGroupUrl: '/apis/community/message/startChatGroup.json',
  getCustomerListUrl: '/apis/community/message/getCustomerList.json',
  savePresignedUrlForDatabaseUrl:
    '/apis/community/message/savePresignedUrlForDatabase.json',
  putFileForPresignedUrlUrl:
    '/apis/community/message/putFileForPresignedUrl.json',
  getCashFlowReportUrl: '/apis/cfm/cashFlowReport/getCashFlowReport.json',
  getSimulationListUrl: '/apis/cfm/cashFlowReport/getSimulationList.json',
  getSimulationResultsUrl: '/apis/cfm/cashFlowReport/getSimulation.json',

  cashFlowReportUrl: '/apis/cfm/cashFlowReport/pksha_mock_v2.json',
  advisorListUrl: '/apis/cfm/cashFlowReport/advisorList.json',
  simulationListUrl: '/apis/cfm/cashFlowReport/simulationList.json',
  getSimulationUrl: '/apis/cfm/cashFlowReport/getSimulation.json',
  saveSimulationUrl: '/apis/cfm/cashFlowReport/saveSimulation.json',
  deleteSimulationUrl: '/apis/cfm/cashFlowReport/deleteSimulation.json',
  getAdvisorsListUrl: '/apis/cfm/advisorsList/getAdvisorsList.json',
  getAdviceInfoUrl: '/apis/cfm/simulationResults/getAdviceInfo.json',
  checkSameMailAddressUrl: '/apis/request/checkSameMailAddress.json',
  getActivateDataUrl: '/apis/account/connect/getActivateData.json',
  registUsageApplicationFormUrl:
    '/apis/request/registUsageApplicationForm.json',
  putCancellationUrl: '/apis/cancel/putCancellation.json',
  getCancelNoticeUrl: '/apis/account/dashboard/getCancelNotice.json',
  getContractInformationUrl:
    '/apis/account/dashboard/getContractInformation.json',
  getContractRecordVersionUrl:
    '/apis/account/contract/getContractRecordVersion.json',
  getInvitationListUrl: '/apis/account/invitation/getInvitationList.json',
  sendInvitationMailUrl: '/apis/account/invitation/sendInvitationMail.json',
  getAccountListUrl: '/apis/account/users/getAccountList.json',
  getNewAccountDetailUrl: '/apis/account/users/edit/getNewAccountDetail.json',
  createNewAccountDetailUrl:
    '/apis/account/users/edit/createNewAccountDetail.json',
  getAccountDetailUrl: '/apis/account/users/edit/getAccountDetail.json',
  updateAccountDetailUrl: '/apis/account/users/edit/updateAccountDetail.json',
  deleteAccountUrl: '/apis/account/users/edit/deleteAccount.json',
  getAccountDetailHeaderUrl: '/apis/account/header/getAccountDetailHeader.json',
  updateAccountDetailHeaderUrl:
    '/apis/account/header/updateAccountDetailHeader.json',
  getContractPlanUrl: '/apis/account/contract/getContractPlan.json',
  checkApplicationOwnDomainOptionUrl:
    '/apis/account/contract/checkApplicationOwnDomainOption.json',
  confirmedSubdomainUrl: '/apis/account/contract/confirmedSubdomain.json',
  getAccountTagUrl: '/apis/account/tag/getAccountTag.json',
  updateAccountTagUrl: '/apis/account/tag/updateAccountTag.json',
  getAccountCommonSettingsUrl:
    '/apis/account/analytics/getAccountCommonSettings.json',
  updateAccountCommonSettingsUrl:
    '/apis/account/analytics/updateAccountCommonSettings.json',
  resendInvitationMailUrl:
    '/apis/account/analytics/updateAccountCommonSettings.json',

  updateCorporateCoverImageUrl:
    '/apis/account/corporate/updateCorporateCoverImage.json',
  updateCorporateDataUrl: '/apis/account/corporate/updateCorporateData.json',
  updateCorporateProfileDataUrl:
    '/apis/account/updateCorporateProfileData.json',
  getAddress: 'https://zipcloud.ibsnet.co.jp/api/search',
  getSaveConditionsUrl: '/apis/mmi/getSaveConditions.json',
  insertSaveConditionsUrl: '/apis/mmi/insertSaveConditions.json',
  deleteSaveConditionsUrl: '/apis/mmi/deleteSaveConditions.json',
  getMmiFunctionAuthorityUrl: '/apis/mmi/functionAuthority.json',
  putMmiActivateUrl: '/apis/mmi/activate.json',
  getMmiActivatedStateUrl: '/apis/mmi/activatedInfo.json',
  getMmiOwnCompanyUrl: '/apis/mmi/ownCompany.json',
  getMmiIndustriesUrl: '/apis/mmi/staticIndustries.json',
  getMmiTermUrl: '/apis/mmi/staticTerm.json',
  getCompanyMasterDataUrl: '/apis/common/getCompanyMasterData.json',
  getMmiAdvisorsUrl: '/apis/mmi/advisors.json',
  putMmiUpdateTenantInfoUrl: '/apis/mmi/putUpdateTenantInfo.json',
  postInvitationAccountUrl: '/apis/invitation/postInvitationAccount.json',
  getInvitationRecordVersionUrl:
    '/apis/invitation/recordVersion/getInvitationRecordVersion.json',
  getStorageObjectsUrl: '/apis/storage/getStorageObjects.json',
  getStorageSharedUrl: '/apis/storage/objects/getStorageShared.json',
  getStorageRecentUrl: '/apis/storage/objects/getStorageRecent.json',
  getStorageDeletedUrl: '/apis/storage/objects/getStorageDelete.json',
  getStoragePinUrl: '/apis/storage/objects/getStoragePin.json',
  createStorageFoldersUrl: '/apis/storage/createStorageFolders.json',
  getStorageUploadUrlUrl: '/apis/storage/getStorageUploadUrl.json',
  putStorageFileForUploadUrlUrl:
    '/apis/storage/putStorageFileForUploadUrl.json',
  registStorageFilesUrl: '/apis/storage/registStorageFiles.json',
  deleteStorageObjectsUrl: '/apis/storage/deleteStorageObjects.json',
  copyStorageObjectUrl: '/apis/storage/copyStorageObject.json',
  getStorageShareLinksUrl:
    '/apis/storage/share-links/getStorageShareLinks.json',
  updateStorageFoldersUrl: '/apis/storage/folders/updateStorageFolders.json',
  updateStorageFilesUrl: '/apis/storage/files/updateStorageFiles.json',
  moveStorageDataUrl: '/apis/storage/objects/moveStorageData.json',
  updateStorageRestoreUrl: '/apis/storage/objects/updateStorageRestore.json',
  getStorageDownloadUrl: '/apis/storage/getStorageDownload.json',
  getStorageDownloadShareUrl:
    '/apis/storage/share-links/getStorageDownloadShare.json',
  getStorageShareableMembersUrl:
    '/apis/storage/getStorageShareableMembers.json',
  getStorageSearchUrl: '/apis/storage/objects/getStorageSearch.json',
  getStorageShareFoldersMembersUrl:
    '/apis/storage/share-folders/getStorageShareFoldersMembers.json',
  createStorageShareFoldersUrl: '/apis/storage/createStorageShareFolders.json',
  updateStorageShareLinkUrl:
    '/apis/storage/objects/updateStorageShareLink.json',
  updateStoragePinUrl: '/apis/storage/objects/updateStoragePin.json',
  getAdvisoryCompanyRecordVersionUrl:
    '/apis/invitation/advisoryCompany/getAdvisoryCompanyRecordVersion.json',
  postAdvisoryCompanyUrl:
    '/apis/invitation/advisoryCompany/postAdvisoryCompany.json',
  getMailDetailUrl: '/apis/mail/editMailSettings/getMailDetail.json',
  updateEditMailSettingsUrl:
    '/apis/mail/editMailSettings/updateEditMailSettings.json',
  getMailContactsDistributionUrl:
    '/apis/mail/editMailSettings/getMailContactsDistribution.json',
  getMailContactCountUrl:
    '/apis/mail/editMailSettings/getMailContactCount.json',
  getMailContactsCsvUrl: '/apis/mail/editMailSettings/getMailContactsCsv.json',
  sendMailDataUrl: '/apis/mail/editMailSettings/sendMailData.json',
  getMailBasicSettingsUrl: '/apis/mail/basicSettings/getMailBasicSettings.json',
  updateMailBasicSettingsUrl:
    '/apis/mail/basicSettings/updateMailBasicSettings.json',
  getDefinitionsUrl: '/apis/contact/getDefinitions.json',
  getContactListUrl: '/apis/contact/list/getContactList.json',
  downloadContactListUrl: '/apis/contact/list/downloadContactList.json',
  deleteContactDataUrl: '/apis/contact/list/deleteContactData.json',
  createContactDetailUrl: '/apis/contact/edit/createContactDetail.json',
  getContactDetailUrl: '/apis/contact/edit/getContactDetail.json',
  updateContactDetailUrl: '/apis/contact/edit/updateContactDetail.json',
  updateContactDetailCsvUrl: '/apis/contact/edit/updateContactDetailCsv.json',
  createTargetListUrl: '/apis/contact/list/createTargetList.json',
  updateDisplayItemListUrl:
    '/apis/invitation/advisoryCompany/updateDataItemDefinitions.json',
  getDataItemDefinitionsUrl: '/apis/contact/getDataItemDefinitions.json',
  saveDataItemDefinitionsUrl: '/apis/contact/saveDataItemDefinitions.json',
  deleteDataItemDefinitionsUrl: '/apis/contact/deliteDataItemDefinitions.json',
  createMailUrl: '/apis/contact/createMail.json',
  getMailListDataUrl: '/apis/mail/mailList/getMailListData.json',
  deleteMailUrl: '/apis/mail/mailList/deleteMail.json',
  postMailCopyUrl: '/apis/mail/mailList/postMailCopy.json',
  getMailSendReportUrl: '/apis/mail/mailReport/getMailSendReport.json',
  postMailCreateUrl: '/apis/mail/mailList/postMailCreate.json',
}
