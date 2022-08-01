import React, { useState, useContext, useEffect, useCallback } from 'react';
import EventContext from '../../../SearchContext';
import SiteContext from '../../../../dataManagement/SiteContext'
import { useDialogState } from "reakit/Dialog";
import * as styles from './downloadPresentation.styles';
import {Button, Popover, Skeleton} from '../../../../components';
import env from '../../../../../.env.json';
import {FilterContext} from "../../../../widgets/Filter/state";
import {filter2predicate} from "../../../../dataManagement/filterAdapter";

export const DownloadPresentation = ({ more, size, data, total, loading }) => {

  const dialog = useDialogState({ animated: true, modal: false });
  const items = data?.eventSearch?.facet?.datasetKey || [];

  if (loading){
    return <>Loading...</>;
  }

  if (!items || items.length == 0){
    return <>No datasets matching this search are available for download</>;
  }

  return <>
    <div>
        <ul key={`dataset_results`} style={{ padding: 0, margin: 0 }}>
          {items.length > 0 && items.map((item, index) => <li key={`dataset_results_${item.key}`}>
            <DatasetResult
                index={index}
                dialog={dialog}
                key={item.key}
                item={item}
                largest={items[0].count}
            />
          </li>)}
        </ul>
    </div>
  </>
}

function DatasetResult({ largest, item, indicator, theme,  index, dialog,...props }) {

  const [visible, setVisible] = useState(false);
  const isAvailable = item.archive.fileSizeInMB != null;

  return <div css={styles.dataset({ theme })}>
    <a css={styles.actionOverlay({theme})} href={`${item.key}`} onClick={(event) => {
      if (
        event.ctrlKey ||
        event.shiftKey ||
        event.metaKey || // apple
        (event.button && event.button == 1) // middle click, >IE9 + everyone else
      ) {
        return;
      } else {
        dialog.show();
        event.preventDefault();
      }
    }}></a>
    <div css={styles.title({ theme })}>
      <div style={{ flex: '1 1 auto' }}>
        {item.datasetTitle}
        {isAvailable && <div>
          <br/>
          <span>Compressed archive size: {item.archive.fileSizeInMB}MB</span>
          <br/>
          <span>Format: Darwin core archive / Frictionless data package</span>
          <br/>
          <span>Last generated: {item.archive.modified}</span>
        </div>}
      </div>
      <div>

        {isAvailable && <div>
              <Popover
                  trigger={<Button onClick={() => setVisible(true)}>Download</Button>}
                  onClickOutside={action => console.log('close request', action)}
                  visible={visible}>
                <ParentThatFetches hide={() => setVisible(false)}  dataset={item}/>
              </Popover>
        </div>}

        {!isAvailable && <div>
          <Button  look="primaryOutline" disabled={true} >
            Not currently available for download
          </Button>
        </div>}

      </div>
    </div>
  </div>
}

export function  ParentThatFetches ({hide, dataset}) {
  const [user, setUser] = useState();
  const siteContext = useContext(SiteContext);
  useEffect(() => {
    const getData = async () => {
      const user = await siteContext.auth?.getUser()
      setUser(user);
    }
    getData();
  }, []);

  return <>
    {user && <DownloadForm user={user} hide={hide} dataset={dataset}/>}
    {!user &&
        <div style={{ padding: "30px" }}>
          <h3>Please login to download</h3>
          <p>
            Please log in to download.
          </p>
          <Button onClick={() => siteContext.auth.signIn()} look="primaryOutline" style={{marginRight: '6px'}}>Login</Button>
          <Button onClick={() => hide()} look="primaryOutline">Close</Button>
        </div>}
  </>
}

export function DownloadForm ({  hide, dataset, user }) {

  const siteContext = useContext(SiteContext);
  const currentFilterContext = useContext(FilterContext);
  const { rootPredicate, predicateConfig } = useContext(EventContext);

  const [fullDownloadStarted, setFullDownloadStarted] = useState(false);
  const [filteredDownloadStarted, setFilteredDownloadStarted] = useState(false);
  const [downloadStarted, setDownloadStarted] = useState(false);

  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState("");
  const [downloadStatusDetailed, setDownloadStatusDetailed] = useState("");

  function getPredicate() {
    return {
      type: 'and',
      predicates: [
        rootPredicate,
        filter2predicate(currentFilterContext.filter, predicateConfig)
      ].filter(x => x)
    }
  }

  let activePredicate = getPredicate();
  let predicateEmpty = false;
  if (activePredicate && activePredicate.predicates && activePredicate.predicates[0].type != "and"){
    predicateEmpty = true
  }

  async function startFullDownload() {
    if (user) {
      window.location.href = dataset.archive.url;
      return {success: true}
    } else {
      siteContext.auth.signIn();
    }
  }

  async function startFilteredDownload() {

    const signIn = siteContext.auth?.signIn;

    if (user) {
      // validate the predicate - is there any filters set ?
      console.log(user);
      let download = {
        "datasetId": dataset.key,
        "creator": user.profile.sub,
        "notificationAddresses": [user.profile.sub],
        "predicate": activePredicate
      }

      let request = new XMLHttpRequest();
      request.open('POST', env.DOWNLOADS_API_URL + '/event/download', true);
      request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
      request.setRequestHeader('Authorization', 'Bearer ' + user.access_token);
      request.send(JSON.stringify(download));

      return {success: true}

    } else if (signIn) {
      signIn();
    }
  }

  const fullDownload = useCallback(() => {
    setDownloadStatus("Checking user....");
    setDownloadStatusDetailed("Checking the user is logged in....");
    startFullDownload().then((result) => {
      if (result.success) {
        setDownloadSuccess(true);
        setDownloadStatus("Download started !")
        setDownloadStatusDetailed("Your download has started")
      }
    });
    setFullDownloadStarted(true);
    setDownloadStarted(true);
  })

  const filteredDownload = useCallback(() => {

    setDownloadStatus("Checking user....");
    setDownloadStatusDetailed("Checking the user is logged in....");

    setFilteredDownloadStarted(true);
    setDownloadStarted(true);
    startFilteredDownload()
        .then((result) => {
          if (result.success){
            console.log("Download started...");
            setDownloadSuccess(true);
            setDownloadStatus("Download started !")
            setDownloadStatusDetailed("Your download has started")
          } else {
            console.log("Download failed...");
            setDownloadSuccess(false);
            setDownloadStatus("There was a problem !")
            setDownloadStatusDetailed("Your download has not started.")
          }
        });
  })

  return <div style={{ padding: "30px" }}>

      {fullDownloadStarted &&
        <PostFullDownloadForm hide={hide} downloadStatus={downloadStatus} downloadStatusDetailed={downloadStatusDetailed} />
      }

      {filteredDownloadStarted &&
        <PostFilteredDownloadForm hide={hide} downloadStatus={downloadStatus} downloadStatusDetailed={downloadStatusDetailed} downloadSuccess={downloadSuccess}/>
      }

      {!downloadStarted &&
          <PreDownloadForm
              startFullDownload={fullDownload}
              startFilterDownload={filteredDownload}
              predicateEmpty={predicateEmpty}
              hide={hide}
              dataset={dataset}
          />
      }
  </div>
}

export function PostFullDownloadForm({ hide, downloadStatus, downloadStatusDetailed }) {
  return <>
    <h3>{downloadStatus}</h3>
    <p>{downloadStatusDetailed}</p>
    <Button onClick={() => hide()} look="primaryOutline">Close</Button>
  </>
}

export function PostFilteredDownloadForm({ hide, downloadStatus, downloadStatusDetailed, downloadSuccess }) {
  return <>
    <h3>{downloadStatus}</h3>
    <p>{downloadStatusDetailed}</p>
    {downloadSuccess &&
        <p>
          The download will take approximately 10 minutes to create.
          <br/>
          After this time, you will receive an email sent to <br/>
          your registered email address with a link.
        </p>
    }
    <Button onClick={() => hide()} look="primaryOutline">Close</Button>
  </>
}

export function PreDownloadForm({ hide, dataset, startFullDownload, startFilterDownload, predicateEmpty }) {
  return <>
        <div>
          <h3>Download full dataset</h3>
          <p>
            To download the full dataset in zip format, click the "Download full dataset" button. <br/>
            This download will start immediately. The file size is {dataset.archive.fileSizeInMB}MB.<br/>
            <br/>
            <Button onClick={() => startFullDownload()} look="primaryOutline">Download full dataset</Button>
          </p>
          <br/>

          {predicateEmpty &&
              <div>
                <hr/>
                <br/>
              </div>
          }

          {predicateEmpty && <div>
            <h3>Download filtered dataset</h3>
            <p>
              To download the dataset filtered to your search, <br/>
              click the "Download filtered dataset"  button.<br/>
              This will take about 10 minutes to generate a zip file. <br/>
              Once generated, you'll received an email with a link. <br/>
              <br/>
              <Button onClick={() => startFilterDownload()} look="primaryOutline">Download filtered dataset</Button>
            </p>
            <br/>
            <hr/>
          </div> }

          <br/>
          <Button onClick={() => hide()} look="primaryOutline">Close</Button>
        </div>
  </>
}

DownloadForm.displayName = 'DownloadForm';