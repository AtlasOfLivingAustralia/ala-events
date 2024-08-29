import * as eks from 'aws-cdk-lib/aws-eks';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as s3Assets from 'aws-cdk-lib/aws-s3-assets';

import { AppContext, BaseStack, StackConfig } from "@ala/ala-cdk-libs";
import * as cdk  from 'aws-cdk-lib';

export class EventsEKSStack extends BaseStack {

    readonly cluster: eks.ICluster

    constructor(appContext: AppContext, stackConfig: StackConfig) {
    
        super(appContext, stackConfig);

        new cdk.CfnParameter(this, 'esApiTag', { default: 'latest' });
        new cdk.CfnParameter(this, 'es2vtTag', { default: 'latest' });
        new cdk.CfnParameter(this, 'graphqlApiTag', { default: 'latest' });

        // Ensure the IAM role has the necessary permissions


        // const kubectlRole = new iam.Role(this, 'KubectlRole', {
        //     assumedBy: new iam.AccountRootPrincipal(),
        //     // inlinePolicies: {
        //     //     AssumeRolePolicy: new iam.PolicyDocument({
        //     //         statements: [ assumeRolePolicy ],
        //     //     }),
        //     // },
        // });

        // const assumeRolePolicy = new iam.PolicyStatement({
        //     effect: iam.Effect.ALLOW,
        //     actions: [ 'sts:AssumeRole' ],
        //     resources: [ '*' ],
        // });

        // kubectlRole.addToPolicy(assumeRolePolicy);

        // const kubectlRole = new iam.Role(this, 'KubectlRole', {
        //     assumedBy: new iam.AccountRootPrincipal(),
        //     managedPolicies: [
        //         iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonEKSClusterPolicy'),
        //         iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonEKSWorkerNodePolicy'),
        //         iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonEC2ContainerRegistryReadOnly'),
        //         iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonEKS_CNI_Policy'), // Add CNI policy
        //         iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonEKSVPCResourceController') // Add VPC resource controller policy
        //     ],

        // });

        // kubectlRole.addToPolicy(new iam.PolicyStatement({
        //     actions: [
        //         "eks:AccessKubernetesApi",
        //         "eks:DescribeCluster"
        //       ],
        //       resources: [
        //         `arn:aws:eks:*:${cdk.Stack.of(this).account}:cluster/*`
        //       ]
        // }))

        this.cluster = eks.Cluster.fromClusterAttributes(this, 'EKS', {
            clusterName: stackConfig.Parameters.clusterName,
            kubectlRoleArn: `arn:aws:iam::${cdk.Stack.of(this).account}:role/kubectl-role`
            // kubectlRoleArn: 'arn:aws:iam::748909248546:role/service-role/code-build-service-role-production'
            // kubectlRoleArn: kubectlRole.roleArn,
        })

        // Ensure the IAM role has the necessary permissions
        const assumeRolePolicy = new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            actions: ['sts:AssumeRole'],
            resources: [`arn:aws:iam::${cdk.Stack.of(this).account}:role/kubectl-role`],
        });

        const role = new iam.Role(this, 'KubectlRole', {
            roleName: 'kubectl-role',
            assumedBy: new iam.AccountRootPrincipal(),
            inlinePolicies: {
                AssumeRolePolicy: new iam.PolicyDocument({
                    statements: [assumeRolePolicy],
                }),
            },
        });

        // // Map the IAM role to a Kubernetes user
        // const awsAuth = new eks.AwsAuth(this, 'AwsAuth', { cluster: this.cluster });
        // awsAuth.addRoleMapping(kubectlRole, {
        //     username: 'kubectl-user',
        //     groups: ['system:masters']
        // });

        this.cluster.addHelmChart('events-api', {
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