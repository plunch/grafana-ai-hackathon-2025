# Grafana hackathon 2025

Setup instructions

## 1. Setting up a connection to the data

 1. Go to Connections > Private data source connect
 2. Select add new network
 3. Select Docker or Binary installation method
 4. Create a new token (Click Create Token)
 5. Save the created token and set it as GRAFANA_TOKEN in .env
 6. Save the -gcloud-hosted-grafana-id and set it in docker-compose.json
 7. Run `docker compose up -d` on the server to start PostgreSQL
    and connect to Grafana.
 8. Press Test agent connection and verify the agent is connected

## 2. Setting up the PostgreSQL data source

 1. Go to connections > Data sources
 2. Click Add new data source
 3. Search for and select PostgreSQL
 4. Mark the data source as default
 5. Set:  
    Host URL `postgresql:5432`  
    Database name `postgres`  
    Username `postgres`  
    Password `example`  
    TLS/SSL Mode `disable`  
 6. Select the private data source connect network you created in step 1
 7. Save and test

## 3. Importing dashboard JSON

 1. Go to Dashboards
 2. Click the New button (top right), select Import
 3. Upload the [dashboard.json][] file and select import
 4. Go through each panel and select edit, then go back to fix the data source
 5. Save the dashboard

## 4. Configuring Grafana Assistant

 1. Go to Assistant > Settings
 2. Under Assistant behavior, click Create rule
 3. Paste the contents of [system-prompt.txt][]
 4. Go to Integrations (in Assistant > settings)
 5. Select Add custom server
 6. Set Name to `Transaction data` and Server URL to `https://aml2025.perlundh.com/mcp`
 7. Save and close the window

[system-prompt.txt]: https://github.com/plunch/grafana-ai-hackathon-2025/blob/master/system-prompt.txt
[dashboard.json]: https://github.com/plunch/grafana-ai-hackathon-2025/blob/master/dashboard.json

