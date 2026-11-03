import React from 'react';
import {Button, Properties} from "../../../components";
import * as css from "../styles";
import {Group} from "./Groups";
import {EnumFacetListInline, FacetList} from "./properties";
import {Measurements} from "./Measurements";
import {SingleTree} from "./Tree/SingleTree";
import {MeasurementSummary} from "./MeasurementSummary";

const { Term: T, Value: V } = Properties;

export function Summaries({ event, setActiveEvent, addEventTypeToSearch, setTab, data, showAll }) {

  let termMap = {};
  Object.entries(data?.results?.facet).forEach(item => {
    termMap[item[0]] = {
      "simpleName": item[0],
      "value": item[1]
    }
  })

  Object.entries(data?.results?.occurrenceFacet).forEach(item => {
    termMap[item[0]] = {
      "simpleName": item[0],
      "value": item[1]
    }
  })

  let hasEventType = false;
  if (data?.results?.documents.results?.length > 0
      && data?.results?.documents.results[0]?.eventType?.concept) {
    hasEventType = true;
  }

  let rootNode = null;
  let mofHierarchyJoined = [];
  let hasMeasurement = false;
  if (hasEventType) {

    const eventHierarchy = event.eventHierarchy;
    const eventTypeHierarchy = event.eventTypeHierarchy;

    // build hierarchy from root to current event node
    let parentCount = 1;

    rootNode = {
      key: eventHierarchy[0],
      name: eventTypeHierarchy[0],
      isSelected: eventTypeHierarchy[0] == event?.eventType?.concept,
      count: 1,
      isClickable: true,
      children: []
    }
    let currentNode = rootNode;
    for (let i = 1; i < eventHierarchy.length; i++) {
      const newNode = {
        key: eventHierarchy[i],
        name: eventTypeHierarchy[i],
        isSelected: eventTypeHierarchy[i] == event?.eventType?.concept,
        count: 1,
        isClickable: true,
        children: []
      }
      currentNode.children.push(newNode);
      currentNode = newNode;
      parentCount = parentCount + 1;
    }

    // add hierarchy from events
    const eventHierarchyJoined = data?.results?.facet?.eventTypeHierarchyJoined.sort(function (a, b) {
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
            isClickable: hierarchy.count === 1,
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
    mofHierarchyJoined = data?.mofResults?.facet?.eventTypeHierarchyJoined.sort(function (a, b) {
      return a.key.length - b.key.length
    });

    function checkIfHasMeasurement(mofHierarchyJoined) {
      if (mofHierarchyJoined.length == 1 && (mofHierarchyJoined[0].key.endsWith("Find") ||  mofHierarchyJoined[0].key.endsWith("SiteVisit") ||  mofHierarchyJoined[0].key.endsWith("Subsurvey"))) {
          return true;
      } else {
        return false;
      }
    }
    hasMeasurement = checkIfHasMeasurement(mofHierarchyJoined);

    //Calculate how may measurements attached to 'Survey','Sample','Find' etc
    const measurements = mofHierarchyJoined.reduce(function(measurementsCount, record){
      let total = record?.events?.facet?.measurementOrFactTypes.reduce(function(count, mft){
          count += mft.count;
          return count;
      }, 0)
      measurementsCount[record.key] = total;
      return measurementsCount;
    },{})

    mofHierarchyJoined.forEach(hierarchy => {
      let nodes = hierarchy.key.split(" / ").map(s => s.trim());
      nodes.push("Measurement");
      // add to the last parent (should be the selected event)
      let startingNode = currentNode;
      for (let i = parentCount; i < nodes.length; i++){
        // do we have this child node already ?
        let existingChild = startingNode.children.find(node => node.key == nodes[i]);
        if (!existingChild){
          let keyChain = nodes.slice(0, i);
          let fullKey = keyChain.join(" / ");
          let measurementCount = measurements[fullKey];
          let newNode = {
            key: nodes[i],
            name: nodes[i],
            isSelected: false,
            count: measurementCount,
            isClickable: false,
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
    const occurrenceHierarchyJoined = data?.results?.occurrenceFacet?.eventTypeHierarchyJoined.sort(function (a, b) {
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
          let count = data.results?.occurrenceFacet?.datasetKey[0]?.count ?? 0;
          let newNode = {
            key: nodes[i],
            name: nodes[i],
            isSelected: false,
            count: count,
            isClickable: false,
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

  function setViewEvent(eventID){
    setActiveEvent(eventID, event.datasetKey);
  }

  function setSearch(eventType){
    if (eventType != "Occurrence" && eventType != "Measurement"){
      addEventTypeToSearch(event.eventID, eventType)
    }
  }

  return <>
    <Group label="eventDetails.groups.occurrence">
      <Properties css={css.properties} breakpoint={800}>
        <EnumFacetListInline term={termMap.basisOfRecord} showDetails={showAll}  getEnum={value => `enums.basisOfRecord.${value}`}/>
        <EnumFacetListInline term={termMap.occurrenceStatus} showDetails={showAll}  getEnum={value => `enums.occurrenceStatus.${value}`}/>
      </Properties>
      <Button look="primaryOutline" style={{ marginTop: '20px', fontSize: '11px' }}
        onClick={() => setTab("occurrences")}
      >
        View occurrences
      </Button>
    </Group>
    <Group label="eventDetails.groups.dataStructure">
      {rootNode &&
          <SingleTree rootNode={rootNode} setViewEvent={setViewEvent} setSearch={setSearch} />
      }
    </Group>
    <Methodology             {...{ showAll, termMap }} />
    {hasMeasurement &&  <Measurements data={data.measurementResults}  /> }
    {!hasMeasurement &&  <MeasurementSummary data={mofHierarchyJoined}  /> }
  </>
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
