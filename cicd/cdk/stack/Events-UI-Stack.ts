import * as cert from 'aws-cdk-lib/aws-certificatemanager'
import * as route53 from 'aws-cdk-lib/aws-route53'


import { AppContext, BaseStack, StackConfig, StaticSpa } from "@ala/ala-cdk-libs";
import { CfnOutput } from 'aws-cdk-lib';

export class EventsUIStack extends BaseStack {

    readonly eventsSpa: StaticSpa;

    constructor(appContext: AppContext, stackConfig: StackConfig) {

        super(appContext, stackConfig);

        if (stackConfig.Parameters.domain) {

            const hostedZone = route53.HostedZone.fromHostedZoneAttributes(this, 'HostedZone', {
                hostedZoneId: stackConfig.Parameters.domain.zoneId,
                zoneName: stackConfig.Parameters.domain.zoneName
            })
            const certificate = cert.Certificate.fromCertificateArn(this, 'Certificate', stackConfig.Parameters.domain.certificateArn)

            this.eventsSpa = new StaticSpa(this, 'EventsUI', {
                customDomain: {
                    hostedZone: hostedZone,
                    domainNames: [ stackConfig.Parameters.domain.domainName ],
                    certificate: certificate
                },
                entryPage: '/ala-demo.html'
            })
        } else {

            this.eventsSpa = new StaticSpa(this, 'EventsUI', {})
        }

        new CfnOutput(this, 'EventsBucketArn', { key: 'EventsBucketArn', value: this.eventsSpa.bucket.bucketArn })
        new CfnOutput(this, 'EventsBucketName', { key: 'EventsBucketName', value: this.eventsSpa.bucket.bucketName })
        new CfnOutput(this, 'EventsDistributionId', { key: 'EventsDistributionId', value: this.eventsSpa.distribution.distributionId })
    }
}