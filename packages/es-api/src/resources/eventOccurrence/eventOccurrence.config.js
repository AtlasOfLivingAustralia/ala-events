const { lineageKeyOptions } = require('../shared/lineageKey');

const config = 
{
  options: {
    "q": {
      "type": "text",
      "field": "occurrence.all",
      "get": {
        "type": "fuzzy"
      }
    },
    "amplificationItems": {
      "field": "occurrence.amplificationItems",
      "discarded": true
    },
    "australiaSpatialLayers": {
      "field": "occurrence.australiaSpatialLayers",
      "discarded": true
    },
    "basisOfRecord": {
      "type": "keyword",
      "field": "occurrence.basisOfRecord"
    },
    "catalogNumber": {
      "type": "keyword",
      "field": "occurrence.catalogNumber.keyword",
      "suggestField": "catalogNumber.suggest"
    },
    "isInCluster": {
      "type": "boolean",
      "field": "occurrence.isClustered"
    },
    "collectionCode": {
      "type": "keyword",
      "field": "occurrence.collectionCode.keyword",
      "suggestField": "collectionCode.suggest"
    },
    "collectionKey": {
      "type": "keyword",
      "field": "occurrence.collectionKey"
    },
    "continent": {
      "type": "keyword",
      "field": "occurrence.continent"
    },
    "coordinatePrecision": {
      "type": "numeric",
      "field": "occurrence.coordinatePrecision",
      "get": {
        "type": "range_or_term",
        "defaultUpperBound": "gte",
        "defaultLowerBound": "lte"
      }
    },
    "coordinateUncertaintyInMeters": {
      "type": "numeric",
      "field": "occurrence.coordinateUncertaintyInMeters",
      "get": {
        "type": "range_or_term",
        "defaultUpperBound": "gte",
        "defaultLowerBound": "lte"
      }
    },
    "coordinates": {
      "field": "occurrence.coordinates",
      "discarded": true
    },
    // "country": {
    //   "type": "text",
    //   "field": "occurrence.country",
    //   "get": {
    //     "type": "fuzzy"
    //   }
    // },
    "country": {
      "type": "keyword",
      "field": "occurrence.countryCode"
    },
    "countryCode": {
      "type": "keyword",
      "field": "occurrence.countryCode"
    },
    "crawlId": {
      "type": "numeric",
      "field": "occurrence.crawlId",
      "get": {
        "type": "range_or_term",
        "defaultUpperBound": "gte",
        "defaultLowerBound": "lte"
      }
    },
    "created": {
      "type": "date",
      "field": "occurrence.created",
      "get": {
        "type": "range_or_term",
        "defaultUpperBound": "gte",
        "defaultLowerBound": "lte"
      }
    },
    "datasetID": {
      "type": "keyword",
      "field": "occurrence.datasetID"
    },
    "datasetKey": {
      "type": "keyword",
      "field": "metadata.datasetKey"
    },
    "datasetName": {
      "type": "keyword",
      "field": "occurrence.datasetName.keyword",
      "suggestField": "datasetName.suggest"
    },
    "datasetPublishingCountry": {
      "type": "keyword",
      "field": "occurrence.datasetPublishingCountry"
    },
    "datasetTitle": {
      "type": "keyword",
      "field": "occurrence.datasetTitle"
    },
    "dateIdentified": {
      "type": "date",
      "field": "occurrence.dateIdentified",
      "get": {
        "type": "range_or_term",
        "defaultUpperBound": "gte",
        "defaultLowerBound": "lte"
      }
    },
    "day": {
      "type": "numeric",
      "field": "occurrence.day",
      "get": {
        "type": "range_or_term",
        "defaultUpperBound": "gte",
        "defaultLowerBound": "lte"
      }
    },
    "decimalLatitude": {
      "type": "numeric",
      "field": "occurrence.decimalLatitude",
      "get": {
        "type": "range_or_term",
        "defaultUpperBound": "gte",
        "defaultLowerBound": "lte"
      }
    },
    "decimalLongitude": {
      "type": "numeric",
      "field": "occurrence.decimalLongitude",
      "get": {
        "type": "range_or_term",
        "defaultUpperBound": "gte",
        "defaultLowerBound": "lte"
      }
    },
    "depth": {
      "type": "numeric",
      "field": "occurrence.depth",
      "get": {
        "type": "range_or_term",
        "defaultUpperBound": "gte",
        "defaultLowerBound": "lte"
      }
    },
    "depthAccuracy": {
      "type": "numeric",
      "field": "occurrence.depthAccuracy",
      "get": {
        "type": "range_or_term",
        "defaultUpperBound": "gte",
        "defaultLowerBound": "lte"
      }
    },
    "dwcaExtension": {
      "type": "keyword",
      "field": "occurrence.extensions"
    },
    "elevation": {
      "type": "numeric",
      "field": "occurrence.elevation",
      "get": {
        "type": "range_or_term",
        "defaultUpperBound": "gte",
        "defaultLowerBound": "lte"
      }
    },
    "elevationAccuracy": {
      "type": "numeric",
      "field": "occurrence.elevationAccuracy",
      "get": {
        "type": "range_or_term",
        "defaultUpperBound": "gte",
        "defaultLowerBound": "lte"
      }
    },
    "endDayOfYear": {
      "type": "numeric",
      "field": "occurrence.endDayOfYear",
      "get": {
        "type": "range_or_term",
        "defaultUpperBound": "gte",
        "defaultLowerBound": "lte"
      }
    },
    "endorsingNodeKey": {
      "type": "keyword",
      "field": "occurrence.endorsingNodeKey"
    },
    "establishmentMeans": {
      "type": "keyword",
      "field": "occurrence.establishmentMeans.concept"
    },
    // "eventDate": {
    //   "field": "occurrence.eventDate",
    //   "discarded": true
    // },
    "eventDate": {
      "type": "date",
      "field": "occurrence.eventDateSingle",
      "get": {
        "type": "range_or_term",
        "defaultUpperBound": "gte",
        "defaultLowerBound": "lte"
      }
    },
    "eventID": {
      "type": "keyword",
      "field": "occurrence.eventId"
    },
    "eventId": {
      "type": "keyword",
      "field": "occurrence.eventId"
    },
    "eventHierarchy": {
      "type": "keyword",
      "field": "occurrence.eventHierarchy",
    },
    "eventHierarchyJoined": {
      "type": "keyword",
      "field": "occurrence.eventHierarchyJoined",
    },
    "eventTypeHierarchy": {
      "type": "keyword",
      "field": "occurrence.eventTypeHierarchy",
    },
    "eventTypeHierarchyJoined": {
      "type": "keyword",
      "field": "occurrence.eventTypeHierarchyJoined",
    },
    "eventType": {
      "parentJoin": "event",
      "config": {
        "options": {
          "eventType": {
            "type": "keyword",
            "field": "event.eventType.concept"
          }
        }
      }
    },
    "measurementOrFactTypes": {
      "parentJoin": "event",
      "config": {
        "options": {
          "measurementOrFactTypes": {
            "type": "keyword",
            "field": "event.measurementOrFactTypes.keyword"
          }
        }
      }
    },
    "gadmGid": {
      "type": "keyword",
      "field": "occurrence.gadm.gids"
    },
    "key": {
      "type": "numeric",
      "field": "occurrence.gbifId",
      "get": {
        "type": "range_or_term",
        "defaultUpperBound": "gte",
        "defaultLowerBound": "lte"
      }
    },
    "hasCoordinate": {
      "type": "boolean",
      "field": "occurrence.hasCoordinate"
    },
    "locationID": {
      "type": "keyword",
      "field": "occurrence.locationID.keyword"
    },
    "hasGeospatialIssue": {
      "type": "boolean",
      "field": "occurrence.hasGeospatialIssue"
    },
    "id": {
      "type": "keyword",
      "field": "occurrence.id"
    },
    "identifiedBy": {
      "type": "keyword",
      "field": "occurrence.identifiedBy.verbatim",
      "suggestField": "identifiedBy.suggest"
    },
    "individualCount": {
      "type": "numeric",
      "field": "occurrence.individualCount",
      "get": {
        "type": "range_or_term",
        "defaultUpperBound": "gte",
        "defaultLowerBound": "lte"
      }
    },
    "installationKey": {
      "type": "keyword",
      "field": "occurrence.installationKey"
    },
    "institutionCode": {
      "type": "keyword",
      "field": "occurrence.institutionCode.keyword",
      "suggestField": "institutionCode.suggest",
      "suggestField": "institutionCode.suggest"
    },
    "institutionKey": {
      "type": "keyword",
      "field": "occurrence.institutionKey"
    },
    "issue": {
      "type": "keyword",
      "field": "occurrence.issues"
    },
    "lastCrawled": {
      "type": "date",
      "field": "occurrence.lastCrawled",
      "get": {
        "type": "range_or_term",
        "defaultUpperBound": "gte",
        "defaultLowerBound": "lte"
      }
    },
    "license": {
      "type": "keyword",
      "field": "occurrence.license"
    },
    "lifeStage": {
      "type": "keyword",
      "field": "occurrence.lifeStage"
    },
    "locality": {
      "type": "keyword",
      "field": "occurrence.locality.keyword",
      "suggestField": "locality.suggest"
    },
    "maximumDepthInMeters": {
      "type": "numeric",
      "field": "occurrence.maximumDepthInMeters",
      "get": {
        "type": "range_or_term",
        "defaultUpperBound": "gte",
        "defaultLowerBound": "lte"
      }
    },
    "maximumDistanceAboveSurfaceInMeters": {
      "type": "numeric",
      "field": "occurrence.maximumDistanceAboveSurfaceInMeters",
      "get": {
        "type": "range_or_term",
        "defaultUpperBound": "gte",
        "defaultLowerBound": "lte"
      }
    },
    "maximumElevationInMeters": {
      "type": "numeric",
      "field": "occurrence.maximumElevationInMeters",
      "get": {
        "type": "range_or_term",
        "defaultUpperBound": "gte",
        "defaultLowerBound": "lte"
      }
    },
    "measurementOrFactItems": {
      "field": "occurrence.measurementOrFactItems",
      "discarded": true
    },
    "mediaLicenses": {
      "type": "keyword",
      "field": "occurrence.mediaLicenses"
    },
    "mediaType": {
      "type": "keyword",
      "field": "occurrence.mediaTypes"
    },
    "minimumDepthInMeters": {
      "type": "numeric",
      "field": "occurrence.minimumDepthInMeters",
      "get": {
        "type": "range_or_term",
        "defaultUpperBound": "gte",
        "defaultLowerBound": "lte"
      }
    },
    "minimumDistanceAboveSurfaceInMeters": {
      "type": "numeric",
      "field": "occurrence.minimumDistanceAboveSurfaceInMeters",
      "get": {
        "type": "range_or_term",
        "defaultUpperBound": "gte",
        "defaultLowerBound": "lte"
      }
    },
    "minimumElevationInMeters": {
      "type": "numeric",
      "field": "occurrence.minimumElevationInMeters",
      "get": {
        "type": "range_or_term",
        "defaultUpperBound": "gte",
        "defaultLowerBound": "lte"
      }
    },
    "modified": {
      "type": "date",
      "field": "occurrence.modified",
      "get": {
        "type": "range_or_term",
        "defaultUpperBound": "gte",
        "defaultLowerBound": "lte"
      }
    },
    "month": {
      "type": "numeric",
      "field": "occurrence.month",
      "get": {
        "type": "range_or_term",
        "defaultUpperBound": "gte",
        "defaultLowerBound": "lte"
      }
    },
    "multimediaItems": {
      "field": "occurrence.multimediaItems",
      "discarded": true
    },
    "networkKey": {
      "type": "keyword",
      "field": "occurrence.networkKeys"
    },
    "notIssues": {
      "type": "keyword",
      "field": "occurrence.notIssues"
    },
    "occurrenceId": {
      "type": "keyword",
      "field": "occurrence.occurrenceId.keyword",
      "suggestField": "occurrenceId.suggest"
    },
    "occurrenceStatus": {
      "type": "keyword",
      "field": "occurrence.occurrenceStatus"
    },
    "organismId": {
      "type": "keyword",
      "field": "occurrence.organismId.keyword",
      "suggestField": "organismId.suggest"
    },
    "organismQuantity": {
      "type": "numeric",
      "field": "occurrence.organismQuantity",
      "get": {
        "type": "range_or_term",
        "defaultUpperBound": "gte",
        "defaultLowerBound": "lte"
      }
    },
    "organismQuantityType": {
      "type": "keyword",
      "field": "occurrence.organismQuantityType"
    },
    "parentEventID": {
      "type": "keyword",
      "field": "occurrence.parentEventID.keyword",
      "suggestField": "parentEventID.suggest"
    },
    "parentEventId": {
      "type": "keyword",
      "field": "occurrence.parentEventID.keyword",
      "suggestField": "parentEventID.suggest"
    },
    "preparations": {
      "type": "keyword",
      "field": "occurrence.preparations"
    },
    "programmeAcronym": {
      "type": "keyword",
      "field": "occurrence.programmeAcronym"
    },
    "projectId": {
      "type": "keyword",
      "field": "occurrence.projectId"
    },
    "protocol": {
      "type": "keyword",
      "field": "occurrence.protocol"
    },
    "publisherTitle": {
      "type": "keyword",
      "field": "occurrence.publisherTitle"
    },
    "publishingCountry": {
      "type": "keyword",
      "field": "occurrence.publishingCountry"
    },
    "publishingOrg": {
      "type": "keyword",
      "field": "occurrence.publishingOrganizationKey"
    },
    "hostingOrganizationKey": {
      "type": "keyword",
      "field": "occurrence.hostingOrganizationKey"
    },
    "recordNumber": {
      "type": "keyword",
      "field": "occurrence.recordNumber.keyword",
      "suggestField": "recordNumber.suggest"
    },
    "recordedBy": {
      "type": "keyword",
      "field": "occurrence.recordedBy.verbatim",
      "suggestField": "recordedBy.suggest"
    },
    "references": {
      "type": "text",
      "field": "occurrence.references",
      "get": {
        "type": "fuzzy"
      }
    },
    "relativeOrganismQuantity": {
      "type": "numeric",
      "field": "occurrence.relativeOrganismQuantity",
      "get": {
        "type": "range_or_term",
        "defaultUpperBound": "gte",
        "defaultLowerBound": "lte"
      }
    },
    "repatriated": {
      "type": "boolean",
      "field": "occurrence.repatriated"
    },
    "sampleSizeUnit": {
      "type": "keyword",
      "field": "occurrence.sampleSizeUnit"
    },
    "sampleSizeValue": {
      "type": "numeric",
      "field": "occurrence.sampleSizeValue",
      "get": {
        "type": "range_or_term",
        "defaultUpperBound": "gte",
        "defaultLowerBound": "lte"
      }
    },
    "samplingProtocol": {
      "type": "keyword",
      "field": "occurrence.samplingProtocol.keyword",
      "suggestField": "samplingProtocol.suggest"
    },
    "geometry": {
      "type": "geo_shape",
      "field": "occurrence.scoordinates",
      "get": {
        "type": "within"
      }
    },
    "sex": {
      "type": "keyword",
      "field": "occurrence.sex"
    },
    "startDayOfYear": {
      "type": "numeric",
      "field": "occurrence.startDayOfYear",
      "get": {
        "type": "range_or_term",
        "defaultUpperBound": "gte",
        "defaultLowerBound": "lte"
      }
    },
    "stateProvince": {
      "type": "keyword",
      "field": "occurrence.stateProvince.keyword",
      "suggestField": "stateProvince.suggest"
    },
    "typeStatus": {
      "type": "keyword",
      "field": "occurrence.typeStatus"
    },
    "typifiedName": {
      "type": "keyword",
      "field": "occurrence.typifiedName"
    },
    "verbatim": {
      "field": "occurrence.verbatim",
      "discarded": true
    },
    "waterBody": {
      "type": "keyword",
      "field": "occurrence.waterBody.keyword",
      "suggestField": "waterBody.suggest"
    },
    "year": {
      "type": "numeric",
      "field": "occurrence.year",
      "get": {
        "type": "range_or_term",
        "defaultUpperBound": "gte",
        "defaultLowerBound": "lte"
      }
    },
    "agentIds_type": {
      "type": "keyword",
      "field": "occurrence.agentIds.type"
    },
    "agentIds_value": {
      "type": "keyword",
      "field": "occurrence.agentIds.value"
    },
    // shortcut: leaf taxon key, not a species-rank name, until taxonomy.rank is indexed
    "species": {
      "type": "keyword",
      "field": "leafTaxonKey"
    },
    ...lineageKeyOptions("occurrence.taxonomy", ["gbifClassification_acceptedUsage_key"]),
    "scientificNames": {
      "type": "keyword",
      "field": "scientificNames.keyword",
      "get": {
        "type": "fuzzy"
      }
    },
    "identifiedByIdType": {
      type: "keyword",
      field: "identifiedByIds.type"
    },
    "identifiedById": {
      type: "keyword",
      field: "identifiedByIds.value"
    },
    "recordedByIdType": {
      type: "keyword",
      field: "recordedByIds.type"
    },
    "recordedById": {
      type: "keyword",
      field: "recordedByIds.value"
    }
  }
};

module.exports = {
  config
}
