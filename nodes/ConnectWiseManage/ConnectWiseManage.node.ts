import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

export class ConnectWiseManage implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'ConnectWise Manage',
		name: 'connectWiseManage',
		icon: 'file:connectwise.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Consume ConnectWise Manage API',
		defaults: {
			name: 'ConnectWise Manage',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'connectWiseManageApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Company',
						value: 'company',
					},
					{
						name: 'Service Ticket',
						value: 'ticket',
					},
					{
						name: 'Contact',
						value: 'contact',
					},
					{
						name: 'Project',
						value: 'project',
					},
				],
				default: 'ticket',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['ticket'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a service ticket',
						action: 'Create a service ticket',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a service ticket',
						action: 'Delete a service ticket',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a service ticket by ID',
						action: 'Get a service ticket',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many service tickets',
						action: 'Get many service tickets',
					},
					{
						name: 'Search',
						value: 'search',
						description: 'Search service tickets',
						action: 'Search service tickets',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a service ticket',
						action: 'Update a service ticket',
					},
				],
				default: 'create',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['company'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get a company by ID',
						action: 'Get a company',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many companies',
						action: 'Get many companies',
					},
				],
				default: 'get',
			},
			// Ticket fields
			{
				displayName: 'Ticket ID',
				name: 'ticketId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['ticket'],
						operation: ['get', 'update', 'delete'],
					},
				},
				description: 'The ID of the service ticket',
			},
			{
				displayName: 'Summary',
				name: 'summary',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['ticket'],
						operation: ['create'],
					},
				},
				description: 'The summary/subject of the service ticket',
			},
			{
				displayName: 'Search Query',
				name: 'searchQuery',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['ticket'],
						operation: ['search'],
					},
				},
				description: 'Search query to filter tickets',
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				displayOptions: {
					show: {
						resource: ['ticket'],
						operation: ['create', 'update'],
					},
				},
				default: {},
				options: [
					{
						displayName: 'Board Name or ID',
						name: 'board',
						type: 'string',
						default: '',
						description:
							'The board to create the ticket under. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>.',
					},
					{
						displayName: 'Company Name or ID',
						name: 'company',
						type: 'string',
						default: '',
						description:
							'The company to create the ticket for. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>.',
					},
					{
						displayName: 'Initial Description',
						name: 'initialDescription',
						type: 'string',
						default: '',
						description: 'The initial description of the ticket',
					},
					{
						displayName: 'Status Name or ID',
						name: 'status',
						type: 'string',
						default: '',
						description:
							'The status to set the ticket to. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>.',
					},
					{
						displayName: 'Priority Name or ID',
						name: 'priority',
						type: 'string',
						default: '',
						description:
							'The priority to set the ticket to. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>.',
					},
				],
			},
			{
				displayName: 'Filters',
				name: 'filters',
				type: 'collection',
				placeholder: 'Add Filter',
				displayOptions: {
					show: {
						operation: ['search', 'getAll'],
					},
				},
				default: {},
				options: [
					{
						displayName: 'Status',
						name: 'status',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Priority',
						name: 'priority',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Company ID',
						name: 'company',
						type: 'string',
						default: '',
					},
				],
			},
			// Company fields
			{
				displayName: 'Company ID',
				name: 'companyId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['company'],
						operation: ['get'],
					},
				},
				description: 'The ID of the company',
			},
			{
				displayName: 'Return All',
				name: 'returnAll',
				type: 'boolean',
				displayOptions: {
					show: {
						operation: ['getAll'],
					},
				},
				default: false,
				description: 'Whether to return all results or only up to a given limit',
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				displayOptions: {
					show: {
						operation: ['getAll'],
						returnAll: [false],
					},
				},
				typeOptions: {
					minValue: 1,
				},
				default: 50,
				description: 'Max number of results to return',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const length = items.length;
		let responseData;

		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;
		const credentials = await this.getCredentials('connectWiseManageApi');

		for (let i = 0; i < length; i++) {
			try {
				if (resource === 'ticket') {
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
							uri: `${credentials.siteUrl}/v4_6_release/apis/3.0/service/tickets/search`,
							json: true,
							qs: {
								conditions: searchQuery,
								...filters,
							},
						};

						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'connectWiseManageApi',
							options,
						);
					}
				} else if (resource === 'company') {
					if (operation === 'get') {
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
					}
				}

				// For operations that return a single item, don't wrap in array
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
							error: error,
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

interface IDataObject {
	[key: string]: any;
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
