import {
	INodeType,
	INodeTypeDescription,
	IWebhookFunctions,
	IWebhookResponseData,
	IHookFunctions,
	ILoadOptionsFunctions,
	INodePropertyOptions,
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
					{ name: 'Activity', value: 'Activity' },
					{ name: 'Agreement', value: 'Agreement' },
					{ name: 'Company', value: 'Company' },
					{ name: 'Configuration', value: 'Configuration' },
					{ name: 'Contact', value: 'Contact' },
					{ name: 'Expense', value: 'Expense' },
					{ name: 'Invoice', value: 'Invoice' },
					{ name: 'Member', value: 'Member' },
					{ name: 'Opportunity', value: 'Opportunity' },
					{ name: 'Product Catalog', value: 'ProductCatalog' },
					{ name: 'Project', value: 'Project' },
					{ name: 'Purchase Order', value: 'PurchaseOrder' },
					{ name: 'Schedule', value: 'Schedule' },
					{ name: 'Service Ticket', value: 'Ticket' },
					{ name: 'Time', value: 'Time' },
				],
				default: 'Ticket',
				required: true,
				description: 'The type of event to watch',
			},
			{
				displayName: 'Level',
				name: 'level',
				type: 'options',
				required: true,
				displayOptions: {
					show: {
						type: ['Ticket'],
					},
				},
				options: [
					{ name: 'Board', value: 'Board' },
					{ name: 'Owner', value: 'Owner' },
				],
				default: 'Owner',
				description: 'The level of the callback for Service Tickets',
			},
			{
				displayName: 'Level',
				name: 'level',
				type: 'hidden',
				default: 'Owner',
				required: true,
				displayOptions: {
					hide: {
						type: ['Ticket'],
					},
				},
			},
			{
				displayName: 'Level Value Name or ID',
				name: 'levelValue',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getLevelValues',
				},
				displayOptions: {
					show: {
						type: ['Ticket'],
						level: ['Board'],
					},
				},
				default: '',
				required: true,
				description:
					'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>',
			},
			{
				displayName: 'Active',
				name: 'active',
				type: 'boolean',
				default: true,
				description: 'Whether this webhook trigger is active',
			},
		],
	};

	methods = {
		loadOptions: {
			getLevelValues: async function (
				this: ILoadOptionsFunctions,
			): Promise<INodePropertyOptions[]> {
				const options: INodePropertyOptions[] = [];
				const level = this.getCurrentNodeParameter('level') as string;

				if (level === 'Board') {
					try {
						const credentials = await this.getCredentials('connectWiseManageApi');
						const response = await this.helpers.requestWithAuthentication.call(
							this,
							'connectWiseManageApi',
							{
								method: Methods.GET,
								headers: {
									'Content-Type': 'application/json',
								},
								uri: `${credentials.siteUrl}/v4_6_release/apis/3.0/service/boards?pageSize=1000&page=1`,
								json: true,
							},
						);

						if (Array.isArray(response)) {
							for (const item of response) {
								if (item.name && item.id) {
									options.push({
										name: item.name,
										value: item.id.toString(),
									});
								}
							}
							console.log(`Found ${options.length} board options`);
						}
					} catch (error) {
						console.error('Error loading board options:', error);
					}
				}

				return options;
			},
		},
	};

	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');
				const webhookUrl = this.getNodeWebhookUrl('default') as string;
				const credentials = await this.getCredentials('connectWiseManageApi');

				try {
					const options = {
						headers: {
							'Content-Type': 'application/json',
						},
						method: Methods.GET,
						uri: `${credentials.siteUrl}/v4_6_release/apis/3.0/system/callbacks?pageSize=1000&page=1`,
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
				const webhookUrl = this.getNodeWebhookUrl('default') as string;
				const webhookData = this.getWorkflowStaticData('node');
				const credentials = await this.getCredentials('connectWiseManageApi');

				// If this is a test webhook URL, delete ALL test webhooks first
				if (webhookUrl.toLowerCase().includes('test')) {
					console.log('Test webhook detected - cleaning up all test webhooks');
					const options = {
						headers: {
							'Content-Type': 'application/json',
						},
						method: Methods.GET,
						uri: `${credentials.siteUrl}/v4_6_release/apis/3.0/system/callbacks?pageSize=1000&page=1&conditions=url like '%${webhookUrl}%'`,
						json: true,
					};

					const existingWebhooks = await this.helpers.requestWithAuthentication.call(
						this,
						'connectWiseManageApi',
						options,
					);

					for (const webhook of existingWebhooks) {
						if (webhook.url?.toLowerCase().includes('test')) {
							console.log('Deleting test webhook:', webhook);
							await this.helpers.requestWithAuthentication.call(this, 'connectWiseManageApi', {
								method: Methods.DELETE,
								uri: `${credentials.siteUrl}/v4_6_release/apis/3.0/system/callbacks/${webhook.id}`,
								json: true,
							});
							await new Promise((resolve) => setTimeout(resolve, 3000));
						}
					}
				}

				const type = this.getNodeParameter('type') as string;
				const level = this.getNodeParameter('level') as string;

				// Helper function to find and delete matching webhooks
				const cleanupExistingWebhooks = async (searchParams: {
					type: string;
					level: string;
					objectId: number;
					url?: string;
				}) => {
					try {
						const existingWebhooks = await this.helpers.requestWithAuthentication.call(
							this,
							'connectWiseManageApi',
							{
								headers: {
									'Content-Type': 'application/json',
								},
								method: Methods.GET,
								uri: `${credentials.siteUrl}/v4_6_release/apis/3.0/system/callbacks?pageSize=1000&page=1`,
								json: true,
							},
						);

						let deletedCount = 0;
						for (const webhook of existingWebhooks) {
							// Delete if:
							// 1. URL matches exactly, OR
							// 2. All criteria match (type, level, objectId)
							if (
								webhook.url === searchParams.url ||
								(webhook.type === searchParams.type &&
									webhook.objectId === searchParams.objectId) ||
								(webhook.type === searchParams.type &&
									webhook.level === 'Owner' &&
									searchParams.level === 'Owner')
							) {
								console.log('Found webhook to delete:', {
									id: webhook.id,
									url: webhook.url,
									type: webhook.type,
									level: webhook.level,
									objectId: webhook.objectId,
								});

								await this.helpers.requestWithAuthentication.call(this, 'connectWiseManageApi', {
									method: Methods.DELETE,
									uri: `${credentials.siteUrl}/v4_6_release/apis/3.0/system/callbacks/${webhook.id}`,
									json: true,
								});

								console.log('Successfully deleted webhook:', webhook.id);
								deletedCount++;

								// Add a longer delay after deletion to ensure API state is consistent
								await new Promise((resolve) => setTimeout(resolve, 3000));
							}
						}

						console.log(`Cleaned up ${deletedCount} webhook(s)`);
					} catch (error) {
						console.error('Error cleaning up webhooks:', error);
						throw error;
					}
				};

				// Then clean up any specifically matching webhooks
				await cleanupExistingWebhooks({
					type,
					level,
					objectId:
						level === 'Owner' ? 1 : parseInt(this.getNodeParameter('levelValue') as string, 10),
					url: webhookUrl,
				});

				// Create new webhook
				const active = this.getNodeParameter('active') as boolean;

				interface IWebhookBody {
					description: string;
					url: string;
					type: string;
					level: string;
					memberId: number;
					inactiveFlag: boolean;
					value?: string;
					objectId: number;
				}

				const body: IWebhookBody = {
					description: `n8n Webhook - ${type}`,
					url: webhookUrl,
					type,
					level,
					memberId: 0,
					inactiveFlag: !active,
					objectId:
						level === 'Owner'
							? 1 // Use fixed ID 1 for owner level
							: parseInt(this.getNodeParameter('levelValue') as string, 10),
				};

				console.log('Creating webhook with body:', body);

				const options = {
					headers: {
						'Content-Type': 'application/json',
					},
					method: Methods.POST,
					uri: `${credentials.siteUrl}/v4_6_release/apis/3.0/system/callbacks`,
					body,
					json: true,
				};

				const createWebhook = async (retryCount = 0): Promise<boolean> => {
					try {
						const responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'connectWiseManageApi',
							options,
						);

						console.log('Webhook created successfully:', responseData);
						webhookData.webhookId = responseData.id;
						return true;
					} catch (error) {
						console.error('Error creating webhook:', error);

						// If we get an ObjectExists error, retry with more aggressive cleanup
						if (
							error.error?.code === 'InvalidObject' &&
							error.error?.errors?.[0]?.code === 'ObjectExists' &&
							retryCount < 3
						) {
							console.log(`Webhook exists, attempting cleanup (attempt ${retryCount + 1})`);

							// For test webhooks, always clean up ALL test webhooks first
							if (webhookUrl.toLowerCase().includes('test')) {
								const options = {
									headers: {
										'Content-Type': 'application/json',
									},
									method: Methods.GET,
									uri: `${credentials.siteUrl}/v4_6_release/apis/3.0/system/callbacks?pageSize=1000&page=1`,
									json: true,
								};

								const existingWebhooks = await this.helpers.requestWithAuthentication.call(
									this,
									'connectWiseManageApi',
									options,
								);

								for (const webhook of existingWebhooks) {
									if (webhook.url?.toLowerCase().includes('test')) {
										console.log('Deleting test webhook:', webhook);
										await this.helpers.requestWithAuthentication.call(
											this,
											'connectWiseManageApi',
											{
												method: Methods.DELETE,
												uri: `${credentials.siteUrl}/v4_6_release/apis/3.0/system/callbacks/${webhook.id}`,
												json: true,
											},
										);
										await new Promise((resolve) => setTimeout(resolve, 3000));
									}
								}
							}

							// Then clean up any webhooks matching our criteria
							await cleanupExistingWebhooks({
								type: body.type,
								level: body.level,
								objectId: body.objectId,
								url: body.url,
							});

							// Add longer delay between retries, increasing with each retry
							await new Promise((resolve) => setTimeout(resolve, (retryCount + 1) * 5000));

							console.log('Retrying webhook creation after aggressive cleanup...');
							return createWebhook(retryCount + 1);
						}

						// If we've exceeded retries or got a different error, log details and throw
						if (retryCount >= 3) {
							console.error('Exceeded maximum retry attempts');
							throw new NodeOperationError(
								this.getNode(),
								'Failed to create webhook after multiple cleanup attempts. Please try again.',
							);
						}

						throw new NodeOperationError(
							this.getNode(),
							`ConnectWise Trigger Error: ${error.message}`,
						);
					}
				};

				// Start the creation process
				return await createWebhook();
			},

			async delete(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');
				const credentials = await this.getCredentials('connectWiseManageApi');

				if (!webhookData.webhookId) {
					console.log('No webhook ID found to delete');
					return true;
				}

				try {
					console.log('Deleting webhook:', webhookData.webhookId);
					await this.helpers.requestWithAuthentication.call(this, 'connectWiseManageApi', {
						method: Methods.DELETE,
						uri: `${credentials.siteUrl}/v4_6_release/apis/3.0/system/callbacks/${webhookData.webhookId}`,
						json: true,
					});

					console.log('Successfully deleted webhook');
					delete webhookData.webhookId;
					return true;
				} catch (error) {
					console.error('Error deleting webhook:', error.message);
					throw new NodeOperationError(
						this.getNode(),
						`ConnectWise Trigger Error: ${error.message}`,
					);
				}
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
