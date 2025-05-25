# Step 2: Configure Secrets

!!! overview
    - Configure `.kamal/secrets`

In your `config/deploy.yml` you listed your secrets but not their values. Those values are extracted using a script that you can find in `.kamal/secrets`.

```yaml title=".kamal/secrets" hl_lines="9-20 26 30" linenums="1"
# Secrets defined here are available for reference under registry/password,
# env/secret, builder/secrets, and accessories/*/env/secret in
# config/deploy.yml. All secrets should be pulled from either password
# manager, ENV, or a file. DO NOT ENTER RAW CREDENTIALS HERE! This file
# needs to be safe for git.

# Example of extracting secrets from 1password (or another compatible
# pw manager)
SECRETS=$(kamal secrets fetch --adapter 1password --account your-account  \
  --from Vault/Item KAMAL_REGISTRY_PASSWORD RAILS_MASTER_KEY \
  ACCESS_KEY_ID SECRET_ACCESS_KEY ENDPOINT_URL REGION BUCKET_NAME)

KAMAL_REGISTRY_PASSWORD=$(kamal secrets extract KAMAL_REGISTRY_PASSWORD
                            ${SECRETS})
RAILS_MASTER_KEY=$(kamal secrets extract RAILS_MASTER_KEY ${SECRETS})
ACCESS_KEY_ID=$(kamal secrets extract ACCESS_KEY_ID ${SECRETS})
SECRET_ACCESS_KEY=$(kamal secrets extract SECRET_ACCESS_KEY ${SECRETS})
ENDPOINT_URL=$(kamal secrets extract ENDPOINT_URL ${SECRETS})
REGION=$(kamal secrets extract REGION ${SECRETS})
BUCKET_NAME=$(kamal secrets extract BUCKET_NAME ${SECRETS})

# Use a GITHUB_TOKEN if private repositories are needed for the image
# GITHUB_TOKEN=$(gh config get -h github.com oauth_token)

# Grab the registry password from ENV
# KAMAL_REGISTRY_PASSWORD=$KAMAL_REGISTRY_PASSWORD

# Improve security by using a password manager.
# Never check config/master.key into git!
# RAILS_MASTER_KEY=$(cat config/master.key)
```

This file has examples of three ways to get your secrets: from a password manager, from the environment, or from a file. The password manager is the most secure, and is the one we recommend you use.

Uncomment out this section, [select the appropriate adapter](https://kamal-deploy.org/docs/commands/secrets/),
and add the S3 secrets, unless you have already added them to `config/credentials.yml.enc`.

Now place all of the secrets you gathered while assembling your ingredients into your password manager. You can find the `MASTER_KEY` in your Rails app at `config/master.key`.

While it is possible to include your secrets here, doing so is strongly discouraged. If you chose to do it anyway, be sure to add this file to your `.gitignore` and `.dockerignore` files.