# Step 3: Configure Storage

!!! overview
    - Configure `config/storage.yml`
    - Update `config/environments/production.rb`

Now that you have defined your secrets, you need to configure your application to use them.
[S3](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html) is a popular choice for file storage, needs secrets to operate, and is used by the Depot application to store book cover images.
Your app may have other needs, so just consider this an example.

Active Storage is the Rails way to use S3. Configure it using the environment variables you extracted from your password manager:

```yaml title="config/storage.yml" hl_lines="9-15" linenums="1"
test:
  service: Disk
  root: <%= Rails.root.join("tmp/storage") %>

local:
  service: Disk
  root: <%= Rails.root.join("storage") %>

hetzner:
  service: S3
  access_key_id: <%= ENV["ACCESS_KEY_ID"] %>
  secret_access_key: <%= ENV["SECRET_ACCESS_KEY"] %>
  endpoint: <%= ENV["ENDPOINT_URL"] %>
  region: <%= ENV["REGION"] %>
  bucket: <%= ENV["BUCKET_NAME"] %>

# Use bin/rails credentials:edit to set the AWS secrets
# (as aws:access_key_id|secret_access_key)
# amazon:
#   service: S3
#   access_key_id: <%= Rails.application.credentials
#                        .dig(:aws, :access_key_id) %>
#   secret_access_key: <%= Rails.application.credentials
#                            .dig(:aws, :secret_access_key) %>
#   region: us-east-1
#   bucket: your_own_bucket-<%= Rails.env %>

# Remember not to check in your GCS keyfile to a repository
# google:
#   service: GCS
#   project: your_project
#   credentials: <%= Rails.root.join("path/to/gcs.keyfile") %>
#   bucket: your_own_bucket-<%= Rails.env %>

# Use bin/rails credentials:edit to set the Azure Storage secret
# (as azure_storage:storage_access_key)
# microsoft:
#   service: AzureStorage
#   storage_account_name: your_account_name
#   storage_access_key: <%= Rails.application.credentials
#                 .dig(:azure_storage, :storage_access_key) %>
#   container: your_container_name-<%= Rails.env %>

# mirror:
#   service: Mirror
#   primary: local
#   mirrors: [ amazon, google, microsoft ]
```

Note: If you used the Rails credentials file, you can use the `Rails.application.credentials` hash to extract these values. The `amazon` example in this file uses this approach.

Next, update your `config/environments/production.rb` to use the S3 service:

```ruby title="config/environments/production.rb" hl_lines="2"
# Store uploaded files in S3 object storage (see config/storage.yml for options).
config.active_storage.service = :hetzner
```

Finally, add the gem needed to access s3:

```sh
bundle add aws-sdk-s3
```
