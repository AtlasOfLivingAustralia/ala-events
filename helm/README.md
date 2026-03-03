```
helm update --install ala-events-develop . -n events \
        --set esApi.image.repository=748909248546.dkr.ecr.ap-southeast-2.amazonaws.com/es-api \
        --set graphqlApi.image.repository=748909248546.dkr.ecr.ap-southeast-2.amazonaws.com/graphql-api \
        --set es2vt.image.repository=748909248546.dkr.ecr.ap-southeast-2.amazonaws.com/es2vt \
        --set esApi.apiKey=cb812471-8751-4b6a-9f54-41a08d674144 \
        --set ingress.hostname=events-api.dev.ala.org.au \
        --set "elasticsearch.hosts[0]=http://es1:9200" \
        --set "elasticsearch.hosts[1]=http://es2:9200" \
        --set "elasticsearch.hosts[3]=http://es3:9200"
```