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
						name: 'Activity',
						value: 'activity',
					},
					{
						name: 'Agreement',
						value: 'agreement',
					},
					{
						name: 'Company',
						value: 'company',
					},
					{
						name: 'Configuration',
						value: 'configuration',
					},
					{
						name: 'Contact',
						value: 'contact',
					},
					{
						name: 'Expense',
						value: 'expense',
					},
					{
						name: 'Invoice',
						value: 'invoice',
					},
					{
						name: 'Member',
						value: 'member',
					},
					{
						name: 'Opportunity',
						value: 'opportunity',
					},
					{
						name: 'Product Catalog',
						value: 'productCatalog',
					},
					{
						name: 'Project',
						value: 'project',
					},
					{
						name: 'Purchase Order',
						value: 'purchaseOrder',
					},
					{
						name: 'Schedule',
						value: 'schedule',
					},
					{
						name: 'Service Ticket',
						value: 'ticket',
					},
					{
						name: 'Time',
						value: 'time',
					},
				],
				default: 'ticket',
			},
			// Order By parameter for all resources
			{
				displayName: 'Order By',
				name: 'orderBy',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['getAll', 'search'],
					},
				},
				default: '',
				description: 'Field to order results by',
			},
			// Time Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['time'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a time entry',
						action: 'Create a time entry',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a time entry',
						action: 'Delete a time entry',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a time entry by ID',
						action: 'Get a time entry',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many time entries',
						action: 'Get many time entries',
					},
					{
						name: 'Search',
						value: 'search',
						description: 'Search time entries',
						action: 'Search time entries',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a time entry',
						action: 'Update a time entry',
					},
				],
				default: 'create',
			},
			{
				displayName: 'Time Entry ID',
				name: 'timeEntryId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['time'],
						operation: ['get', 'update', 'delete'],
					},
				},
				description: 'The ID of the time entry',
			},
			{
				displayName: 'Time Start',
				name: 'timeStart',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['time'],
						operation: ['create'],
					},
				},
				description: 'Start time (YYYY-MM-DD HH:mm:ss)',
			},
			{
				displayName: 'Search Query',
				name: 'searchQuery',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['time'],
						operation: ['search'],
					},
				},
				description: 'Search query to filter time entries',
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				displayOptions: {
					show: {
						resource: ['time'],
						operation: ['create', 'update'],
					},
				},
				default: {},
				options: [
					{
						displayName: 'Time End',
						name: 'timeEnd',
						type: 'string',
						default: '',
						description: 'End time (YYYY-MM-DD HH:mm:ss)',
					},
					{
						displayName: 'Billable',
						name: 'billable',
						type: 'boolean',
						default: true,
						description: 'Whether the time entry is billable',
					},
					{
						displayName: 'Notes',
						name: 'notes',
						type: 'string',
						default: '',
						description: 'Notes about the time entry',
					},
					{
						displayName: 'Member ID',
						name: 'member',
						type: 'string',
						default: '',
						description: 'The member associated with this time entry',
					},
					{
						displayName: 'Company ID',
						name: 'company',
						type: 'string',
						default: '',
						description: 'The company associated with this time entry',
					},
					{
						displayName: 'Charge Code',
						name: 'chargeCode',
						type: 'string',
						default: '',
						description: 'The charge code for the time entry',
					},
					{
						displayName: 'Work Type',
						name: 'workType',
						type: 'options',
						options: [
							{
								name: 'Administrative',
								value: 'Administrative',
							},
							{
								name: 'Project',
								value: 'Project',
							},
							{
								name: 'Support',
								value: 'Support',
							},
						],
						default: 'Support',
					},
				],
			},
			// Purchase Order Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['purchaseOrder'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a purchase order',
						action: 'Create a purchase order',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a purchase order',
						action: 'Delete a purchase order',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a purchase order by ID',
						action: 'Get a purchase order',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many purchase orders',
						action: 'Get many purchase orders',
					},
					{
						name: 'Search',
						value: 'search',
						description: 'Search purchase orders',
						action: 'Search purchase orders',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a purchase order',
						action: 'Update a purchase order',
					},
				],
				default: 'create',
			},
			// Purchase Order Fields
			{
				displayName: 'Order By',
				name: 'orderBy',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['purchaseOrder'],
						operation: ['getAll', 'search'],
					},
				},
				default: '',
				description: 'Field to order results by',
			},
			{
				displayName: 'Purchase Order ID',
				name: 'purchaseOrderId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['purchaseOrder'],
						operation: ['get', 'update', 'delete'],
					},
				},
				description: 'The ID of the purchase order',
			},
			{
				displayName: 'Vendor ID',
				name: 'vendorId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['purchaseOrder'],
						operation: ['create'],
					},
				},
				description: 'The ID of the vendor for the purchase order',
			},
			{
				displayName: 'Search Query',
				name: 'searchQuery',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['purchaseOrder'],
						operation: ['search'],
					},
				},
				description: 'Search query to filter purchase orders',
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				displayOptions: {
					show: {
						resource: ['purchaseOrder'],
						operation: ['create', 'update'],
					},
				},
				default: {},
				options: [
					{
						displayName: 'Status',
						name: 'status',
						type: 'options',
						options: [
							{
								name: 'Draft',
								value: 'Draft',
							},
							{
								name: 'Open',
								value: 'Open',
							},
							{
								name: 'Closed',
								value: 'Closed',
							},
							{
								name: 'Cancelled',
								value: 'Cancelled',
							},
						],
						default: 'Draft',
					},
					{
						displayName: 'Date',
						name: 'date',
						type: 'string',
						default: '',
						description: 'Purchase order date (YYYY-MM-DD)',
					},
					{
						displayName: 'Shipping Date',
						name: 'shippingDate',
						type: 'string',
						default: '',
						description: 'Expected shipping date (YYYY-MM-DD)',
					},
					{
						displayName: 'Tax Rate',
						name: 'taxRate',
						type: 'number',
						default: 0,
						typeOptions: {
							minValue: 0,
							maxValue: 100,
						},
						description: 'Tax rate percentage (0-100)',
					},
					{
						displayName: 'Shipping Cost',
						name: 'shippingCost',
						type: 'number',
						default: 0,
						description: 'Shipping cost amount',
					},
					{
						displayName: 'Notes',
						name: 'notes',
						type: 'string',
						default: '',
						description: 'Additional notes for the purchase order',
					},
				],
			},
			// Schedule Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['schedule'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a schedule entry',
						action: 'Create a schedule entry',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a schedule entry',
						action: 'Delete a schedule entry',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a schedule entry by ID',
						action: 'Get a schedule entry',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many schedule entries',
						action: 'Get many schedule entries',
					},
					{
						name: 'Search',
						value: 'search',
						description: 'Search schedule entries',
						action: 'Search schedule entries',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a schedule entry',
						action: 'Update a schedule entry',
					},
				],
				default: 'create',
			},
			// Schedule Fields
			{
				displayName: 'Schedule ID',
				name: 'scheduleId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['schedule'],
						operation: ['get', 'update', 'delete'],
					},
				},
				description: 'The ID of the schedule entry',
			},
			{
				displayName: 'Object Type',
				name: 'objectType',
				type: 'options',
				options: [
					{
						name: 'Activity',
						value: 'Activity',
					},
					{
						name: 'Service Ticket',
						value: 'ServiceTicket',
					},
					{
						name: 'Project',
						value: 'Project',
					},
					{
						name: 'Sales',
						value: 'Sales',
					},
				],
				default: 'Activity',
				required: true,
				displayOptions: {
					show: {
						resource: ['schedule'],
						operation: ['create'],
					},
				},
				description: 'The type of object to schedule',
			},
			{
				displayName: 'Object ID',
				name: 'objectId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['schedule'],
						operation: ['create'],
					},
				},
				description: 'The ID of the object to schedule',
			},
			{
				displayName: 'Search Query',
				name: 'searchQuery',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['schedule'],
						operation: ['search'],
					},
				},
				description: 'Search query to filter schedule entries',
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				displayOptions: {
					show: {
						resource: ['schedule'],
						operation: ['create', 'update'],
					},
				},
				default: {},
				options: [
					{
						displayName: 'Member ID',
						name: 'member',
						type: 'string',
						default: '',
						description: 'The member assigned to this schedule entry',
					},
					{
						displayName: 'Start Date',
						name: 'startDate',
						type: 'string',
						default: '',
						description: 'Schedule start date (YYYY-MM-DD)',
					},
					{
						displayName: 'End Date',
						name: 'endDate',
						type: 'string',
						default: '',
						description: 'Schedule end date (YYYY-MM-DD)',
					},
					{
						displayName: 'Type',
						name: 'type',
						type: 'options',
						options: [
							{
								name: 'General',
								value: 'General',
							},
							{
								name: 'Project',
								value: 'Project',
							},
							{
								name: 'Sales',
								value: 'Sales',
							},
						],
						default: 'General',
					},
					{
						displayName: 'Status',
						name: 'status',
						type: 'options',
						options: [
							{
								name: 'Scheduled',
								value: 'Scheduled',
							},
							{
								name: 'Confirmed',
								value: 'Confirmed',
							},
							{
								name: 'Completed',
								value: 'Completed',
							},
						],
						default: 'Scheduled',
					},
				],
			},
			// Product Catalog Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['productCatalog'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a product catalog item',
						action: 'Create a product catalog item',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a product catalog item',
						action: 'Delete a product catalog item',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a product catalog item by ID',
						action: 'Get a product catalog item',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many product catalog items',
						action: 'Get many product catalog items',
					},
					{
						name: 'Search',
						value: 'search',
						description: 'Search product catalog items',
						action: 'Search product catalog items',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a product catalog item',
						action: 'Update a product catalog item',
					},
				],
				default: 'create',
			},
			// Product Catalog Fields
			{
				displayName: 'Product ID',
				name: 'productId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['productCatalog'],
						operation: ['get', 'update', 'delete'],
					},
				},
				description: 'The ID of the product catalog item',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['productCatalog'],
						operation: ['create'],
					},
				},
				description: 'The name of the product catalog item',
			},
			{
				displayName: 'Search Query',
				name: 'searchQuery',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['productCatalog'],
						operation: ['search'],
					},
				},
				description: 'Search query to filter product catalog items',
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				displayOptions: {
					show: {
						resource: ['productCatalog'],
						operation: ['create', 'update'],
					},
				},
				default: {},
				options: [
					{
						displayName: 'Description',
						name: 'description',
						type: 'string',
						default: '',
						description: 'The description of the product catalog item',
					},
					{
						displayName: 'Price',
						name: 'price',
						type: 'number',
						default: 0,
						description: 'The price of the product catalog item',
					},
					{
						displayName: 'Category',
						name: 'category',
						type: 'string',
						default: '',
						description: 'The category of the product catalog item',
					},
					{
						displayName: 'Manufacturer',
						name: 'manufacturer',
						type: 'string',
						default: '',
						description: 'The manufacturer of the product catalog item',
					},
					{
						displayName: 'SKU',
						name: 'sku',
						type: 'string',
						default: '',
						description: 'The SKU of the product catalog item',
					},
					{
						displayName: 'Vendor',
						name: 'vendor',
						type: 'string',
						default: '',
						description: 'The vendor of the product catalog item',
					},
					{
						displayName: 'Active',
						name: 'active',
						type: 'boolean',
						default: true,
						description: 'Whether the product catalog item is active',
					},
				],
			},
			// Opportunity Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['opportunity'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create an opportunity',
						action: 'Create an opportunity',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete an opportunity',
						action: 'Delete an opportunity',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get an opportunity by ID',
						action: 'Get an opportunity',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many opportunities',
						action: 'Get many opportunities',
					},
					{
						name: 'Search',
						value: 'search',
						description: 'Search opportunities',
						action: 'Search opportunities',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update an opportunity',
						action: 'Update an opportunity',
					},
				],
				default: 'create',
			},
			// Opportunity Fields
			{
				displayName: 'Opportunity ID',
				name: 'opportunityId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['opportunity'],
						operation: ['get', 'update', 'delete'],
					},
				},
				description: 'The ID of the opportunity',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['opportunity'],
						operation: ['create'],
					},
				},
				description: 'The name of the opportunity',
			},
			{
				displayName: 'Search Query',
				name: 'searchQuery',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['opportunity'],
						operation: ['search'],
					},
				},
				description: 'Search query to filter opportunities',
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				displayOptions: {
					show: {
						resource: ['opportunity'],
						operation: ['create', 'update'],
					},
				},
				default: {},
				options: [
					{
						displayName: 'Company ID',
						name: 'company',
						type: 'string',
						default: '',
						description: 'The company associated with this opportunity',
					},
					{
						displayName: 'Status',
						name: 'status',
						type: 'options',
						options: [
							{
								name: 'Open',
								value: 'Open',
							},
							{
								name: 'Won',
								value: 'Won',
							},
							{
								name: 'Lost',
								value: 'Lost',
							},
							{
								name: 'No Decision',
								value: 'NoDecision',
							},
						],
						default: 'Open',
					},
					{
						displayName: 'Expected Close Date',
						name: 'expectedCloseDate',
						type: 'string',
						default: '',
						description: 'Expected close date (YYYY-MM-DD)',
					},
					{
						displayName: 'Probability',
						name: 'probability',
						type: 'number',
						default: 50,
						typeOptions: {
							minValue: 0,
							maxValue: 100,
						},
						description: 'Probability of winning (0-100)',
					},
					{
						displayName: 'Notes',
						name: 'notes',
						type: 'string',
						default: '',
						description: 'Notes about the opportunity',
					},
					{
						displayName: 'Location',
						name: 'location',
						type: 'string',
						default: '',
						description: 'The location of the opportunity',
					},
					{
						displayName: 'Priority',
						name: 'priority',
						type: 'options',
						options: [
							{
								name: 'Low',
								value: 'Low',
							},
							{
								name: 'Medium',
								value: 'Medium',
							},
							{
								name: 'High',
								value: 'High',
							},
						],
						default: 'Medium',
					},
				],
			},
			// Member Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['member'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a member',
						action: 'Create a member',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a member',
						action: 'Delete a member',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a member by ID',
						action: 'Get a member',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many members',
						action: 'Get many members',
					},
					{
						name: 'Search',
						value: 'search',
						description: 'Search members',
						action: 'Search members',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a member',
						action: 'Update a member',
					},
				],
				default: 'create',
			},
			// Member Fields
			{
				displayName: 'Member ID',
				name: 'memberId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['member'],
						operation: ['get', 'update', 'delete'],
					},
				},
				description: 'The ID of the member',
			},
			{
				displayName: 'Identifier',
				name: 'identifier',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['member'],
						operation: ['create'],
					},
				},
				description: 'The unique identifier/username of the member',
			},
			{
				displayName: 'Search Query',
				name: 'searchQuery',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['member'],
						operation: ['search'],
					},
				},
				description: 'Search query to filter members',
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				displayOptions: {
					show: {
						resource: ['member'],
						operation: ['create', 'update'],
					},
				},
				default: {},
				options: [
					{
						displayName: 'First Name',
						name: 'firstName',
						type: 'string',
						default: '',
						description: 'The first name of the member',
					},
					{
						displayName: 'Last Name',
						name: 'lastName',
						type: 'string',
						default: '',
						description: 'The last name of the member',
					},
					{
						displayName: 'Email',
						name: 'email',
						type: 'string',
						default: '',
						placeholder: 'name@email.com',
						description: 'The email address of the member',
					},
					{
						displayName: 'Title',
						name: 'title',
						type: 'string',
						default: '',
						description: 'The job title of the member',
					},
					{
						displayName: 'Phone Number',
						name: 'phoneNumber',
						type: 'string',
						default: '',
						description: 'The phone number of the member',
					},
					{
						displayName: 'Time Zone',
						name: 'timeZone',
						type: 'string',
						default: '',
						description: 'The time zone of the member',
					},
					{
						displayName: 'Work Role',
						name: 'workRole',
						type: 'string',
						default: '',
						description: 'The work role of the member',
					},
				],
			},
			// Project Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['project'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a project',
						action: 'Create a project',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a project',
						action: 'Delete a project',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a project by ID',
						action: 'Get a project',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many projects',
						action: 'Get many projects',
					},
					{
						name: 'Search',
						value: 'search',
						description: 'Search projects',
						action: 'Search projects',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a project',
						action: 'Update a project',
					},
				],
				default: 'create',
			},
			// Project Fields
			{
				displayName: 'Project ID',
				name: 'projectId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['project'],
						operation: ['get', 'update', 'delete'],
					},
				},
				description: 'The ID of the project',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['project'],
						operation: ['create'],
					},
				},
				description: 'The name of the project',
			},
			{
				displayName: 'Search Query',
				name: 'searchQuery',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['project'],
						operation: ['search'],
					},
				},
				description: 'Search query to filter projects',
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				displayOptions: {
					show: {
						resource: ['project'],
						operation: ['create', 'update'],
					},
				},
				default: {},
				options: [
					{
						displayName: 'Company ID',
						name: 'company',
						type: 'string',
						default: '',
						description: 'The company associated with this project',
					},
					{
						displayName: 'Status',
						name: 'status',
						type: 'options',
						options: [
							{
								name: 'Open',
								value: 'Open',
							},
							{
								name: 'Closed',
								value: 'Closed',
							},
							{
								name: 'On Hold',
								value: 'OnHold',
							},
						],
						default: 'Open',
					},
					{
						displayName: 'Description',
						name: 'description',
						type: 'string',
						default: '',
						description: 'The description of the project',
					},
					{
						displayName: 'Start Date',
						name: 'startDate',
						type: 'string',
						default: '',
						description: 'Project start date (YYYY-MM-DD)',
					},
					{
						displayName: 'End Date',
						name: 'endDate',
						type: 'string',
						default: '',
						description: 'Project end date (YYYY-MM-DD)',
					},
					{
						displayName: 'Billable',
						name: 'billable',
						type: 'boolean',
						default: true,
						description: 'Whether the project is billable',
					},
				],
			},
			// Invoice Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['invoice'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create an invoice',
						action: 'Create an invoice',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete an invoice',
						action: 'Delete an invoice',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get an invoice by ID',
						action: 'Get an invoice',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many invoices',
						action: 'Get many invoices',
					},
					{
						name: 'Search',
						value: 'search',
						description: 'Search invoices',
						action: 'Search invoices',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update an invoice',
						action: 'Update an invoice',
					},
				],
				default: 'create',
			},
			// Invoice Fields
			{
				displayName: 'Invoice ID',
				name: 'invoiceId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['invoice'],
						operation: ['get', 'update', 'delete'],
					},
				},
				description: 'The ID of the invoice',
			},
			{
				displayName: 'Company ID',
				name: 'company',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['invoice'],
						operation: ['create'],
					},
				},
				description: 'The company ID associated with this invoice',
			},
			{
				displayName: 'Search Query',
				name: 'searchQuery',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['invoice'],
						operation: ['search'],
					},
				},
				description: 'Search query to filter invoices',
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				displayOptions: {
					show: {
						resource: ['invoice'],
						operation: ['create', 'update'],
					},
				},
				default: {},
				options: [
					{
						displayName: 'Type',
						name: 'type',
						type: 'options',
						options: [
							{
								name: 'Standard',
								value: 'Standard',
							},
							{
								name: 'Progress',
								value: 'Progress',
							},
							{
								name: 'Credit',
								value: 'Credit',
							},
						],
						default: 'Standard',
					},
					{
						displayName: 'Status',
						name: 'status',
						type: 'options',
						options: [
							{
								name: 'Open',
								value: 'Open',
							},
							{
								name: 'Paid',
								value: 'Paid',
							},
							{
								name: 'Void',
								value: 'Void',
							},
						],
						default: 'Open',
					},
					{
						displayName: 'Date',
						name: 'date',
						type: 'string',
						default: '',
						description: 'Invoice date (YYYY-MM-DD)',
					},
					{
						displayName: 'Due Date',
						name: 'dueDate',
						type: 'string',
						default: '',
						description: 'Invoice due date (YYYY-MM-DD)',
					},
					{
						displayName: 'Reference',
						name: 'reference',
						type: 'string',
						default: '',
						description: 'Invoice reference number',
					},
				],
			},
			// Expense Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['expense'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create an expense',
						action: 'Create an expense',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete an expense',
						action: 'Delete an expense',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get an expense by ID',
						action: 'Get an expense',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many expenses',
						action: 'Get many expenses',
					},
					{
						name: 'Search',
						value: 'search',
						description: 'Search expenses',
						action: 'Search expenses',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update an expense',
						action: 'Update an expense',
					},
				],
				default: 'create',
			},
			// Expense Fields
			{
				displayName: 'Expense ID',
				name: 'expenseId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['expense'],
						operation: ['get', 'update', 'delete'],
					},
				},
				description: 'The ID of the expense',
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['expense'],
						operation: ['create'],
					},
				},
				description: 'The description of the expense',
			},
			{
				displayName: 'Search Query',
				name: 'searchQuery',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['expense'],
						operation: ['search'],
					},
				},
				description: 'Search query to filter expenses',
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				displayOptions: {
					show: {
						resource: ['expense'],
						operation: ['create', 'update'],
					},
				},
				default: {},
				options: [
					{
						displayName: 'Amount',
						name: 'amount',
						type: 'number',
						default: 0,
						description: 'The amount of the expense',
					},
					{
						displayName: 'Company ID',
						name: 'company',
						type: 'string',
						default: '',
						description: 'The company associated with this expense',
					},
					{
						displayName: 'Date',
						name: 'date',
						type: 'string',
						default: '',
						description: 'The date of the expense (YYYY-MM-DD)',
					},
					{
						displayName: 'Type',
						name: 'type',
						type: 'options',
						options: [
							{
								name: 'Billable',
								value: 'Billable',
							},
							{
								name: 'Non-Billable',
								value: 'NonBillable',
							},
						],
						default: 'Billable',
					},
				],
			},
			// Contact Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['contact'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a contact',
						action: 'Create a contact',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a contact',
						action: 'Delete a contact',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a contact by ID',
						action: 'Get a contact',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many contacts',
						action: 'Get many contacts',
					},
					{
						name: 'Search',
						value: 'search',
						description: 'Search contacts',
						action: 'Search contacts',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a contact',
						action: 'Update a contact',
					},
				],
				default: 'create',
			},
			// Contact Fields
			{
				displayName: 'Contact ID',
				name: 'contactId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['contact'],
						operation: ['get', 'update', 'delete'],
					},
				},
				description: 'The ID of the contact',
			},
			{
				displayName: 'First Name',
				name: 'firstName',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['contact'],
						operation: ['create'],
					},
				},
				description: 'The first name of the contact',
			},
			{
				displayName: 'Last Name',
				name: 'lastName',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['contact'],
						operation: ['create'],
					},
				},
				description: 'The last name of the contact',
			},
			{
				displayName: 'Search Query',
				name: 'searchQuery',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['contact'],
						operation: ['search'],
					},
				},
				description: 'Search query to filter contacts',
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				displayOptions: {
					show: {
						resource: ['contact'],
						operation: ['create', 'update'],
					},
				},
				default: {},
				options: [
					{
						displayName: 'Company ID',
						name: 'company',
						type: 'string',
						default: '',
						description: 'The company associated with this contact',
					},
					{
						displayName: 'Title',
						name: 'title',
						type: 'string',
						default: '',
						description: 'The job title of the contact',
					},
					{
						displayName: 'Email',
						name: 'email',
						type: 'string',
						default: '',
						placeholder: 'name@email.com',
						description: 'The email address of the contact',
					},
					{
						displayName: 'Phone Number',
						name: 'phoneNumber',
						type: 'string',
						default: '',
						description: 'The phone number of the contact',
					},
				],
			},
			// Configuration Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['configuration'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a configuration',
						action: 'Create a configuration',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a configuration',
						action: 'Delete a configuration',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a configuration by ID',
						action: 'Get a configuration',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many configurations',
						action: 'Get many configurations',
					},
					{
						name: 'Search',
						value: 'search',
						description: 'Search configurations',
						action: 'Search configurations',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a configuration',
						action: 'Update a configuration',
					},
				],
				default: 'create',
			},
			// Configuration Fields
			{
				displayName: 'Configuration ID',
				name: 'configurationId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['configuration'],
						operation: ['get', 'update', 'delete'],
					},
				},
				description: 'The ID of the configuration',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['configuration'],
						operation: ['create'],
					},
				},
				description: 'The name of the configuration',
			},
			{
				displayName: 'Search Query',
				name: 'searchQuery',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['configuration'],
						operation: ['search'],
					},
				},
				description: 'Search query to filter configurations',
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				displayOptions: {
					show: {
						resource: ['configuration'],
						operation: ['create', 'update'],
					},
				},
				default: {},
				options: [
					{
						displayName: 'Type',
						name: 'type',
						type: 'options',
						options: [
							{
								name: 'Access',
								value: 'Access',
							},
							{
								name: 'Backup',
								value: 'Backup',
							},
							{
								name: 'Software',
								value: 'Software',
							},
						],
						default: 'Software',
					},
					{
						displayName: 'Status',
						name: 'status',
						type: 'options',
						options: [
							{
								name: 'Active',
								value: 'Active',
							},
							{
								name: 'Inactive',
								value: 'Inactive',
							},
						],
						default: 'Active',
					},
					{
						displayName: 'Company ID',
						name: 'company',
						type: 'string',
						default: '',
						description: 'The company associated with this configuration',
					},
					{
						displayName: 'Location',
						name: 'location',
						type: 'string',
						default: '',
						description: 'The location of the configuration',
					},
				],
			},
			// Agreement Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['agreement'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create an agreement',
						action: 'Create an agreement',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete an agreement',
						action: 'Delete an agreement',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get an agreement by ID',
						action: 'Get an agreement',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many agreements',
						action: 'Get many agreements',
					},
					{
						name: 'Search',
						value: 'search',
						description: 'Search agreements',
						action: 'Search agreements',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update an agreement',
						action: 'Update an agreement',
					},
				],
				default: 'create',
			},
			// Agreement Fields
			{
				displayName: 'Agreement ID',
				name: 'agreementId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['agreement'],
						operation: ['get', 'update', 'delete'],
					},
				},
				description: 'The ID of the agreement',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['agreement'],
						operation: ['create'],
					},
				},
				description: 'The name of the agreement',
			},
			{
				displayName: 'Search Query',
				name: 'searchQuery',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['agreement'],
						operation: ['search'],
					},
				},
				description: 'Search query to filter agreements',
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				displayOptions: {
					show: {
						resource: ['agreement'],
						operation: ['create', 'update'],
					},
				},
				default: {},
				options: [
					{
						displayName: 'Type',
						name: 'type',
						type: 'options',
						options: [
							{
								name: 'Standard',
								value: 'Standard',
							},
							{
								name: 'Support',
								value: 'Support',
							},
						],
						default: 'Standard',
					},
					{
						displayName: 'Company ID',
						name: 'company',
						type: 'string',
						default: '',
						description: 'The company associated with this agreement',
					},
					{
						displayName: 'Start Date',
						name: 'startDate',
						type: 'string',
						default: '',
						description: 'Agreement start date (YYYY-MM-DD)',
					},
					{
						displayName: 'End Date',
						name: 'endDate',
						type: 'string',
						default: '',
						description: 'Agreement end date (YYYY-MM-DD)',
					},
				],
			},
			// Activity Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['activity'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create an activity',
						action: 'Create an activity',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete an activity',
						action: 'Delete an activity',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get an activity by ID',
						action: 'Get an activity',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many activities',
						action: 'Get many activities',
					},
					{
						name: 'Search',
						value: 'search',
						description: 'Search activities',
						action: 'Search activities',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update an activity',
						action: 'Update an activity',
					},
				],
				default: 'create',
			},
			// Activity Fields
			{
				displayName: 'Activity ID',
				name: 'activityId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['activity'],
						operation: ['get', 'update', 'delete'],
					},
				},
				description: 'The ID of the activity',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['activity'],
						operation: ['create'],
					},
				},
				description: 'The name of the activity',
			},
			{
				displayName: 'Search Query',
				name: 'searchQuery',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['activity'],
						operation: ['search'],
					},
				},
				description: 'Search query to filter activities',
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				displayOptions: {
					show: {
						resource: ['activity'],
						operation: ['create', 'update'],
					},
				},
				default: {},
				options: [
					{
						displayName: 'Type',
						name: 'type',
						type: 'options',
						options: [
							{
								name: 'Call',
								value: 'Call',
							},
							{
								name: 'Meeting',
								value: 'Meeting',
							},
							{
								name: 'Task',
								value: 'Task',
							},
						],
						default: 'Task',
					},
					{
						displayName: 'Notes',
						name: 'notes',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Company ID',
						name: 'company',
						type: 'string',
						default: '',
						description: 'The company associated with this activity',
					},
				],
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
						name: 'Add Note',
						value: 'addNote',
						description: 'Add a note to a service ticket',
						action: 'Add a note to a service ticket',
					},
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
						name: 'Get Notes',
						value: 'getNotes',
						description: 'Get notes for a service ticket',
						action: 'Get notes for a service ticket',
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
						name: 'Create',
						value: 'create',
						description: 'Create a company',
						action: 'Create a company',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a company',
						action: 'Delete a company',
					},
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
					{
						name: 'Search',
						value: 'search',
						description: 'Search companies',
						action: 'Search companies',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a company',
						action: 'Update a company',
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
						operation: ['get', 'update', 'delete', 'getNotes', 'addNote'],
					},
				},
				description: 'The ID of the service ticket',
			},
			{
				displayName: 'Note Text',
				name: 'noteText',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['ticket'],
						operation: ['addNote'],
					},
				},
				description: 'The text content of the note to add',
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
						operation: ['get', 'update', 'delete'],
					},
				},
				description: 'The ID of the company',
			},
			{
				displayName: 'Company Name',
				name: 'name',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['company'],
						operation: ['create'],
					},
				},
				description: 'The name of the company',
			},
			{
				displayName: 'Search Query',
				name: 'searchQuery',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['company'],
						operation: ['search'],
					},
				},
				description: 'Search query to filter companies',
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				displayOptions: {
					show: {
						resource: ['company'],
						operation: ['create', 'update'],
					},
				},
				default: {},
				options: [
					{
						displayName: 'Status',
						name: 'status',
						type: 'options',
						options: [
							{
								name: 'Active',
								value: 'Active',
							},
							{
								name: 'Inactive',
								value: 'Inactive',
							},
						],
						default: 'Active',
					},
					{
						displayName: 'Phone Number',
						name: 'phoneNumber',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Website',
						name: 'website',
						type: 'string',
						default: '',
					},
				],
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
				if (resource === 'time') {
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
								detailDescriptionFlag: true,
								internalAnalysisFlag: false,
								resolutionFlag: false,
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
