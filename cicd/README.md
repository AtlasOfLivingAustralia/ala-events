# Events

## components
There are 4 components that make up the Events CI/CD process

### base
Base resources common to other components 

Infrastructure Resources:
 - Cognito App Client

### build
Pipeline to build the events services and deploy to container repository. 

Infrastructure Resources:
 - Container repository (ECR)

### deploy
Pipeline to deploy the Helm chart into EKS cluster

### frontend
Pipeline to build and deploy the frontend events UI

Infrastructure Resources:
 - S3 Bucket
 - CloudFront Distribution
 - WAF rules
 - route53 dns record

## Usage

There are two implementations Infrastructure as Code (IaC) provisioning
 - Cloud Development Kit - CDK
 - Cloud Formation - YAML with python scripts

## CDK- Development and Deploy

### Environments

There are currently 2 static environments: 
 - dev 
 - test

## Configuration

The environments are configured via specific config file located in `cdk/config/*.yaml`

### Conponent Stacks

A list of availabke component stack can be obtained using the command:
```
 cdk list --context APP_CONFIG=cdk/config/events-dev.yaml
```

 - ALA-events-dev-UI : infrastructure for the UI (frontend) 
 - ALA-events-dev-API : infrastrucrture for the API (backend)
 - ALA-events-dev-UI-Pipeline : pipeline to build and deploy the frontend
 - ALA-events-dev-API-Pipeline : pipeline to build the backend docker containers and deploy to ECR
 - ALA-events-dev-EKS : experimental EKS infrastructure and deployment of backend HELM chart

### deployment of stacks

```
 cdk deploy --context APP_CONFIG=cdk/config/events-<environment>.yaml <stackname>
```
 
### cleanup

```
 cdk destoy --context APP_CONFIG=cdk/config/events-<environment>.yaml <stackname>
```

## CloudFormation - Development and Deploy

### Environments
There are 3 static environments: testing, staging and production. Additionally anyone can spin up their own isolated development environment for personal testing and development. The environment is determined by the branch it's deployed from.

|git branch|environment |
|--|--|
|main|production|
|main|staging|
|testing|testing|
|feature/* (e.g. feature/issue-121-new-logo) |development|

The production and staging environment run in our production AWS account. Testing and development run in the comparison account. 

### Configuration
All configuration is handled in the `config.ini` file. The File format is of a standard ini file with different sections corresponding to the different environments. There is a [DEFAULT] section that includes values common to all environments such as the code repo details. Default values can be overridden in an environment section

### Git branching
The branching model for this project is very similar to [gitflow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow)
Direct commits are only made to feature branches. PRs are created to move through all the other branches up to main which corresponds to production

### Development workflow
A typical workflow would be that there's a task to make a change to an existing setup.

#### Development environment
##### 1. Create a feature branch
Create a feature branch called feature/feature-name to make your changes. This would usually be based off the `main` branch but could be from `testing` if the updates are being made against an unreleased change. On your new feature branch you can update the settings in `config.ini` in the development section to correspond to the changes you're making.

##### 2. Deploy the CodePipeline - one off step
This is a one off step to create the CodePipeline for your feature branch, it should only need to be done once after you first create your feature branch. Run your AWS CLI authentication then then run the script `cicd/[component]/pipeline/deploy_pipeline.sh` This will deploy or update the CodePipeline so that points to your newly created feature branch

Once the pipeline is deployed it will monitor itself for changes and redeploy itself if it's updated. Only the feature branch CodePipeline needs to be deployed manually. All other environments are already launched and will update themselves automatically when there are pipeline changes.

##### 3. Code away!
Make your changes.

##### 4. Deploy to development
When you're ready to deploy commit and push your changes. Then in the AWS console navigate to CodePipeline and find your pipeline and click "Release change" This will kick off a deployment. Follow the progress in the AWS console and look out for any errors. When the deploy is finished your changes will be ready to review at the domain specified in the config.ini file

As you work on the feature and commit more changes this step can be repeated. Commit code, Release change, commit code Release change, until the feature is complete. 

##### 5. Cleanup
When you're finished there is a manually approved cleanup stage in the pipeline that will remove all the infrastructure associated with your development branch. It's an optional step, all it does it to clean up and remove all the AWS resources associated with this branch. To run this Click the "Review" button in the Teardown stage of the pipeline and then "Approve". To remove the pipeline the pipeline stack needs to be torn down in the CloudFormation section of the AWS console.

Although it's optional it's important to do this once you're finished as unused AWS resources can still incur costs and also contribute to our account limits. It also makes things easier for everyone if we keep a clean shop

#### Testing environment
##### 1. Merge changes to testing
When development is finished while still on your feature branch update `config.ini` so that any changes that need to be done in testing, staging or production environments have been made. Submit a PR to merge your feature branch into the testing branch. After review do the merge.

##### 2. Deploy
In the AWS console navigate to CodePipeline and find the pipeline and click "Release change". Follow the progress in the AWS console and look out for any errors. When the deploy is finished your changes will be ready to review at the domain specified in the `config.ini` file against the testing environment.

#### Staging environment
##### 1. Merge changes to staging
Submit a PR to merge the testing branch into main. After review do the merge.
##### 2. Deploy
In the AWS console navigate to CodePipeline and find the pipeline and click "Release change". Follow the progress in the AWS console and look out for any errors. When the deploy is finished your changes will be ready to review at the domain specified in the config.ini file against the staging environment.

#### Production environment
There's no need to merge anything for production, production runs of identical branches as staging.
##### 1. Deploy
In the AWS console navigate to CodePipeline and find the pipeline and click "Release change". Follow the progress in the AWS console and look out for any errors. When the deploy is finished your changes will be ready to review at the domain specified in the config.ini file against the production environment.

### Rollback
To rollback to any previous revision go to CodePipeline and after selecting "Release Change" choose the commit to release. [Detailed instructions here](https://docs.aws.amazon.com/codepipeline/latest/userguide/pipelines-trigger-source-overrides.html#pipelines-trigger-source-overrides-console)

If the rollback requires a pipeline change the pipeline will be automatically updated but it will not automatically run. You will need to select "Release Change" again and select the commit to release.