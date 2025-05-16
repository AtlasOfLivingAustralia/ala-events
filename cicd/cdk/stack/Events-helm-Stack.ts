import * as eks from 'aws-cdk-lib/aws-eks';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as s3Assets from 'aws-cdk-lib/aws-s3-assets';

import { AppContext, BaseStack, StackConfig } from "@ala/ala-cdk-libs";
import * as cdk  from 'aws-cdk-lib';

export class EventsHelmStack extends BaseStack {


    constructor(appContext: AppContext, stackConfig: StackConfig) {
    
        super(appContext, stackConfig);

        new cdk.CfnParameter(this, 'esApiTag', { default: 'latest' });
        new cdk.CfnParameter(this, 'es2vtTag', { default: 'latest' });
        new cdk.CfnParameter(this, 'graphqlApiTag', { default: 'latest' });

        // Ensure the IAM role has the necessary permissions
        // const assumeRolePolicy = new iam.PolicyStatement({
        //     effect: iam.Effect.ALLOW,
        //     actions: [ 'sts:AssumeRole' ],
        //     resources: [ '*' ],
        // });

        // const kubectlRole = new iam.Role(this, 'KubectlRole', {
        //     roleName: 'kubectl-role',
        //     assumedBy: new iam.ServicePrincipal('eks.amazonaws.com'),
        //     inlinePolicies: {
        //         AssumeRolePolicy: new iam.PolicyDocument({
        //             statements: [assumeRolePolicy],
        //         }),
        //     },
        // });

        const cluster = eks.Cluster.fromClusterAttributes(this, 'cluster', {
            clusterName: stackConfig.Parameters.clusterName,
            // kubectlRoleArn: kubectlRole.roleArn
            kubectlRoleArn: 'arn:aws:iam::748909248546:role/assume-ala-developer'
        })

        cluster.addHelmChart('events-api', {
            release: 'ala-events-api',
            chartAsset: new s3Assets.Asset(this, 'HelmAsset', {
                path: '../helm'
            }),
            namespace: 'events',
            values: {
                esApi: {
                    image: {
                        repository: `${cdk.Stack.of(this).account}.dkr.ecr.${cdk.Stack.of(this).region}.amazonaws.com/es-api`,
                        tag: cdk.Fn.ref('esApiTag')
                    }
                },
                es2vt: {
                    image: {
                        repository: `${cdk.Stack.of(this).account}.dkr.ecr.${cdk.Stack.of(this).region}.amazonaws.com/es2vt`,
                        tag: cdk.Fn.ref('es2vtTag')
                    }
                },
                graphqlApi: {
                    image: {
                        repository: `${cdk.Stack.of(this).account}.dkr.ecr.${cdk.Stack.of(this).region}.amazonaws.com/graphql-api`,
                        tag: cdk.Fn.ref('graphqlApiTag')
                    }
                }
            }
        })
    }
}