import React, {useContext} from 'react';
import { Properties } from "../../../components";
import * as css from "../styles";
import {Group} from "./Groups";
import {EnumFacetListInline, FacetList, FacetListInline} from "./properties";
import {Measurements} from "./Measurements";
import {SingleTree} from "./Tree/SingleTree";

const { Term: T, Value: V } = Properties;

export function Summaries({ event, data, showAll }) {

  let termMap = {}
  Object.entries(data.results.facet).forEach(item => {
    termMap[item[0]] = {
      "simpleName": item[0],
      "value": item[1]
    }
  })

  Object.entries(data.results.occurrenceFacet).forEach(item => {
    termMap[item[0]] = {
      "simpleName": item[0],
      "value": item[1]
    }
  })

  let hasEventType = false;
  if (data.results.documents.results
      && data.results.documents.results.length > 0
      && data.results.documents.results[0].eventType
      && data.results.documents.results[0].eventType.concept) {
    hasEventType = true;
  }

  let combinedHierarchy = [];
  let rootNode = null;
  if (hasEventType) {

    const eventHierarchy = event.eventHierarchy;
    const eventTypeHierarchy = event.eventTypeHierarchy;

    // build hierarchy from root to current event node
    let parentCount = 1;

    rootNode = {
      key: eventHierarchy[0],
      name: eventTypeHierarchy[0],
      isSelected: eventTypeHierarchy[0] == event.eventType.concept,
      count: 1,
      children: []
    }
    let currentNode = rootNode;
    for (let i = 1; i < eventHierarchy.length; i++) {
      const newNode = {
        key: eventHierarchy[i],
        name: eventTypeHierarchy[i],
        isSelected: eventTypeHierarchy[i] == event.eventType.concept,
        count: 1,
        children: []
      }
      currentNode.children.push(newNode);
      currentNode = newNode;
      parentCount = parentCount + 1;
    }

    // add hierarchy from events
    const eventHierarchyJoined = data?.results.facet.eventTypeHierarchyJoined.sort(function (a, b) {
      return a.key.length - b.key.length
    });
    eventHierarchyJoined.forEach(hierarchy => {
      let nodes = hierarchy.key.split(" / ").map(s => s.trim());
      // add to the last parent (should be the selected event)
      let startingNode = currentNode;
      for (let i = parentCount; i < nodes.length; i++){

        // do we have this child node already ?
        let existingChild = startingNode.children.find(node => node.key == nodes[i]);
        if (!existingChild){
          let newNode = {
            key: nodes[i],
            name: nodes[i],
            isSelected: false,
            count: hierarchy.count,
            children: []
          }
          startingNode.children.push(newNode);
          startingNode = newNode;
        } else {
          startingNode = existingChild;
        }
      }
    });

    // add hierarchy from mofs
    const mofHierarchyJoined = data?.mofResults.facet.eventTypeHierarchyJoined.sort(function (a, b) {
      return a.key.length - b.key.length
    });
    mofHierarchyJoined.forEach(hierarchy => {
      let nodes = hierarchy.key.split(" / ").map(s => s.trim());
      nodes.push("Measurement");
      // add to the last parent (should be the selected event)
      let startingNode = currentNode;
      for (let i = parentCount; i < nodes.length; i++){

        // do we have this child node already ?
        let existingChild = startingNode.children.find(node => node.key == nodes[i]);
        if (!existingChild){
          let newNode = {
            key: nodes[i],
            name: nodes[i],
            isSelected: false,
            count: hierarchy.count,
            children: []
          }
          startingNode.children.push(newNode);
          startingNode = newNode;
        } else {
          startingNode = existingChild;
        }
      }
    });

    // add hierarchy from occurrence
    const occurrenceHierarchyJoined = data?.results.occurrenceFacet.eventTypeHierarchyJoined.sort(function (a, b) {
      return a.key.length - b.key.length
    });
    occurrenceHierarchyJoined.forEach(hierarchy => {
      let nodes = hierarchy.key.split(" / ").map(s => s.trim());
      nodes.push("Occurrence");
      // add to the last parent (should be the selected event)
      let startingNode = currentNode;
      for (let i = parentCount; i < nodes.length; i++){

        // do we have this child node already ?
        let existingChild = startingNode.children.find(node => node.key == nodes[i]);
        if (!existingChild){
          let newNode = {
            key: nodes[i],
            name: nodes[i],
            isSelected: false,
            count: hierarchy.count,
            children: []
          }
          startingNode.children.push(newNode);
          startingNode = newNode;
        } else {
          startingNode = existingChild;
        }
      }
    });
  }

  return <>
    <Group label="eventDetails.groups.occurrence">
      <Properties css={css.properties} breakpoint={800}>
        <EnumFacetListInline term={termMap.basisOfRecord} showDetails={showAll}  getEnum={value => `enums.basisOfRecord.${value}`}/>
      </Properties>
    </Group>
    <Group label="eventDetails.groups.dataStructure">
      {rootNode &&
          <SingleTree rootNode={rootNode} />
      }
    </Group>
    <Methodology             {...{ showAll, termMap }} />
    <TaxonomicCoverage       {...{ showAll, termMap }} />
    <Measurements             data={data}  />
  </>
}

function TaxonomicCoverage({ showAll, termMap }) {
  const hasContent = [
    'kingdom',
    'phylum',
    'order',
    'class',
    'family',
    'genus'
  ].find(x => termMap[x]);
  if (!hasContent) return null;

  return <Group label="eventDetails.groups.taxonomicCoverage">
    <Properties css={css.properties} breakpoint={800}>
      <FacetListInline term={termMap.kingdom} showDetails={showAll}/>
      <FacetListInline term={termMap.phylum} showDetails={showAll}/>
      <FacetListInline term={termMap.class} showDetails={showAll}/>
      <FacetListInline term={termMap.order} showDetails={showAll}/>
      <FacetListInline term={termMap.family} showDetails={showAll}/>
      <FacetListInline term={termMap.genus} showDetails={showAll}/>
    </Properties>
  </Group>
}

function Methodology({ showAll, termMap }) {
  const hasContent = [
    'recordedBy',
    'recordedById',
    'identifiedBy',
    'samplingProtocol'
  ].find(x => termMap[x] && termMap[x].value && (Array.isArray(termMap[x].value) ? termMap[x].value.length > 0 : false));
  if (!hasContent) return null;
  return <Group label="eventDetails.groups.methodology">
    <Properties css={css.properties} breakpoint={800}>
      <FacetList term={termMap.recordedBy} showDetails={showAll} />
      <FacetList term={termMap.recordedById} showDetails={showAll} />
      <FacetList term={termMap.identifiedBy} showDetails={showAll} />
      <FacetList term={termMap.samplingProtocol} showDetails={showAll} />
    </Properties>
  </Group>
}
