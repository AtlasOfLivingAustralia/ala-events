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
            repositoryName: 'es-api'
        })

        this.es2vtRepo = new ecr.Repository(this, 'es2vt-repo', {
            repositoryName: 'es2vt'
        })

        this.graphqlApiRepo = new ecr.Repository(this, 'GraphQLAPI-repo', {
            repositoryName: 'graphql-api'
        })

        new CfnOutput(this, 'es-api-repo-uri', {
            exportName: 'es-api-repo',
            value: this.esApiRepo.repositoryUri
        })

        new CfnOutput(this, 'es2vt-repo-uri', { 
            exportName: 'es2vt-repo',
            value: this.es2vtRepo.repositoryUri
        })

        new CfnOutput(this, 'graphql-api-rep-uri', {
            exportName: 'graphql-api-repo',
            value: this.graphqlApiRepo.repositoryUri
        })
    }
}