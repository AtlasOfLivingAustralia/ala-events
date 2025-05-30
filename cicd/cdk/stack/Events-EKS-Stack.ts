import * as eks from 'aws-cdk-lib/aws-eks';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as s3Assets from 'aws-cdk-lib/aws-s3-assets';

import { AppContext, BaseStack, StackConfig } from "@ala/ala-cdk-libs";
import * as cdk  from 'aws-cdk-lib';
import { KubectlV32Layer } from '@aws-cdk/lambda-layer-kubectl-v32';

export class EventsEKSStack extends BaseStack {

    readonly cluster: eks.ICluster

    constructor(appContext: AppContext, stackConfig: StackConfig) {
    
        super(appContext, stackConfig);

        new cdk.CfnParameter(this, 'esApiTag', { default: 'latest' });
        new cdk.CfnParameter(this, 'es2vtTag', { default: 'latest' });
        new cdk.CfnParameter(this, 'graphqlApiTag', { default: 'latest' });

        this.cluster = new eks.FargateCluster(this, 'EKSCluster', {
            clusterName: 'events-cluster',
            version: eks.KubernetesVersion.V1_32,
            albController: {
                version: eks.AlbControllerVersion.V2_8_2,
            },
            kubectlLayer: new KubectlV32Layer(this, 'kubectl'),
            authenticationMode: eks.AuthenticationMode.API_AND_CONFIG_MAP,
        });
          
        new eks.AccessEntry(this, 'AlaDeveloperClusterAccess', {
            cluster: this.cluster,
            accessPolicies: [
                eks.AccessPolicy.fromAccessPolicyName('AmazonEKSClusterAdminPolicy', {
                    accessScopeType: eks.AccessScopeType.CLUSTER,
                })
            ],
            principal: `arn:aws:iam::${cdk.Stack.of(this).account}:role/assume-ala-developer`
        })

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

        // // kubectlRole.addToPolicy(new iam.PolicyStatement({
        // //     actions: [
        // //         "eks:AccessKubernetesApi",
        // //         "eks:DescribeCluster"
        // //       ],
        // //       resources: [
        // //         `arn:aws:eks:*:${cdk.Stack.of(this).account}:cluster/*`
        // //       ]
        // // }))


        // this.cluster = eks.Cluster.fromClusterAttributes(this, 'EKS', {
        //     clusterName: stackConfig.Parameters.clusterName,
        //     // kubectlRoleArn: 'arn:aws:iam::748909248546:role/ala-regolith-cluster-testing-ServiceRole-IZ9zpyW4YiH7'
        //     // kubectlRoleArn: `arn:aws:iam::${cdk.Stack.of(this).account}:role/kubectl-role`
        //     // kubectlRoleArn: 'arn:aws:iam::748909248546:role/service-role/code-build-service-role-production'
        //     kubectlRoleArn: kubectlRole.roleArn,
        // })

        // // Ensure the IAM role has the necessary permissions
        // const assumeRolePolicy = new iam.PolicyStatement({
        //     effect: iam.Effect.ALLOW,
        //     actions: ['sts:AssumeRole'],
        //     resources: [`arn:aws:iam::${cdk.Stack.of(this).account}:role/kubectl-role`],
        // });

        // const role = new iam.Role(this, 'KubectlRole', {
        //     roleName: 'kubectl-role',
        //     assumedBy: new iam.AccountRootPrincipal(),
        //     inlinePolicies: {
        //         AssumeRolePolicy: new iam.PolicyDocument({
        //             statements: [assumeRolePolicy],
        //         }),
        //     },
        // });

        // // Map the IAM role to a Kubernetes user
        // const awsAuth = new eks.AwsAuth(this, 'AwsAuth', { cluster: this.cluster });
        // awsAuth.addRoleMapping(kubectlRole, {
        //     username: 'kubectl-user',
        //     groups: ['system:masters']
        // });

        //     // Define the IAM Role for kubectl
        // const kubectlRole = new iam.Role(this, 'KubectlRole', {
        //     assumedBy: new iam.AccountRootPrincipal(), // Allow the account root to assume this role
        //     managedPolicies: [
        //         iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonEKSClusterPolicy'),
        //         iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonEKSWorkerNodePolicy'),
        //         iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonEC2ContainerRegistryReadOnly'),
        //         iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonEKS_CNI_Policy'),
        //         iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonEKSVPCResourceController'),
        //     ],
        // });
    
        // // Add custom inline policies for Kubernetes API access
        // kubectlRole.addToPolicy(new iam.PolicyStatement({
        //     actions: [
        //     'eks:DescribeCluster',
        //     'eks:AccessKubernetesApi',
        //     ],
        //     resources: [`arn:aws:eks:${cdk.Stack.of(this).region}:${cdk.Stack.of(this).account}:cluster/${stackConfig.Parameters.clusterName}`],
        // }));
    
        // // Import the existing EKS cluster
        // this.cluster = eks.Cluster.fromClusterAttributes(this, 'EKS', {
        //     clusterName: stackConfig.Parameters.clusterName,
        //     // kubectlRoleArn: kubectlRole.roleArn,
        //     kubectlRoleArn: 'arn:aws:iam::748909248546:role/assume-eks-admin',
        // });
    
        // // Define the aws-auth ConfigMap update
        // const awsAuthConfigMap = {
        //     apiVersion: 'v1',
        //     kind: 'ConfigMap',
        //     metadata: {
        //     name: 'aws-auth',
        //     namespace: 'kube-system',
        //     },
        //     data: {
        //     mapRoles: JSON.stringify([
        //         {
        //         rolearn: kubectlRole.roleArn,
        //         username: 'kubectl-user',
        //         groups: ['system:masters'],
        //         },
        //     ]),
        //     },
        // };
        // 
        // // Apply the ConfigMap using the cluster's kubectl provider
        // new eks.KubernetesManifest(this, 'AwsAuthConfigMap', {
        //     cluster: this.cluster,
        //     manifest: [awsAuthConfigMap],
        // });

        this.cluster.addHelmChart('events-api', {
            chartAsset: new s3Assets.Asset(this, 'HelmAsset', {
                path: '../helm'
            }),
            namespace: 'events',
            release: 'ala-events-develop',
            values: {
                esApi: {
                    image: {
                        repository: `${cdk.Stack.of(this).account}.dkr.ecr.${cdk.Stack.of(this).region}.amazonaws.com/es-api`,
                        tag: cdk.Fn.ref('esApiTag')
                    },
                    apiKey: 'cb812471-8751-4b6a-9f54-41a08d674144'
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
                },
                elasticsearch: {
                    pv: {
                        volumeHandle: 'fs-0ac5848e7bb206a0a'
                    }
                },
                ingress: {
                    hostname: 'events-api.dev.ala.org.au'
                }
            }
        })

    }
}