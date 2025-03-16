### Levels and Types

The REST APIs allow a more granular approach to callbacks. Levels and types open the ability to report on specific boards or tickets without getting unnecessary results.

| **Type** | **Level** | **Description** |
|----------|----------|----------------|

#### Activities +
- **Activity | Owner** – When set to owner, all ConnectWise PSA activities are returned.
- **Activity | Status** – Receive callbacks for activities in the specified status.
- **Activity | Type** – Receive callbacks for activities in the specified type.
- **Activity | Company** – Receive callbacks for activities under a specific company.
- **Activity | Activity** – Receive callbacks for specific activity.

#### Agreements +
- **Agreement | Owner** – When set to owner, all ConnectWise PSA agreements are returned.
- **Agreement | Type** – Receive callbacks for agreements in the specified type.
- **Agreement | Company** – Receive callbacks for agreements under a specific company.
- **Agreement | Agreement** – Receive callbacks for specific agreement.

#### Companies +
- **Company | Owner** – When set to owner, all ConnectWise PSA companies are returned.
- **Company | Status** – Receive callbacks for companies in the specified status.
- **Company | Type** – Receive callbacks for companies in the specified type.
- **Company | Territory** – Receive callbacks for companies in the specified territory.
- **Company | Company** – Receive callbacks for specific company regardless of territory.
- **Company | IntegratorTag** – Tag companies to only get updates for that company with one callback record.

#### Contacts +
- **Contact | Owner** – When set to owner, all ConnectWise PSA contacts are returned.
- **Contact | Type** – Receive callbacks for contacts in the specified type.
- **Contact | Territory** – Receive callbacks for contacts in the specified territory.
- **Contact | Company** – Receive callbacks for contacts under a specific company.
- **Contact | Contact** – Receive callbacks for specific contact.

#### Configurations +
- **Configuration | Owner** – When set to owner, all ConnectWise PSA configurations are returned.
- **Configuration | Type** – Receive callbacks for configurations in the specified type.
- **Configuration | Status** – Receive callbacks for configurations in the specified status.
- **Configuration | Configuration** – Receive callbacks for a specific configuration.

#### Invoice +
- **Invoice | Owner** – When set to owner, all ConnectWise PSA invoices are returned.
- **Invoice | Status** – Receive callbacks for invoices in the specified status.
- **Invoice | Company** – Receive callbacks for invoices under a specific company.
- **Invoice | Invoice** – Receive callbacks for specific invoice.

#### Expense +
- **Expense | Owner** – When set to owner, all ConnectWise PSA expenses are returned.
- **Expense | ChargeToType** – Receive callbacks for expenses under the specified ChargeToType.
- **Expense | Type** – Receive callbacks for expenses under the specified Type.
- **Expense | Class** – Receive callbacks for expenses under the specified Class.
- **Expense | Company** – Receive callbacks for expenses under the specified Company.
- **Expense | Expense** – Receive callbacks for specific expense.

#### Member +
- **Member | Owner** – When set to owner, changes to all ConnectWise PSA member records are returned.
- **Member | Location** – Receive callbacks for member records associated with the specified Location.
- **Member | SecurityRole** – Receive callbacks for member records associated with the specified Security Role.
- **Member | Member** – Receive callbacks for changes made to a specified member record.

#### Opportunities +
- **Opportunity | Owner** – When set to owner, all ConnectWise PSA opportunities are returned.
- **Opportunity | StatusId** – Receive callbacks for opportunities in the specified status.
- **Opportunity | Company** – Receive callbacks for opportunities under a specific company.
- **Opportunity | Opportunity** – Receive callbacks for specific opportunity.

#### Product Catalog +
- **ProductCatalog | Owner** – When set to owner, all ConnectWise PSA product catalog items are returned.

#### Projects +
- **Project | Owner** – When set to owner, all ConnectWise PSA projects are returned.
- **Project | Status** – Receive callbacks for projects in the specified status.
- **Project | Board** – Receive callbacks for projects on the specified board.
- **Project | Project** – Receive callbacks for specific project.

#### Purchase Orders +
- **PurchaseOrder | Owner** – When set to owner, all ConnectWise PSA purchase orders are returned.
- **PurchaseOrder | Status** – Receive callbacks for purchase orders in the specified status.
- **PurchaseOrder | Vendor** – Receive callbacks for purchase orders under the specified Vendor.
- **PurchaseOrder | Company** – Receive callbacks for purchase orders under a specific company.
- **PurchaseOrder | PurchaseOrder** – Receive callbacks for specific purchase orders.

#### Schedule Entries +
- **Schedule | Owner** – When set to owner, all ConnectWise PSA schedule entries are returned.
- **Schedule | Status** – Receive callbacks for schedule entries under a specific status.
- **Schedule | Type** – Receive callbacks for schedule entries under a specific type.
- **Schedule | Location** – Receive callbacks for schedule entries under a specific location.
- **Schedule | Member** – Receive callbacks for schedule entries under a specific member.
- **Schedule | Schedule** – Receive callbacks for specific schedule entries.

#### Tickets +
- **Ticket | Owner** – When set to owner, all ConnectWise PSA tickets are returned.
- **Ticket | Board** – Receive callbacks for tickets on the specified board.
- **Ticket | Project** – Receive callbacks for tickets attached to a specific project.
- **Ticket | Phase** – Receive callbacks for tickets attached to a specific project phase.
- **Ticket | Status** – Receive callbacks for tickets in the specified status.
- **Ticket | Ticket** – Receive callbacks for specific tickets.
- **Ticket | IntegratorTag** – Tag tickets to only get updates for that ticket with one callback record.

#### Time Entries +
- **Time | Owner** – When set to owner, all ConnectWise PSA time entries are returned.
- **Time | Company** – Receive callbacks for time entries for the specified company.
- **Time | Time** – Receive callbacks for specific time entries.
