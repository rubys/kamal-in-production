# Continuous Deployment

!!! overview
    - Setting GitHub secrets
    - Creating a GitHub action

At this point, we can deploy our software to either our main site or a staging site with a single command. Let's take the next step and automate the deployment process. We will use GitHub Actions to deploy our software to our staging area. This will allow us to deploy our software with a single push to the repository.  
As with other aspects of Kamal, this can be done by taking three small steps.

For this chapter, we will use the Rails example application defined in [Local](Local.md), and automatically deploy it to a staging server every time we push to the main branch of the repository—but only if the tests pass.  
Your processes and needs may be different, but the steps should be similar.

---

## Setting GitHub Secrets

The first step is to set up the secrets in GitHub.  
[GitHub Actions: Using secrets in GitHub Actions](https://docs.github.com/en/actions/security-for-github-actions/security-guides/using-secrets-in-github-actions)  
This is done by going to the repository and selecting the Settings tab. From there, select the Secrets tab and add the following secrets:

- `SSH_PRIVATE_KEY` – The private key used to connect to the server
- `KAMAL_REGISTRY_PASSWORD` – The password to your Docker registry
- `RAILS_MASTER_KEY` – The master key for your Rails application
- `ACCESS_KEY_ID` – The access key ID for your S3 object storage
- `SECRET_ACCESS_KEY` – The secret access key for your S3 object storage
- `ENDPOINT_URL` – The endpoint URL for your S3 object storage
- `REGION` – The region for your S3 object storage
- `BUCKET_NAME` – The bucket name for your S3 object storage

If you generated a new SSH key when you [assembled your ingredients](Assemble.md#ssh-key), 
the `SSH_PRIVATE_KEY` can be found by running `cat ~/.ssh/id_ed25519` on your local machine.
The `RAILS_MASTER_KEY` can be found by running `cat config/master.key` in your Rails application. The rest you can get from your password manager.

Yes, this means that your secrets will need to be maintained in two places. This is unfortunate but necessary, as GitHub can't access your password manager, and secrets placed in GitHub can't be retrieved.  
Fortunately, secrets rarely change, so this is not a big issue.

As an alternative to using the web interface, you can use the [GitHub CLI](https://github.com/cli/cli?tab=readme-ov-file#installation) to set the secrets. Here are some example commands:

```sh
gh secret set SSH_PRIVATE_KEY < ~/.ssh/id_ed25519
gh secret set RAILS_MASTER_KEY < config/master.key
```

---

## Creating a Second Kamal Secrets File

You already have a `.kamal/secrets` file in your Rails application. This file is used to extract the secrets for your application. You will need to create a second file called `.kamal/secrets.cd` that will be used to extract the secrets in GitHub Actions.

```shell
# .kamal/secrets.cd
# (This file should extract secrets from the environment)
```

This file is much simpler than your existing secrets file. It only needs to extract the secrets from the environment.

---

## Creating a GitHub Action

The final step is to create a GitHub Action that will deploy your software to your staging server. This is done by updating a file called `.github/workflows/ci.yml` in your repository.

Before proceeding, let's review what we see at the top of that file:

```yaml
# .github/workflows/ci.yml (part: on)
# This file is a YAML file that defines the GitHub Action. The first part of the file defines when the action should run.
# In this case, it will run every time you push to the main branch of the repository.
```

Following that are a number of jobs. The last job is named `test` and runs the tests for the application. Now let's add a job to deploy the application, which is only to be run if the tests pass.

```yaml
# .github/workflows/ci.yml (part: deploy)
# This checks out the code, sets up Ruby (which installs Kamal), uses the SSH agent with your private key,
# sets up Docker builds, and then deploys the application using your secrets and replacing the
# .kamal/secrets file with the .kamal/secrets.cd file. This last change is committed to git locally but never pushed to the repository.
```

If you don't have an existing `.github/workflows/ci.yml` file, simply create one. If you do have a test job, remove the `needs: test` line from the deploy job.  
If you have a non-Ruby application, you can install Kamal by adding the following after the Ruby setup step:

```yaml
- name: Install Kamal
  run: |
    bundle init
    bundle add kamal
    bundle binstub kamal
```

Once ready, commit these files to your repository and push them to GitHub. You should see the action run and deploy your application.
