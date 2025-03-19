import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
	NodeOperationError,
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

		// Get common parameters
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;
		const credentials = await this.getCredentials('connectWiseManageApi');

		// Define API version and base URL
		const apiVersion = 'v4_6_release/apis/3.0';
		const baseUrl = `${credentials.siteUrl}/${apiVersion}`;

		// Helper function to make API requests (defined inside execute to access the correct 'this' context)
		const makeApiRequest = async (
			method: Methods,
			uri: string,
			body: IDataObject = {},
			qs: IDataObject = {},
		) => {
			const options: IRequestOptions = {
				headers: {
					'Content-Type': 'application/json',
				},
				method,
				uri,
				json: true,
			};

			if (Object.keys(body).length > 0) {
				options.body = body;
			}

			if (Object.keys(qs).length > 0) {
				options.qs = qs;
			}

			return this.helpers.requestWithAuthentication.call(this, 'connectWiseManageApi', options);
		};

		// Resource configuration mapping
		const resourceConfig: ResourceConfig = {
			time: {
				endpoint: 'time/entries',
				primaryKey: 'timeEntryId',
				requiredCreateFields: ['timeStart'],
			},
			purchaseOrder: {
				endpoint: 'procurement/purchaseorders',
				primaryKey: 'purchaseOrderId',
				requiredCreateFields: ['vendorId'],
			},
			schedule: {
				endpoint: 'schedule/entries',
				primaryKey: 'scheduleId',
				requiredCreateFields: ['objectType', 'objectId'],
			},
			productCatalog: {
				endpoint: 'procurement/catalog',
				primaryKey: 'productId',
				requiredCreateFields: ['name'],
			},
			opportunity: {
				endpoint: 'sales/opportunities',
				primaryKey: 'opportunityId',
				requiredCreateFields: ['name'],
			},
			member: {
				endpoint: 'system/members',
				primaryKey: 'memberId',
				requiredCreateFields: ['identifier'],
			},
			project: {
				endpoint: 'project/projects',
				primaryKey: 'projectId',
				requiredCreateFields: ['name'],
			},
			invoice: {
				endpoint: 'finance/invoices',
				primaryKey: 'invoiceId',
				requiredCreateFields: ['company'],
			},
			expense: {
				endpoint: 'expense/expenses',
				primaryKey: 'expenseId',
				requiredCreateFields: ['description'],
			},
			contact: {
				endpoint: 'company/contacts',
				primaryKey: 'contactId',
				requiredCreateFields: ['firstName', 'lastName'],
			},
			configuration: {
				endpoint: 'company/configurations',
				primaryKey: 'configurationId',
				requiredCreateFields: ['name'],
			},
			agreement: {
				endpoint: 'finance/agreements',
				primaryKey: 'agreementId',
				requiredCreateFields: ['name'],
			},
			activity: {
				endpoint: 'company/activities',
				primaryKey: 'activityId',
				requiredCreateFields: ['name'],
			},
			ticket: {
				endpoint: 'service/tickets',
				primaryKey: 'ticketId',
				requiredCreateFields: ['summary'],
				specialOperations: {
					getNotes: {
						method: Methods.GET,
						endpoint: (id) => `service/tickets/${id}/notes`,
					},
					addNote: {
						method: Methods.POST,
						endpoint: (id) => `service/tickets/${id}/notes`,
						getBody: (params) => ({
							ticketId: params.ticketId,
							text: params.noteText,
							detailDescriptionFlag: params.detailDescription,
							internalAnalysisFlag: params.internalAnalysis,
							resolutionFlag: params.resolution,
						}),
					},
				},
			},
			company: {
				endpoint: 'company/companies',
				primaryKey: 'companyId',
				requiredCreateFields: ['name'],
			},
		};

		for (let i = 0; i < length; i++) {
			try {
				let responseData;
				const currentResource = resourceConfig[resource];

				if (!currentResource) {
					throw new NodeOperationError(this.getNode(), `Resource '${resource}' is not supported`);
				}

				// Handle special operations first
				if (currentResource.specialOperations && currentResource.specialOperations[operation]) {
					const specialOp = currentResource.specialOperations[operation];
					const id = this.getNodeParameter(currentResource.primaryKey, i) as string;

					let body = {};
					if (specialOp.getBody) {
						const params: IDataObject = {};
						// Get all parameters needed for the special operation
						if (operation === 'addNote') {
							params.ticketId = id;
							params.noteText = this.getNodeParameter('noteText', i) as string;
							params.detailDescription = this.getNodeParameter('detailDescription', i) as boolean;
							params.internalAnalysis = this.getNodeParameter('internalAnalysis', i) as boolean;
							params.resolution = this.getNodeParameter('resolution', i) as boolean;
						}
						body = specialOp.getBody(params);
					}

					const options: IRequestOptions = {
						headers: { 'Content-Type': 'application/json' },
						method: specialOp.method,
						uri: `${baseUrl}/${specialOp.endpoint(id)}`,
						json: true,
					};

					if (Object.keys(body).length > 0) {
						options.body = body;
					}

					responseData = await this.helpers.requestWithAuthentication.call(
						this,
						'connectWiseManageApi',
						options,
					);
				} else {
					// Handle standard CRUD operations
					switch (operation) {
						case 'create': {
							// Get required fields for this resource
							const body: IDataObject = {};
							for (const field of currentResource.requiredCreateFields) {
								body[field] = this.getNodeParameter(field, i);
							}

							// Add any additional fields
							const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
							Object.assign(body, additionalFields);

							responseData = await makeApiRequest(
								Methods.POST,
								`${baseUrl}/${currentResource.endpoint}`,
								body,
							);
							break;
						}

						case 'get': {
							const id = this.getNodeParameter(currentResource.primaryKey, i) as string;
							responseData = await makeApiRequest(
								Methods.GET,
								`${baseUrl}/${currentResource.endpoint}/${id}`,
							);
							break;
						}

						case 'getAll': {
							const returnAll = this.getNodeParameter('returnAll', i) as boolean;
							const limit = this.getNodeParameter('limit', i, 100) as number;
							const orderBy = this.getNodeParameter('orderBy', i) as string;

							// Initialize variables for pagination
							let page = this.getNodeParameter('page', i, 1) as number;
							const pageSize = this.getNodeParameter('pageSize', i, limit) as number;
							const maxPages = returnAll ? undefined : 1;
							let allData: any[] = [];

							// Set initial query parameters
							const qs: IDataObject = {
								pageSize,
								page,
								orderBy,
							};

							// Make initial request
							let response = await makeApiRequest(
								Methods.GET,
								`${baseUrl}/${currentResource.endpoint}`,
								{},
								qs,
							);

							// If response is an array, add it to our results
							if (Array.isArray(response)) {
								allData = [...response];
							}

							// Continue fetching pages until we have all data or reach maxPages
							while (response && Array.isArray(response) && response.length === pageSize) {
								// Break if maxPages is reached
								if (maxPages && page >= maxPages) {
									break;
								}

								// Increment page number for next request
								page++;

								// Update query parameters for next page
								qs.page = page;

								// Make request for next page
								response = await makeApiRequest(
									Methods.GET,
									`${baseUrl}/${currentResource.endpoint}`,
									{},
									qs,
								);

								// Add results to accumulated data
								if (Array.isArray(response)) {
									allData.push(...response);
								}
							}

							responseData = allData;

							// If not returning all, limit the results
							if (!returnAll && Array.isArray(responseData)) {
								responseData = responseData.slice(0, limit);
							}
							break;
						}

						case 'update': {
							const id = this.getNodeParameter(currentResource.primaryKey, i) as string;
							const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

							responseData = await makeApiRequest(
								Methods.PATCH,
								`${baseUrl}/${currentResource.endpoint}/${id}`,
								additionalFields,
							);
							break;
						}

						case 'delete': {
							const id = this.getNodeParameter(currentResource.primaryKey, i) as string;

							responseData = await makeApiRequest(
								Methods.DELETE,
								`${baseUrl}/${currentResource.endpoint}/${id}`,
							);
							break;
						}

						case 'search': {
							const searchQuery = this.getNodeParameter('searchQuery', i) as string;
							const orderBy = this.getNodeParameter('orderBy', i) as string;

							const qs: IDataObject = {
								conditions: searchQuery,
								orderBy,
							};

							// Add any additional filters for ticket searches
							if (resource === 'ticket') {
								const filters = this.getNodeParameter('filters', i, {}) as IDataObject;
								Object.assign(qs, filters);
							}

							responseData = await makeApiRequest(
								Methods.GET,
								`${baseUrl}/${currentResource.endpoint}`,
								{},
								qs,
							);
							break;
						}

						default:
							throw new NodeOperationError(
								this.getNode(),
								`Operation '${operation}' is not supported for resource '${resource}'`,
							);
					}
				}

				// Format the response data
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

interface ResourceConfig {
	[key: string]: {
		endpoint: string;
		primaryKey: string;
		requiredCreateFields: string[];
		specialOperations?: {
			[key: string]: {
				method: Methods;
				endpoint: (id: string) => string;
				getBody?: (params: IDataObject) => IDataObject;
			};
		};
	};
}
