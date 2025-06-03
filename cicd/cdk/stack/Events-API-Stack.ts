import * as ecr from 'aws-cdk-lib/aws-ecr';


import { AppContext, BaseStack, StackConfig } from "@ala/ala-cdk-libs";
import { CfnOutput } from 'aws-cdk-lib';

export class EventsAPIStack extends BaseStack {

    readonly esApiRepo: ecr.IRepository
    readonly es2vtRepo: ecr.IRepository
    readonly graphqlApiRepo: ecr.IRepository

    constructor(appContext: AppContext, stackConfig: StackConfig) {

        super(appContext, stackConfig);

        this.esApiRepo = new ecr.Repository(this, 'es-api-repo', {
            repositoryName: `${this.stackName}-es-api`.toLowerCase()
        })

        this.es2vtRepo = new ecr.Repository(this, 'es2vt-repo', {
            repositoryName: `${this.stackName}-es2vt`.toLowerCase()
        })

        this.graphqlApiRepo = new ecr.Repository(this, 'GraphQLAPI-repo', {
            repositoryName: `${this.stackName}-graphql-api`.toLowerCase()
        })

        new CfnOutput(this, 'es-api-repo-uri', {
            exportName: `${this.stackName}-es-api-repo`,
            value: this.esApiRepo.repositoryUri
        })

        new CfnOutput(this, 'es2vt-repo-uri', { 
            exportName: `${this.stackName}-es2vt-repo`,
            value: this.es2vtRepo.repositoryUri
        })

        new CfnOutput(this, 'graphql-api-rep-uri', {
            exportName: `${this.stackName}-graphql-api-repo`,
            value: this.graphqlApiRepo.repositoryUri
        })
    }
}