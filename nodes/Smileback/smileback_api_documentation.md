
# SmileBack Data Replication API Documentation

**API Version**: v3.3  
**Documentation Version**: v3.4  
**Last Updated**: 2024-10-22  

---

## Introduction

This API is designed for Business Intelligence (BI) and reporting tools that aim to replicate and synchronize a customer's SmileBack data into internal storage for analysis. It is **read-only** and focuses on **incremental synchronization** efficiency.

---

## Changelog Highlights

### v3.4
- New endpoints:
  - `/prj-responses/`: Project Survey responses
  - `/prj-surveys/`: Project Surveys list
  - `/nps-campaigns/`: NPS Campaigns
  - `/csat-contacts/`, `/csat-companies/`, `/csat-boards/`, `/csat-agents/`
- Project Survey Score calculation added

### v3.3
- NPS response includes contact data permanently

### v3.2
- Added NPS terminology, score calculation, and response access section

### v3.1
- Changed recommendation for OAuth token endpoint usage (use request body instead of query parameters)

### v3.0
- `/reviews/` replaces `/reactions/`
- New fields added (e.g., `ticket.closed_on`, `permalink`, `contact.email`)
- Deprecated v1 and v2 API paths

---

## Authentication

OAuth 2.0 (Authorization Code Grant & Resource Owner Password Credentials Grant).  

**Endpoints**:
- Authorization: `https://<authorization_base_url>/account/api/authorize/`
- Token: `https://<api_base_url>/token`
- Revoke: `https://<api_base_url>/revoke/`

---

## Syncing Strategy

### Initial Sync
- Retrieve all reviews using the `/reviews/` endpoint without filters
- Loop using `modified_since` until no more data
- Save the `last_modified` timestamp of the latest review

### Incremental Sync
- Use saved `last_modified` value with `modified_since` parameter
- Repeat as needed to keep dataset updated

---

## Core Concepts

- **Review**: Customer Satisfaction feedback with optional comment
- **Rating**: -1 (Negative), 0 (Neutral), 1 (Positive)
- **NPS**: Net Promoter Score surveys with scores 0–10
- **Project Survey**: Survey triggered by project or phase status changes

---

## CSAT Reviews

**Endpoint**: `GET /v3/reviews/`

**Filters**:
- `modified_since`
- `include_unrated`

**Important Fields**:
- `rating`, `comment`, `ticket`, `contact`, `company`, `tags`, `status`, `last_modified`

### Deleted Reviews
- Reviews marked with `status = deleted` must be removed from local dataset.

### Response Rate
- Calculated as: `Rated Reviews / All Reviews in time interval`
- Requires `include_unrated=true`

### Net CSAT Score
- Positive = 100, Neutral = 0, Negative = -100
- Average all scores to get Net CSAT Score (-100 to +100)

---

## NPS Responses

**Endpoint**: `GET /v3/nps-responses/`

**Filters**:
- `created_since`, `campaign_name`, `score_gt`, `score_lt`, `score_exact`

### NPS Score Calculation
- Promoters: 9–10
- Passives: 7–8
- Detractors: 0–6
- `NPS = %Promoters - %Detractors`

---

## Project Surveys

**Endpoint**: `GET /v3/prj-responses/`

**Response Includes**:
- Survey name, questions (rated 1–5), comment, project info, contact info

### Survey Score Calculation
1. Average scores per category across responses
2. Average of those scores gives the overall Project Survey score

---

## Auxiliary Endpoints

- `/v3/csat-agents/`
- `/v3/csat-boards/`
- `/v3/csat-companies/`
- `/v3/csat-contacts/`
- `/v3/nps-campaigns/`
- `/v3/prj-surveys/`

All provide supporting metadata, no filters required.

---

## Limits

- Max page size: 1000
- Rate limit: 30 requests/minute/customer

---

## Example Workflow

1. Authorize user via OAuth
2. Exchange code for access + refresh tokens
3. Perform initial data sync
4. Poll with `modified_since` for incremental sync
5. Refresh token when expired
6. Revoke token when disconnecting

---

## Production Activation

To go live:
- Provide integration name, redirect URI (HTTPS), and logo (SVG)
- Receive production `client_id` and `client_secret`

---

**For full OAuth details, refer to [RFC 6749](https://tools.ietf.org/html/rfc6749).**
