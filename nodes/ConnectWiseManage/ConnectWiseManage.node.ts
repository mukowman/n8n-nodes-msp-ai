import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
} from 'n8n-workflow';

import { properties } from './properties';

export class ConnectWiseManage implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'ConnectWise Manage',
		name: 'connectWiseManage',
		icon: 'file:connectwise.svg',
		group: ['transform'],
		usableAsTool: true,
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Consume ConnectWise Manage API',
		defaults: {
			name: 'ConnectWise Manage',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'connectWiseManageApi',
				required: true,
			},
		],
		properties,
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const length = items.length;
		let responseData;

		// First get the resource parameter
		const resource = this.getNodeParameter('resource', 0) as string;
		// Get credentials
		const credentials = await this.getCredentials('connectWiseManageApi');
		const operation = this.getNodeParameter('operation', 0) as string;
		console.log('resource:', resource);
		console.log('operation:', operation);

		for (let i = 0; i < length; i++) {
			try {
				// Handle different resources
				if (resource === 'time') {
					// Get the operation parameter only after confirming the resource is 'time'
					if (operation === 'create') {
						const timeStart = this.getNodeParameter('timeStart', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const body: IDataObject = {
							timeStart,
							...additionalFields,
						};

						const options: IRequestOptions = {
							headers: {
								'Content-Type': 'application/json',
							},
							method: Methods.POST,
							body,
							uri: `${credentials.siteUrl}/v4_6_release/apis/3.0/time/entries`,
							json: true,
						};

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'connectWiseManageApi',
							options,
						);
					} else if (operation === 'get') {
						const timeEntryId = this.getNodeParameter('timeEntryId', i) as string;

						const options: IRequestOptions = {
							headers: {
								'Content-Type': 'application/json',
							},
							method: Methods.GET,
							uri: `${credentials.siteUrl}/v4_6_release/apis/3.0/time/entries/${timeEntryId}`,
							json: true,
						};

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'connectWiseManageApi',
							options,
						);
					} else if (operation === 'getAll') {
						console.log('getAll', i);

						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const limit = this.getNodeParameter('limit', i, 100) as number;

						const options: IRequestOptions = {
							headers: {
								'Content-Type': 'application/json',
							},
							method: Methods.GET,
							uri: `${credentials.siteUrl}/v4_6_release/apis/3.0/time/entries`,
							json: true,
							qs: {
								pageSize: limit,
								orderBy: this.getNodeParameter('orderBy', i) as string,
							},
						};

						if (returnAll) {
							responseData = await this.helpers.requestWithAuthentication.call(
								this,
								'connectWiseManageApi',
								options,
							);
						} else {
							responseData = await this.helpers.requestWithAuthentication.call(
								this,
								'connectWiseManageApi',
								options,
							);
							responseData = responseData.slice(0, limit);
						}
					} else if (operation === 'update') {
						const timeEntryId = this.getNodeParameter('timeEntryId', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const options: IRequestOptions = {
							headers: {
								'Content-Type': 'application/json',
							},
							method: Methods.PATCH,
							body: {
								...additionalFields,
							},
							uri: `${credentials.siteUrl}/v4_6_release/apis/3.0/time/entries/${timeEntryId}`,
							json: true,
						};

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'connectWiseManageApi',
							options,
						);
					} else if (operation === 'delete') {
						const timeEntryId = this.getNodeParameter('timeEntryId', i) as string;

						const options: IRequestOptions = {
							headers: {
								'Content-Type': 'application/json',
							},
							method: Methods.DELETE,
							uri: `${credentials.siteUrl}/v4_6_release/apis/3.0/time/entries/${timeEntryId}`,
							json: true,
						};

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'connectWiseManageApi',
							options,
						);
					} else if (operation === 'search') {
						const searchQuery = this.getNodeParameter('searchQuery', i) as string;

						const options: IRequestOptions = {
							headers: {
								'Content-Type': 'application/json',
							},
							method: Methods.GET,
							uri: `${credentials.siteUrl}/v4_6_release/apis/3.0/time/entries`,
							json: true,
							qs: {
								conditions: searchQuery,
								orderBy: this.getNodeParameter('orderBy', i) as string,
							},
						};

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'connectWiseManageApi',
							options,
						);
					}
				} else if (resource === 'purchaseOrder') {
					if (operation === 'create') {
						const vendorId = this.getNodeParameter('vendorId', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const body: IDataObject = {
							vendorId,
							...additionalFields,
						};

						const options: IRequestOptions = {
							headers: {
								'Content-Type': 'application/json',
							},
							method: Methods.POST,
							body,
							uri: `${credentials.siteUrl}/v4_6_release/apis/3.0/procurement/purchaseorders`,
							json: true,
						};

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'connectWiseManageApi',
							options,
						);
					} else if (operation === 'get') {
						const purchaseOrderId = this.getNodeParameter('purchaseOrderId', i) as string;

						const options: IRequestOptions = {
							headers: {
								'Content-Type': 'application/json',
							},
							method: Methods.GET,
							uri: `${credentials.siteUrl}/v4_6_release/apis/3.0/procurement/purchaseorders/${purchaseOrderId}`,
							json: true,
						};

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'connectWiseManageApi',
							options,
						);
					} else if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const limit = this.getNodeParameter('limit', i, 100) as number;

						const options: IRequestOptions = {
							headers: {
								'Content-Type': 'application/json',
							},
							method: Methods.GET,
							uri: `${credentials.siteUrl}/v4_6_release/apis/3.0/procurement/purchaseorders`,
							json: true,
							qs: {
								pageSize: limit,
								orderBy: this.getNodeParameter('orderBy', i) as string,
							},
						};

						if (returnAll) {
							responseData = await this.helpers.requestWithAuthentication.call(
								this,
								'connectWiseManageApi',
								options,
							);
						} else {
							responseData = await this.helpers.requestWithAuthentication.call(
								this,
								'connectWiseManageApi',
								options,
							);
							responseData = responseData.slice(0, limit);
						}
					} else if (operation === 'update') {
						const purchaseOrderId = this.getNodeParameter('purchaseOrderId', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const options: IRequestOptions = {
							headers: {
								'Content-Type': 'application/json',
							},
							method: Methods.PATCH,
							body: {
								...additionalFields,
							},
							uri: `${credentials.siteUrl}/v4_6_release/apis/3.0/procurement/purchaseorders/${purchaseOrderId}`,
							json: true,
						};

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'connectWiseManageApi',
							options,
						);
					} else if (operation === 'delete') {
						const purchaseOrderId = this.getNodeParameter('purchaseOrderId', i) as string;

						const options: IRequestOptions = {
							headers: {
								'Content-Type': 'application/json',
							},
							method: Methods.DELETE,
							uri: `${credentials.siteUrl}/v4_6_release/apis/3.0/procurement/purchaseorders/${purchaseOrderId}`,
							json: true,
						};

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'connectWiseManageApi',
							options,
						);
					} else if (operation === 'search') {
						const searchQuery = this.getNodeParameter('searchQuery', i) as string;

						const options: IRequestOptions = {
							headers: {
								'Content-Type': 'application/json',
							},
							method: Methods.GET,
							uri: `${credentials.siteUrl}/v4_6_release/apis/3.0/procurement/purchaseorders`,
							json: true,
							qs: {
								conditions: searchQuery,
								orderBy: this.getNodeParameter('orderBy', i) as string,
							},
						};

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'connectWiseManageApi',
							options,
						);
					}
				} else if (resource === 'schedule') {
					if (operation === 'create') {
						const objectType = this.getNodeParameter('objectType', i) as string;
						const objectId = this.getNodeParameter('objectId', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const body: IDataObject = {
							objectType,
							objectId,
							...additionalFields,
						};

						const options: IRequestOptions = {
							headers: {
								'Content-Type': 'application/json',
							},
							method: Methods.POST,
							body,
							uri: `${credentials.siteUrl}/v4_6_release/apis/3.0/schedule/entries`,
							json: true,
						};

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'connectWiseManageApi',
							options,
						);
					} else if (operation === 'get') {
						const scheduleId = this.getNodeParameter('scheduleId', i) as string;

						const options: IRequestOptions = {
							headers: {
								'Content-Type': 'application/json',
							},
							method: Methods.GET,
							uri: `${credentials.siteUrl}/v4_6_release/apis/3.0/schedule/entries/${scheduleId}`,
							json: true,
						};

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'connectWiseManageApi',
							options,
						);
					} else if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const limit = this.getNodeParameter('limit', i, 100) as number;

						const options: IRequestOptions = {
							headers: {
								'Content-Type': 'application/json',
							},
							method: Methods.GET,
							uri: `${credentials.siteUrl}/v4_6_release/apis/3.0/schedule/entries`,
							json: true,
							qs: {
								pageSize: limit,
								orderBy: this.getNodeParameter('orderBy', i) as string,
							},
						};

						if (returnAll) {
							responseData = await this.helpers.requestWithAuthentication.call(
								this,
								'connectWiseManageApi',
								options,
							);
						} else {
							responseData = await this.helpers.requestWithAuthentication.call(
								this,
								'connectWiseManageApi',
								options,
							);
							responseData = responseData.slice(0, limit);
						}
					} else if (operation === 'update') {
						const scheduleId = this.getNodeParameter('scheduleId', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const options: IRequestOptions = {
							headers: {
								'Content-Type': 'application/json',
							},
							method: Methods.PATCH,
							body: {
								...additionalFields,
							},
							uri: `${credentials.siteUrl}/v4_6_release/apis/3.0/schedule/entries/${scheduleId}`,
							json: true,
						};

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'connectWiseManageApi',
							options,
						);
					} else if (operation === 'delete') {
						const scheduleId = this.getNodeParameter('scheduleId', i) as string;

						const options: IRequestOptions = {
							headers: {
								'Content-Type': 'application/json',
							},
							method: Methods.DELETE,
							uri: `${credentials.siteUrl}/v4_6_release/apis/3.0/schedule/entries/${scheduleId}`,
							json: true,
						};

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'connectWiseManageApi',
							options,
						);
					} else if (operation === 'search') {
						const searchQuery = this.getNodeParameter('searchQuery', i) as string;

						const options: IRequestOptions = {
							headers: {
								'Content-Type': 'application/json',
							},
							method: Methods.GET,
							uri: `${credentials.siteUrl}/v4_6_release/apis/3.0/schedule/entries`,
							json: true,
							qs: {
								conditions: searchQuery,
								orderBy: this.getNodeParameter('orderBy', i) as string,
							},
						};

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'connectWiseManageApi',
							options,
						);
					}
				} else if (resource === 'productCatalog') {
					if (operation === 'create') {
						const name = this.getNodeParameter('name', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const body: IDataObject = {
							name,
							...additionalFields,
						};

						const options: IRequestOptions = {
							headers: {
								'Content-Type': 'application/json',
							},
							method: Methods.POST,
							body,
							uri: `${credentials.siteUrl}/v4_6_release/apis/3.0/procurement/catalog`,
							json: true,
						};

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'connectWiseManageApi',
							options,
						);
					} else if (operation === 'get') {
						const productId = this.getNodeParameter('productId', i) as string;

						const options: IRequestOptions = {
							headers: {
								'Content-Type': 'application/json',
							},
							method: Methods.GET,
							uri: `${credentials.siteUrl}/v4_6_release/apis/3.0/procurement/catalog/${productId}`,
							json: true,
						};

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'connectWiseManageApi',
							options,
						);
					} else if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const limit = this.getNodeParameter('limit', i, 100) as number;

						const options: IRequestOptions = {
							headers: {
								'Content-Type': 'application/json',
							},
							method: Methods.GET,
							uri: `${credentials.siteUrl}/v4_6_release/apis/3.0/procurement/catalog`,
							json: true,
							qs: {
								pageSize: limit,
								orderBy: this.getNodeParameter('orderBy', i) as string,
							},
						};

						if (returnAll) {
							responseData = await this.helpers.requestWithAuthentication.call(
								this,
								'connectWiseManageApi',
								options,
							);
						} else {
							responseData = await this.helpers.requestWithAuthentication.call(
								this,
								'connectWiseManageApi',
								options,
							);
							responseData = responseData.slice(0, limit);
						}
					} else if (operation === 'update') {
						const productId = this.getNodeParameter('productId', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const options: IRequestOptions = {
							headers: {
								'Content-Type': 'application/json',
							},
							method: Methods.PATCH,
							body: {
								...additionalFields,
							},
							uri: `${credentials.siteUrl}/v4_6_release/apis/3.0/procurement/catalog/${productId}`,
							json: true,
						};

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'connectWiseManageApi',
							options,
						);
					} else if (operation === 'delete') {
						const productId = this.getNodeParameter('productId', i) as string;

						const options: IRequestOptions = {
							headers: {
								'Content-Type': 'application/json',
							},
							method: Methods.DELETE,
							uri: `${credentials.siteUrl}/v4_6_release/apis/3.0/procurement/catalog/${productId}`,
							json: true,
						};

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'connectWiseManageApi',
							options,
						);
					} else if (operation === 'search') {
						const searchQuery = this.getNodeParameter('searchQuery', i) as string;

						const options: IRequestOptions = {
							headers: {
								'Content-Type': 'application/json',
							},
							method: Methods.GET,
							uri: `${credentials.siteUrl}/v4_6_release/apis/3.0/procurement/catalog`,
							json: true,
							qs: {
								conditions: searchQuery,
								orderBy: this.getNodeParameter('orderBy', i) as string,
							},
						};

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'connectWiseManageApi',
							options,
						);
					}
				} else if (resource === 'opportunity') {
					if (operation === 'create') {
						const name = this.getNodeParameter('name', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const body: IDataObject = {
							name,
							...additionalFields,
						};

						const options: IRequestOptions = {
							headers: {
								'Content-Type': 'application/json',
							},
							method: Methods.POST,
							body,
							uri: `${credentials.siteUrl}/v4_6_release/apis/3.0/sales/opportunities`,
							json: true,
						};

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'connectWiseManageApi',
							options,
						);
					} else if (operation === 'get') {
						const opportunityId = this.getNodeParameter('opportunityId', i) as string;

						const options: IRequestOptions = {
							headers: {
								'Content-Type': 'application/json',
							},
							method: Methods.GET,
							uri: `${credentials.siteUrl}/v4_6_release/apis/3.0/sales/opportunities/${opportunityId}`,
							json: true,
						};

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'connectWiseManageApi',
							options,
						);
					} else if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const limit = this.getNodeParameter('limit', i, 100) as number;

						const options: IRequestOptions = {
							headers: {
								'Content-Type': 'application/json',
							},
							method: Methods.GET,
							uri: `${credentials.siteUrl}/v4_6_release/apis/3.0/sales/opportunities`,
							json: true,
							qs: {
								pageSize: limit,
								orderBy: this.getNodeParameter('orderBy', i) as string,
							},
						};

						if (returnAll) {
							responseData = await this.helpers.requestWithAuthentication.call(
								this,
								'connectWiseManageApi',
								options,
							);
						} else {
							responseData = await this.helpers.requestWithAuthentication.call(
								this,
								'connectWiseManageApi',
								options,
							);
							responseData = responseData.slice(0, limit);
						}
					} else if (operation === 'update') {
						const opportunityId = this.getNodeParameter('opportunityId', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const options: IRequestOptions = {
							headers: {
								'Content-Type': 'application/json',
							},
							method: Methods.PATCH,
							body: {
								...additionalFields,
							},
							uri: `${credentials.siteUrl}/v4_6_release/apis/3.0/sales/opportunities/${opportunityId}`,
							json: true,
						};

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'connectWiseManageApi',
							options,
						);
					} else if (operation === 'delete') {
						const opportunityId = this.getNodeParameter('opportunityId', i) as string;

						const options: IRequestOptions = {
							headers: {
								'Content-Type': 'application/json',
							},
							method: Methods.DELETE,
							uri: `${credentials.siteUrl}/v4_6_release/apis/3.0/sales/opportunities/${opportunityId}`,
							json: true,
						};

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'connectWiseManageApi',
							options,
						);
					} else if (operation === 'search') {
						const searchQuery = this.getNodeParameter('searchQuery', i) as string;

						const options: IRequestOptions = {
							headers: {
								'Content-Type': 'application/json',
							},
							method: Methods.GET,
							uri: `${credentials.siteUrl}/v4_6_release/apis/3.0/sales/opportunities`,
							json: true,
							qs: {
								conditions: searchQuery,
								orderBy: this.getNodeParameter('orderBy', i) as string,
							},
						};

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'connectWiseManageApi',
							options,
						);
					}
				} else if (resource === 'member') {
					if (operation === 'create') {
						const identifier = this.getNodeParameter('identifier', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const body: IDataObject = {
							identifier,
							...additionalFields,
						};

						const options: IRequestOptions = {
							headers: {
								'Content-Type': 'application/json',
							},
							method: Methods.POST,
							body,
							uri: `${credentials.siteUrl}/v4_6_release/apis/3.0/system/members`,
							json: true,
						};

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'connectWiseManageApi',
							options,
						);
					} else if (operation === 'get') {
						const memberId = this.getNodeParameter('memberId', i) as string;

						const options: IRequestOptions = {
							headers: {
								'Content-Type': 'application/json',
							},
							method: Methods.GET,
							uri: `${credentials.siteUrl}/v4_6_release/apis/3.0/system/members/${memberId}`,
							json: true,
						};

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'connectWiseManageApi',
							options,
						);
					} else if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const limit = this.getNodeParameter('limit', i, 100) as number;

						const options: IRequestOptions = {
							headers: {
								'Content-Type': 'application/json',
							},
							method: Methods.GET,
							uri: `${credentials.siteUrl}/v4_6_release/apis/3.0/system/members`,
							json: true,
							qs: {
								pageSize: limit,
								orderBy: this.getNodeParameter('orderBy', i) as string,
							},
						};

						if (returnAll) {
							responseData = await this.helpers.requestWithAuthentication.call(
								this,
								'connectWiseManageApi',
								options,
							);
						} else {
							responseData = await this.helpers.requestWithAuthentication.call(
								this,
								'connectWiseManageApi',
								options,
							);
							responseData = responseData.slice(0, limit);
						}
					} else if (operation === 'update') {
						const memberId = this.getNodeParameter('memberId', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const options: IRequestOptions = {
							headers: {
								'Content-Type': 'application/json',
							},
							method: Methods.PATCH,
							body: {
								...additionalFields,
							},
							uri: `${credentials.siteUrl}/v4_6_release/apis/3.0/system/members/${memberId}`,
							json: true,
						};

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'connectWiseManageApi',
							options,
						);
					} else if (operation === 'delete') {
						const memberId = this.getNodeParameter('memberId', i) as string;

						const options: IRequestOptions = {
							headers: {
								'Content-Type': 'application/json',
							},
							method: Methods.DELETE,
							uri: `${credentials.siteUrl}/v4_6_release/apis/3.0/system/members/${memberId}`,
							json: true,
						};

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'connectWiseManageApi',
							options,
						);
					} else if (operation === 'search') {
						const searchQuery = this.getNodeParameter('searchQuery', i) as string;

						const options: IRequestOptions = {
							headers: {
								'Content-Type': 'application/json',
							},
							method: Methods.GET,
							uri: `${credentials.siteUrl}/v4_6_release/apis/3.0/system/members`,
							json: true,
							qs: {
								conditions: searchQuery,
								orderBy: this.getNodeParameter('orderBy', i) as string,
							},
						};

						console.log('options', options);

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'connectWiseManageApi',
							options,
						);
					}
				} else if (resource === 'project') {
					if (operation === 'create') {
						const name = this.getNodeParameter('name', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const body: IDataObject = {
							name,
							...additionalFields,
						};

						const options: IRequestOptions = {
							headers: {
								'Content-Type': 'application/json',
							},
							method: Methods.POST,
							body,
							uri: `${credentials.siteUrl}/v4_6_release/apis/3.0/project/projects`,
							json: true,
						};

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'connectWiseManageApi',
							options,
						);
					} else if (operation === 'get') {
						const projectId = this.getNodeParameter('projectId', i) as string;

						const options: IRequestOptions = {
							headers: {
								'Content-Type': 'application/json',
							},
							method: Methods.GET,
							uri: `${credentials.siteUrl}/v4_6_release/apis/3.0/project/projects/${projectId}`,
							json: true,
						};

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'connectWiseManageApi',
							options,
						);
					} else if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const limit = this.getNodeParameter('limit', i, 100) as number;

						const options: IRequestOptions = {
							headers: {
								'Content-Type': 'application/json',
							},
							method: Methods.GET,
							uri: `${credentials.siteUrl}/v4_6_release/apis/3.0/project/projects`,
							json: true,
							qs: {
								pageSize: limit,
								orderBy: this.getNodeParameter('orderBy', i) as string,
							},
						};

						if (returnAll) {
							responseData = await this.helpers.requestWithAuthentication.call(
								this,
								'connectWiseManageApi',
								options,
							);
						} else {
							responseData = await this.helpers.requestWithAuthentication.call(
								this,
								'connectWiseManageApi',
								options,
							);
							responseData = responseData.slice(0, limit);
						}
					} else if (operation === 'update') {
						const projectId = this.getNodeParameter('projectId', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const options: IRequestOptions = {
							headers: {
								'Content-Type': 'application/json',
							},
							method: Methods.PATCH,
							body: {
								...additionalFields,
							},
							uri: `${credentials.siteUrl}/v4_6_release/apis/3.0/project/projects/${projectId}`,
							json: true,
						};

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'connectWiseManageApi',
							options,
						);
					} else if (operation === 'delete') {
						const projectId = this.getNodeParameter('projectId', i) as string;

						const options: IRequestOptions = {
							headers: {
								'Content-Type': 'application/json',
							},
							method: Methods.DELETE,
							uri: `${credentials.siteUrl}/v4_6_release/apis/3.0/project/projects/${projectId}`,
							json: true,
						};

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'connectWiseManageApi',
							options,
						);
					} else if (operation === 'search') {
						const searchQuery = this.getNodeParameter('searchQuery', i) as string;

						const options: IRequestOptions = {
							headers: {
								'Content-Type': 'application/json',
							},
							method: Methods.GET,
							uri: `${credentials.siteUrl}/v4_6_release/apis/3.0/project/projects`,
							json: true,
							qs: {
								conditions: searchQuery,
								orderBy: this.getNodeParameter('orderBy', i) as string,
							},
						};

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'connectWiseManageApi',
							options,
						);
					}
				} else if (resource === 'invoice') {
					if (operation === 'create') {
						const company = this.getNodeParameter('company', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const body: IDataObject = {
							company,
							...additionalFields,
						};

						const options: IRequestOptions = {
							headers: {
								'Content-Type': 'application/json',
							},
							method: Methods.POST,
							body,
							uri: `${credentials.siteUrl}/v4_6_release/apis/3.0/finance/invoices`,
							json: true,
						};

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'connectWiseManageApi',
							options,
						);
					} else if (operation === 'get') {
						const invoiceId = this.getNodeParameter('invoiceId', i) as string;

						const options: IRequestOptions = {
							headers: {
								'Content-Type': 'application/json',
							},
							method: Methods.GET,
							uri: `${credentials.siteUrl}/v4_6_release/apis/3.0/finance/invoices/${invoiceId}`,
							json: true,
						};

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'connectWiseManageApi',
							options,
						);
					} else if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const limit = this.getNodeParameter('limit', i, 100) as number;

						const options: IRequestOptions = {
							headers: {
								'Content-Type': 'application/json',
							},
							method: Methods.GET,
							uri: `${credentials.siteUrl}/v4_6_release/apis/3.0/finance/invoices`,
							json: true,
							qs: {
								pageSize: limit,
								orderBy: this.getNodeParameter('orderBy', i) as string,
							},
						};

						if (returnAll) {
							responseData = await this.helpers.requestWithAuthentication.call(
								this,
								'connectWiseManageApi',
								options,
							);
						} else {
							responseData = await this.helpers.requestWithAuthentication.call(
								this,
								'connectWiseManageApi',
								options,
							);
							responseData = responseData.slice(0, limit);
						}
					} else if (operation === 'update') {
						const invoiceId = this.getNodeParameter('invoiceId', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const options: IRequestOptions = {
							headers: {
								'Content-Type': 'application/json',
							},
							method: Methods.PATCH,
							body: {
								...additionalFields,
							},
							uri: `${credentials.siteUrl}/v4_6_release/apis/3.0/finance/invoices/${invoiceId}`,
							json: true,
						};

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'connectWiseManageApi',
							options,
						);
					} else if (operation === 'delete') {
						const invoiceId = this.getNodeParameter('invoiceId', i) as string;

						const options: IRequestOptions = {
							headers: {
								'Content-Type': 'application/json',
							},
							method: Methods.DELETE,
							uri: `${credentials.siteUrl}/v4_6_release/apis/3.0/finance/invoices/${invoiceId}`,
							json: true,
						};

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'connectWiseManageApi',
							options,
						);
					} else if (operation === 'search') {
						const searchQuery = this.getNodeParameter('searchQuery', i) as string;

						const options: IRequestOptions = {
							headers: {
								'Content-Type': 'application/json',
							},
							method: Methods.GET,
							uri: `${credentials.siteUrl}/v4_6_release/apis/3.0/finance/invoices`,
							json: true,
							qs: {
								conditions: searchQuery,
								orderBy: this.getNodeParameter('orderBy', i) as string,
							},
						};

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'connectWiseManageApi',
							options,
						);
					}
				} else if (resource === 'expense') {
					if (operation === 'create') {
						const description = this.getNodeParameter('description', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const body: IDataObject = {
							description,
							...additionalFields,
						};

						const options: IRequestOptions = {
							headers: {
								'Content-Type': 'application/json',
							},
							method: Methods.POST,
							body,
							uri: `${credentials.siteUrl}/v4_6_release/apis/3.0/expense/expenses`,
							json: true,
						};

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'connectWiseManageApi',
							options,
						);
					} else if (operation === 'get') {
						const expenseId = this.getNodeParameter('expenseId', i) as string;

						const options: IRequestOptions = {
							headers: {
								'Content-Type': 'application/json',
							},
							method: Methods.GET,
							uri: `${credentials.siteUrl}/v4_6_release/apis/3.0/expense/expenses/${expenseId}`,
							json: true,
						};

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'connectWiseManageApi',
							options,
						);
					} else if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const limit = this.getNodeParameter('limit', i, 100) as number;

						const options: IRequestOptions = {
							headers: {
								'Content-Type': 'application/json',
							},
							method: Methods.GET,
							uri: `${credentials.siteUrl}/v4_6_release/apis/3.0/expense/expenses`,
							json: true,
							qs: {
								pageSize: limit,
								orderBy: this.getNodeParameter('orderBy', i) as string,
							},
						};

						if (returnAll) {
							responseData = await this.helpers.requestWithAuthentication.call(
								this,
								'connectWiseManageApi',
								options,
							);
						} else {
							responseData = await this.helpers.requestWithAuthentication.call(
								this,
								'connectWiseManageApi',
								options,
							);
							responseData = responseData.slice(0, limit);
						}
					} else if (operation === 'update') {
						const expenseId = this.getNodeParameter('expenseId', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const options: IRequestOptions = {
							headers: {
								'Content-Type': 'application/json',
							},
							method: Methods.PATCH,
							body: {
								...additionalFields,
							},
							uri: `${credentials.siteUrl}/v4_6_release/apis/3.0/expense/expenses/${expenseId}`,
							json: true,
						};

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'connectWiseManageApi',
							options,
						);
					} else if (operation === 'delete') {
						const expenseId = this.getNodeParameter('expenseId', i) as string;

						const options: IRequestOptions = {
							headers: {
								'Content-Type': 'application/json',
							},
							method: Methods.DELETE,
							uri: `${credentials.siteUrl}/v4_6_release/apis/3.0/expense/expenses/${expenseId}`,
							json: true,
						};

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'connectWiseManageApi',
							options,
						);
					} else if (operation === 'search') {
						const searchQuery = this.getNodeParameter('searchQuery', i) as string;

						const options: IRequestOptions = {
							headers: {
								'Content-Type': 'application/json',
							},
							method: Methods.GET,
							uri: `${credentials.siteUrl}/v4_6_release/apis/3.0/expense/expenses`,
							json: true,
							qs: {
								conditions: searchQuery,
								orderBy: this.getNodeParameter('orderBy', i) as string,
							},
						};

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'connectWiseManageApi',
							options,
						);
					}
				} else if (resource === 'contact') {
					if (operation === 'create') {
						const firstName = this.getNodeParameter('firstName', i) as string;
						const lastName = this.getNodeParameter('lastName', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const body: IDataObject = {
							firstName,
							lastName,
							...additionalFields,
						};

						const options: IRequestOptions = {
							headers: {
								'Content-Type': 'application/json',
							},
							method: Methods.POST,
							body,
							uri: `${credentials.siteUrl}/v4_6_release/apis/3.0/company/contacts`,
							json: true,
						};

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'connectWiseManageApi',
							options,
						);
					} else if (operation === 'get') {
						const contactId = this.getNodeParameter('contactId', i) as string;

						const options: IRequestOptions = {
							headers: {
								'Content-Type': 'application/json',
							},
							method: Methods.GET,
							uri: `${credentials.siteUrl}/v4_6_release/apis/3.0/company/contacts/${contactId}`,
							json: true,
						};

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'connectWiseManageApi',
							options,
						);
					} else if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const limit = this.getNodeParameter('limit', i, 100) as number;

						const options: IRequestOptions = {
							headers: {
								'Content-Type': 'application/json',
							},
							method: Methods.GET,
							uri: `${credentials.siteUrl}/v4_6_release/apis/3.0/company/contacts`,
							json: true,
							qs: {
								pageSize: limit,
								orderBy: this.getNodeParameter('orderBy', i) as string,
							},
						};

						if (returnAll) {
							responseData = await this.helpers.requestWithAuthentication.call(
								this,
								'connectWiseManageApi',
								options,
							);
						} else {
							responseData = await this.helpers.requestWithAuthentication.call(
								this,
								'connectWiseManageApi',
								options,
							);
							responseData = responseData.slice(0, limit);
						}
					} else if (operation === 'update') {
						const contactId = this.getNodeParameter('contactId', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const options: IRequestOptions = {
							headers: {
								'Content-Type': 'application/json',
							},
							method: Methods.PATCH,
							body: {
								...additionalFields,
							},
							uri: `${credentials.siteUrl}/v4_6_release/apis/3.0/company/contacts/${contactId}`,
							json: true,
						};

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'connectWiseManageApi',
							options,
						);
					} else if (operation === 'delete') {
						const contactId = this.getNodeParameter('contactId', i) as string;

						const options: IRequestOptions = {
							headers: {
								'Content-Type': 'application/json',
							},
							method: Methods.DELETE,
							uri: `${credentials.siteUrl}/v4_6_release/apis/3.0/company/contacts/${contactId}`,
							json: true,
						};

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'connectWiseManageApi',
							options,
						);
					} else if (operation === 'search') {
						const searchQuery = this.getNodeParameter('searchQuery', i) as string;

						const options: IRequestOptions = {
							headers: {
								'Content-Type': 'application/json',
							},
							method: Methods.GET,
							uri: `${credentials.siteUrl}/v4_6_release/apis/3.0/company/contacts`,
							json: true,
							qs: {
								conditions: searchQuery,
								orderBy: this.getNodeParameter('orderBy', i) as string,
							},
						};

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'connectWiseManageApi',
							options,
						);
					}
				} else if (resource === 'configuration') {
					if (operation === 'create') {
						const name = this.getNodeParameter('name', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const body: IDataObject = {
							name,
							...additionalFields,
						};

						const options: IRequestOptions = {
							headers: {
								'Content-Type': 'application/json',
							},
							method: Methods.POST,
							body,
							uri: `${credentials.siteUrl}/v4_6_release/apis/3.0/company/configurations`,
							json: true,
						};

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'connectWiseManageApi',
							options,
						);
					} else if (operation === 'get') {
						const configurationId = this.getNodeParameter('configurationId', i) as string;

						const options: IRequestOptions = {
							headers: {
								'Content-Type': 'application/json',
							},
							method: Methods.GET,
							uri: `${credentials.siteUrl}/v4_6_release/apis/3.0/company/configurations/${configurationId}`,
							json: true,
						};

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'connectWiseManageApi',
							options,
						);
					} else if (operation === 'getAll') {
						console.log('returnAll', i);
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const limit = this.getNodeParameter('limit', i, 100) as number;

						const options: IRequestOptions = {
							headers: {
								'Content-Type': 'application/json',
							},
							method: Methods.GET,
							uri: `${credentials.siteUrl}/v4_6_release/apis/3.0/company/configurations`,
							json: true,
							qs: {
								pageSize: limit,
								orderBy: this.getNodeParameter('orderBy', i) as string,
							},
						};

						if (returnAll) {
							responseData = await this.helpers.requestWithAuthentication.call(
								this,
								'connectWiseManageApi',
								options,
							);
						} else {
							responseData = await this.helpers.requestWithAuthentication.call(
								this,
								'connectWiseManageApi',
								options,
							);
							responseData = responseData.slice(0, limit);
						}
					} else if (operation === 'update') {
						const configurationId = this.getNodeParameter('configurationId', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const options: IRequestOptions = {
							headers: {
								'Content-Type': 'application/json',
							},
							method: Methods.PATCH,
							body: {
								...additionalFields,
							},
							uri: `${credentials.siteUrl}/v4_6_release/apis/3.0/company/configurations/${configurationId}`,
							json: true,
						};

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'connectWiseManageApi',
							options,
						);
					} else if (operation === 'delete') {
						const configurationId = this.getNodeParameter('configurationId', i) as string;

						const options: IRequestOptions = {
							headers: {
								'Content-Type': 'application/json',
							},
							method: Methods.DELETE,
							uri: `${credentials.siteUrl}/v4_6_release/apis/3.0/company/configurations/${configurationId}`,
							json: true,
						};

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'connectWiseManageApi',
							options,
						);
					} else if (operation === 'search') {
						const searchQuery = this.getNodeParameter('searchQuery', i) as string;

						const options: IRequestOptions = {
							headers: {
								'Content-Type': 'application/json',
							},
							method: Methods.GET,
							uri: `${credentials.siteUrl}/v4_6_release/apis/3.0/company/configurations`,
							json: true,
							qs: {
								conditions: searchQuery,
								orderBy: this.getNodeParameter('orderBy', i) as string,
							},
						};

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'connectWiseManageApi',
							options,
						);
					}
				} else if (resource === 'agreement') {
					if (operation === 'create') {
						const name = this.getNodeParameter('name', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const body: IDataObject = {
							name,
							...additionalFields,
						};

						const options: IRequestOptions = {
							headers: {
								'Content-Type': 'application/json',
							},
							method: Methods.POST,
							body,
							uri: `${credentials.siteUrl}/v4_6_release/apis/3.0/finance/agreements`,
							json: true,
						};

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'connectWiseManageApi',
							options,
						);
					} else if (operation === 'get') {
						const agreementId = this.getNodeParameter('agreementId', i) as string;

						const options: IRequestOptions = {
							headers: {
								'Content-Type': 'application/json',
							},
							method: Methods.GET,
							uri: `${credentials.siteUrl}/v4_6_release/apis/3.0/finance/agreements/${agreementId}`,
							json: true,
						};

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'connectWiseManageApi',
							options,
						);
					} else if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const limit = this.getNodeParameter('limit', i, 100) as number;

						const options: IRequestOptions = {
							headers: {
								'Content-Type': 'application/json',
							},
							method: Methods.GET,
							uri: `${credentials.siteUrl}/v4_6_release/apis/3.0/finance/agreements`,
							json: true,
							qs: {
								pageSize: limit,
								orderBy: this.getNodeParameter('orderBy', i) as string,
							},
						};

						if (returnAll) {
							responseData = await this.helpers.requestWithAuthentication.call(
								this,
								'connectWiseManageApi',
								options,
							);
						} else {
							responseData = await this.helpers.requestWithAuthentication.call(
								this,
								'connectWiseManageApi',
								options,
							);
							responseData = responseData.slice(0, limit);
						}
					} else if (operation === 'update') {
						const agreementId = this.getNodeParameter('agreementId', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const options: IRequestOptions = {
							headers: {
								'Content-Type': 'application/json',
							},
							method: Methods.PATCH,
							body: {
								...additionalFields,
							},
							uri: `${credentials.siteUrl}/v4_6_release/apis/3.0/finance/agreements/${agreementId}`,
							json: true,
						};

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'connectWiseManageApi',
							options,
						);
					} else if (operation === 'delete') {
						const agreementId = this.getNodeParameter('agreementId', i) as string;

						const options: IRequestOptions = {
							headers: {
								'Content-Type': 'application/json',
							},
							method: Methods.DELETE,
							uri: `${credentials.siteUrl}/v4_6_release/apis/3.0/finance/agreements/${agreementId}`,
							json: true,
						};

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'connectWiseManageApi',
							options,
						);
					} else if (operation === 'search') {
						const searchQuery = this.getNodeParameter('searchQuery', i) as string;

						const options: IRequestOptions = {
							headers: {
								'Content-Type': 'application/json',
							},
							method: Methods.GET,
							uri: `${credentials.siteUrl}/v4_6_release/apis/3.0/finance/agreements`,
							json: true,
							qs: {
								conditions: searchQuery,
								orderBy: this.getNodeParameter('orderBy', i) as string,
							},
						};

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'connectWiseManageApi',
							options,
						);
					}
				} else if (resource === 'activity') {
					if (operation === 'create') {
						const name = this.getNodeParameter('name', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const body: IDataObject = {
							name,
							...additionalFields,
						};

						const options: IRequestOptions = {
							headers: {
								'Content-Type': 'application/json',
							},
							method: Methods.POST,
							body,
							uri: `${credentials.siteUrl}/v4_6_release/apis/3.0/company/activities`,
							json: true,
						};

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'connectWiseManageApi',
							options,
						);
					} else if (operation === 'get') {
						const activityId = this.getNodeParameter('activityId', i) as string;

						const options: IRequestOptions = {
							headers: {
								'Content-Type': 'application/json',
							},
							method: Methods.GET,
							uri: `${credentials.siteUrl}/v4_6_release/apis/3.0/company/activities/${activityId}`,
							json: true,
						};

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'connectWiseManageApi',
							options,
						);
					} else if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const limit = this.getNodeParameter('limit', i, 100) as number;

						const options: IRequestOptions = {
							headers: {
								'Content-Type': 'application/json',
							},
							method: Methods.GET,
							uri: `${credentials.siteUrl}/v4_6_release/apis/3.0/company/activities`,
							json: true,
							qs: {
								pageSize: limit,
								orderBy: this.getNodeParameter('orderBy', i) as string,
							},
						};

						if (returnAll) {
							responseData = await this.helpers.requestWithAuthentication.call(
								this,
								'connectWiseManageApi',
								options,
							);
						} else {
							responseData = await this.helpers.requestWithAuthentication.call(
								this,
								'connectWiseManageApi',
								options,
							);
							responseData = responseData.slice(0, limit);
						}
					} else if (operation === 'update') {
						const activityId = this.getNodeParameter('activityId', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const options: IRequestOptions = {
							headers: {
								'Content-Type': 'application/json',
							},
							method: Methods.PATCH,
							body: {
								...additionalFields,
							},
							uri: `${credentials.siteUrl}/v4_6_release/apis/3.0/company/activities/${activityId}`,
							json: true,
						};

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'connectWiseManageApi',
							options,
						);
					} else if (operation === 'delete') {
						const activityId = this.getNodeParameter('activityId', i) as string;

						const options: IRequestOptions = {
							headers: {
								'Content-Type': 'application/json',
							},
							method: Methods.DELETE,
							uri: `${credentials.siteUrl}/v4_6_release/apis/3.0/company/activities/${activityId}`,
							json: true,
						};

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'connectWiseManageApi',
							options,
						);
					} else if (operation === 'search') {
						const searchQuery = this.getNodeParameter('searchQuery', i) as string;

						const options: IRequestOptions = {
							headers: {
								'Content-Type': 'application/json',
							},
							method: Methods.GET,
							uri: `${credentials.siteUrl}/v4_6_release/apis/3.0/company/activities`,
							json: true,
							qs: {
								conditions: searchQuery,
								orderBy: this.getNodeParameter('orderBy', i) as string,
							},
						};

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'connectWiseManageApi',
							options,
						);
					}
				} else if (resource === 'ticket') {
					if (operation === 'create') {
						const summary = this.getNodeParameter('summary', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const body: IDataObject = {
							summary,
							...additionalFields,
						};

						const options: IRequestOptions = {
							headers: {
								'Content-Type': 'application/json',
							},
							method: Methods.POST,
							body,
							uri: `${credentials.siteUrl}/v4_6_release/apis/3.0/service/tickets`,
							json: true,
						};

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'connectWiseManageApi',
							options,
						);
					} else if (operation === 'get') {
						const ticketId = this.getNodeParameter('ticketId', i) as string;

						const options: IRequestOptions = {
							headers: {
								'Content-Type': 'application/json',
							},
							method: Methods.GET,
							uri: `${credentials.siteUrl}/v4_6_release/apis/3.0/service/tickets/${ticketId}`,
							json: true,
						};

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'connectWiseManageApi',
							options,
						);
					} else if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const limit = this.getNodeParameter('limit', i, 100) as number;

						const options: IRequestOptions = {
							headers: {
								'Content-Type': 'application/json',
							},
							method: Methods.GET,
							uri: `${credentials.siteUrl}/v4_6_release/apis/3.0/service/tickets`,
							json: true,
							qs: {
								pageSize: limit,
								orderBy: this.getNodeParameter('orderBy', i) as string,
							},
						};

						if (returnAll) {
							responseData = await this.helpers.requestWithAuthentication.call(
								this,
								'connectWiseManageApi',
								options,
							);
						} else {
							responseData = await this.helpers.requestWithAuthentication.call(
								this,
								'connectWiseManageApi',
								options,
							);
							responseData = responseData.slice(0, limit);
						}
					} else if (operation === 'update') {
						const ticketId = this.getNodeParameter('ticketId', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const options: IRequestOptions = {
							headers: {
								'Content-Type': 'application/json',
							},
							method: Methods.PATCH,
							body: {
								...additionalFields,
							},
							uri: `${credentials.siteUrl}/v4_6_release/apis/3.0/service/tickets/${ticketId}`,
							json: true,
						};

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'connectWiseManageApi',
							options,
						);
					} else if (operation === 'delete') {
						const ticketId = this.getNodeParameter('ticketId', i) as string;

						const options: IRequestOptions = {
							headers: {
								'Content-Type': 'application/json',
							},
							method: Methods.DELETE,
							uri: `${credentials.siteUrl}/v4_6_release/apis/3.0/service/tickets/${ticketId}`,
							json: true,
						};

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'connectWiseManageApi',
							options,
						);
					} else if (operation === 'search') {
						const searchQuery = this.getNodeParameter('searchQuery', i) as string;
						const filters = this.getNodeParameter('filters', i) as IDataObject;

						const options: IRequestOptions = {
							headers: {
								'Content-Type': 'application/json',
							},
							method: Methods.GET,
							uri: `${credentials.siteUrl}/v4_6_release/apis/3.0/service/tickets`,
							json: true,
							qs: {
								conditions: searchQuery,
								orderBy: this.getNodeParameter('orderBy', i) as string,
								...filters,
							},
						};

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'connectWiseManageApi',
							options,
						);
					} else if (operation === 'getNotes') {
						const ticketId = this.getNodeParameter('ticketId', i) as string;

						const options: IRequestOptions = {
							headers: {
								'Content-Type': 'application/json',
							},
							method: Methods.GET,
							uri: `${credentials.siteUrl}/v4_6_release/apis/3.0/service/tickets/${ticketId}/notes`,
							json: true,
						};

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'connectWiseManageApi',
							options,
						);
					} else if (operation === 'addNote') {
						const ticketId = this.getNodeParameter('ticketId', i) as string;
						const noteText = this.getNodeParameter('noteText', i) as string;

						const options: IRequestOptions = {
							headers: {
								'Content-Type': 'application/json',
							},
							method: Methods.POST,
							body: {
								ticketId,
								text: noteText,
								detailDescriptionFlag: this.getNodeParameter('detailDescription', i) as boolean,
								internalAnalysisFlag: this.getNodeParameter('internalAnalysis', i) as boolean,
								resolutionFlag: this.getNodeParameter('resolution', i) as boolean,
							},
							uri: `${credentials.siteUrl}/v4_6_release/apis/3.0/service/tickets/${ticketId}/notes`,
							json: true,
						};

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'connectWiseManageApi',
							options,
						);
					}
				} else if (resource === 'company') {
					if (operation === 'create') {
						const name = this.getNodeParameter('name', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const body: IDataObject = {
							name,
							...additionalFields,
						};

						const options: IRequestOptions = {
							headers: {
								'Content-Type': 'application/json',
							},
							method: Methods.POST,
							body,
							uri: `${credentials.siteUrl}/v4_6_release/apis/3.0/company/companies`,
							json: true,
						};

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'connectWiseManageApi',
							options,
						);
					} else if (operation === 'get') {
						const companyId = this.getNodeParameter('companyId', i) as string;

						const options: IRequestOptions = {
							headers: {
								'Content-Type': 'application/json',
							},
							method: Methods.GET,
							uri: `${credentials.siteUrl}/v4_6_release/apis/3.0/company/companies/${companyId}`,
							json: true,
						};

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'connectWiseManageApi',
							options,
						);
					} else if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const limit = this.getNodeParameter('limit', i, 100) as number;

						const options: IRequestOptions = {
							headers: {
								'Content-Type': 'application/json',
							},
							method: Methods.GET,
							uri: `${credentials.siteUrl}/v4_6_release/apis/3.0/company/companies`,
							json: true,
							qs: {
								pageSize: limit,
								orderBy: this.getNodeParameter('orderBy', i) as string,
							},
						};

						if (returnAll) {
							responseData = await this.helpers.requestWithAuthentication.call(
								this,
								'connectWiseManageApi',
								options,
							);
						} else {
							responseData = await this.helpers.requestWithAuthentication.call(
								this,
								'connectWiseManageApi',
								options,
							);
							responseData = responseData.slice(0, limit);
						}
					} else if (operation === 'update') {
						const companyId = this.getNodeParameter('companyId', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const options: IRequestOptions = {
							headers: {
								'Content-Type': 'application/json',
							},
							method: Methods.PATCH,
							body: {
								...additionalFields,
							},
							uri: `${credentials.siteUrl}/v4_6_release/apis/3.0/company/companies/${companyId}`,
							json: true,
						};

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'connectWiseManageApi',
							options,
						);
					} else if (operation === 'delete') {
						const companyId = this.getNodeParameter('companyId', i) as string;

						const options: IRequestOptions = {
							headers: {
								'Content-Type': 'application/json',
							},
							method: Methods.DELETE,
							uri: `${credentials.siteUrl}/v4_6_release/apis/3.0/company/companies/${companyId}`,
							json: true,
						};

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'connectWiseManageApi',
							options,
						);
					} else if (operation === 'search') {
						const searchQuery = this.getNodeParameter('searchQuery', i) as string;

						const options: IRequestOptions = {
							headers: {
								'Content-Type': 'application/json',
							},
							method: Methods.GET,
							uri: `${credentials.siteUrl}/v4_6_release/apis/3.0/company/companies`,
							json: true,
							qs: {
								conditions: searchQuery,
								orderBy: this.getNodeParameter('orderBy', i) as string,
							},
						};

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'connectWiseManageApi',
							options,
						);
					}
				}

				if (operation === 'get') {
					returnData.push({
						json: responseData,
					});
				} else if (Array.isArray(responseData)) {
					returnData.push.apply(
						returnData,
						responseData.map((item) => ({
							json: item,
						})),
					);
				} else {
					returnData.push({
						json: responseData,
					});
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: error.message,
						},
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}

enum Methods {
	GET = 'GET',
	POST = 'POST',
	PATCH = 'PATCH',
	DELETE = 'DELETE',
}

interface IRequestOptions {
	headers?: { [key: string]: string };
	method: Methods;
	body?: any;
	qs?: any;
	uri?: string;
	json?: boolean;
}

interface IDataObject {
	[key: string]: any;
}
