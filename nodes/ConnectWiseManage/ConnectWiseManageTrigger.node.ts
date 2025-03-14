import {
	INodeType,
	INodeTypeDescription,
	IWebhookFunctions,
	IWebhookResponseData,
	IHookFunctions,
	NodeOperationError,
} from 'n8n-workflow';

export class ConnectWiseManageTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'ConnectWise Manage Trigger',
		name: 'connectWiseManageTrigger',
		icon: 'file:connectwise.svg',
		group: ['trigger'],
		version: 1,
		description: 'Handle ConnectWise Manage events via webhooks',
		defaults: {
			name: 'ConnectWise Manage Trigger',
		},
		inputs: [],
		outputs: ['main'],
		credentials: [
			{
				name: 'connectWiseManageApi',
				required: true,
			},
		],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
			},
		],
		properties: [
			{
				displayName: 'Event Type',
				name: 'type',
				type: 'options',
				options: [
					{
						name: 'Activity',
						value: 'Activity',
					},
					{
						name: 'Opportunity',
						value: 'Opportunity',
					},
					{
						name: 'Service Ticket',
						value: 'ticket',
					},
					{
						name: 'Company',
						value: 'Company',
					},
				],
				default: 'ticket',
				required: true,
			},
			{
				displayName: 'Object ID',
				name: 'objectId',
				type: 'number',
				typeOptions: {
					minValue: 1,
				},
				default: 1,
				required: true,
				description: 'The ID of the object to watch',
			},
			{
				displayName: 'Level',
				name: 'level',
				type: 'options',
				options: [
					{
						name: 'All',
						value: 'All',
					},
					{
						name: 'Owner',
						value: 'Owner',
					},
				],
				default: 'All',
				required: true,
			},
			{
				displayName: 'Member ID',
				name: 'memberId',
				type: 'number',
				typeOptions: {
					minValue: 1,
				},
				default: 1,
				required: true,
				description: 'The ID of the member',
			},
		],
	};

	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');
				const webhookUrl = this.getNodeWebhookUrl('default');
				const credentials = await this.getCredentials('connectWiseManageApi');

				try {
					const options: IRequestOptions = {
						headers: {
							'Content-Type': 'application/json',
						},
						method: Methods.GET,
						uri: `${credentials.siteUrl}/v4_6_release/apis/3.0/system/callbacks`,
						json: true,
					};

					const responseData = await this.helpers.requestWithAuthentication.call(
						this,
						'connectWiseManageApi',
						options,
					);

					for (const webhook of responseData) {
						if (webhook.url === webhookUrl) {
							webhookData.webhookId = webhook.id;
							return true;
						}
					}

					return false;
				} catch (error) {
					throw new NodeOperationError(
						this.getNode(),
						`ConnectWise Trigger Error: ${error.message}`,
					);
				}
			},

			async create(this: IHookFunctions): Promise<boolean> {
				const webhookUrl = this.getNodeWebhookUrl('default');
				const webhookData = this.getWorkflowStaticData('node');
				const credentials = await this.getCredentials('connectWiseManageApi');

				const type = this.getNodeParameter('type') as string;
				const objectId = this.getNodeParameter('objectId') as number;
				const level = this.getNodeParameter('level') as string;
				const memberId = this.getNodeParameter('memberId') as number;

				const body = {
					description: `n8n Webhook - ${type}`,
					url: webhookUrl,
					objectId,
					type,
					level,
					memberId,
				};

				const options: IRequestOptions = {
					headers: {
						'Content-Type': 'application/json',
					},
					method: Methods.POST,
					uri: `${credentials.siteUrl}/v4_6_release/apis/3.0/system/callbacks`,
					body,
					json: true,
				};

				try {
					const responseData = await this.helpers.requestWithAuthentication.call(
						this,
						'connectWiseManageApi',
						options,
					);

					webhookData.webhookId = responseData.id;
					return true;
				} catch (error) {
					throw new NodeOperationError(
						this.getNode(),
						`ConnectWise Trigger Error: ${error.message}`,
					);
				}
			},

			async delete(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');
				const credentials = await this.getCredentials('connectWiseManageApi');

				if (webhookData.webhookId) {
					try {
						await this.helpers.requestWithAuthentication.call(this, 'connectWiseManageApi', {
							method: Methods.DELETE,
							uri: `${credentials.siteUrl}/v4_6_release/apis/3.0/system/callbacks/${webhookData.webhookId}`,
							json: true,
						});

						delete webhookData.webhookId;
						return true;
					} catch (error) {
						throw new NodeOperationError(
							this.getNode(),
							`ConnectWise Trigger Error: ${error.message}`,
						);
					}
				}

				return true;
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const req = this.getRequestObject();
		return {
			workflowData: [this.helpers.returnJsonArray(req.body)],
		};
	}
}

enum Methods {
	GET = 'GET',
	POST = 'POST',
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
