// https://github.com/react-icons/react-icons/issues/238
// SVJ => JSON using https://react-icons-json-generator.surge.sh/
import { GenIcon } from 'react-icons';

const clusterJson = { "tag": "svg", "attr": { "version": "1.1", "id": "Capa_1", "x": "0px", "y": "0px", "viewBox": "-202.4 314.1 200.8 201.2", "style": "enable-background:new -202.4 314.1 200.8 201.2;" }, "child": [{ "tag": "path", "attr": { "d": "M-35.7,469.5c8.6-10.4,14.7-22.9,17.7-36l14.6,3.3c-3.4,15.4-10.6,30-20.8,42.3L-35.7,469.5z M-40.5,334.9\n\tc-12.6-9.7-27.5-16.3-43-19.1l-2.7,14.8c13.2,2.4,25.9,8.1,36.6,16.3L-40.5,334.9z M-198.2,385.6l14.4,4.4\n\tc3.9-12.9,10.9-24.8,20.3-34.5l-10.8-10.4C-185.3,356.4-193.6,370.5-198.2,385.6z M-168.8,490c11.8,10.6,26.2,18.3,41.5,22.3\n\tl3.8-14.5c-13-3.4-25.2-10-35.3-19L-168.8,490z M-189.7,464l13.1-7.3c-6.6-11.7-10.3-25.1-10.8-38.6l-15,0.6\n\tC-201.9,434.5-197.4,450.2-189.7,464z M-140.7,338.5c12.1-6.2,25.2-9.4,39-9.4v-15c-15.9,0-31.7,3.8-45.8,11L-140.7,338.5z\n\t M-1.7,403.5c-1.8-15.7-7.3-31-16.1-44.3l-12.5,8.3c7.5,11.2,12.2,24.3,13.7,37.6L-1.7,403.5z M-94.2,515.3\n\tc15.8-1.2,31.3-6.2,44.8-14.4l-7.8-12.8c-11.5,7-24.7,11.3-38.1,12.3L-94.2,515.3z" }, "child": [] }, { "tag": "g", "attr": {}, "child": [{ "tag": "circle", "attr": { "cx": "-119.9", "cy": "451.9", "r": "27" }, "child": [] }, { "tag": "circle", "attr": { "cx": "-84.2", "cy": "377.5", "r": "27" }, "child": [] }] }] };
const cluster = GenIcon(clusterJson)
export const ClusterIcon = props => cluster(props);

const gbifLogoJson = { "tag": "svg", "attr": { "viewBox": "90 239.1 539.7 523.9" }, "child": [{ "tag": "path", "attr": { "d": "M325.5,495.4c0-89.7,43.8-167.4,174.2-167.4C499.6,417.9,440.5,495.4,325.5,495.4" }, "child": [] }, { "tag": "path", "attr": { "d": "M534.3,731c24.4,0,43.2-3.5,62.4-10.5c0-71-42.4-121.8-117.2-158.4c-57.2-28.7-127.7-43.6-192.1-43.6\n\tc28.2-84.6,7.6-189.7-19.7-247.4c-30.3,60.4-49.2,164-20.1,248.3c-57.1,4.2-102.4,29.1-121.6,61.9c-1.4,2.5-4.4,7.8-2.6,8.8\n\tc1.4,0.7,3.6-1.5,4.9-2.7c20.6-19.1,47.9-28.4,74.2-28.4c60.7,0,103.4,50.3,133.7,80.5C401.3,704.3,464.8,731.2,534.3,731" }, "child": [] }] };
const gbifLogo = GenIcon(gbifLogoJson)
export const GbifLogoIcon = props => gbifLogo(props);

const sampleEventJson = { "tag": "svg", "attr": { "version": "1.1", "id": "Layer_1", "x": "0px", "y": "0px", "viewBox": "0 0 35.7 35.7", "style": "enable-background:new 0 0 35.7 35.7;" }, "child": [{ "tag": "circle", "attr": { "cx": "17.6", "cy": "17.7", "r": "4.2" }, "child": [] }, { "tag": "path", "attr": { "d": "M3.4,3.6v28.3h28.3V3.6H3.4z M27.6,27.8H7.5V7.7h20.1V27.8z" }, "child": [] }] };
const sampleEvent = GenIcon(sampleEventJson)
export const SampleEventIcon = props => sampleEvent(props);

const pilarJson = {"tag":"svg","attr":{"version":"1.1","id":"Layer_1","x":"0px","y":"0px","viewBox":"0 0 222.77 222.77","style":"enable-background:new 0 0 222.77 222.77;"},"child":[{"tag":"path","attr":{"d":"M0,0v222.77h222.77V0H0z M81.11,158.96c-0.02,4.32-3.02,7.11-6.91,6.92c-4.1-0.2-6.65-2.53-6.68-6.61\n\tc-0.13-19.65-0.12-39.3-0.01-58.95c0.01-1.18,1.04-2.77,2.07-3.46c3.44-2.28,7.09-4.23,11.58-6.84\n\tC81.17,113.71,81.23,136.33,81.11,158.96z M105.86,181.5c-0.01,2.56-0.99,5.78-2.71,7.54c-3.6,3.69-9.75,1.28-10.7-3.83\n\tc-0.3-1.62-0.21-3.32-0.21-4.98c-0.01-29.99,0.12-59.98-0.13-89.97c-0.04-4.97,1.09-8.18,5.85-10.03c2.45-0.95,4.64-2.56,7.76-4.33\n\tc0.11,2.08,0.23,3.36,0.23,4.64C105.97,114.18,106.03,147.84,105.86,181.5z M130.63,201.05c0,7.43-2.04,10.66-6.7,10.78\n\tc-4.83,0.12-7.13-3.37-7.13-10.96c-0.01-39.78-0.01-79.56,0-119.34c0-1.61,0.14-3.23,0.24-5.38c13.6,6.59,13.6,6.59,13.6,20.53\n\tC130.64,131.47,130.64,166.26,130.63,201.05z M155.29,158.13c-0.01,4.89-2.49,7.66-6.56,7.79c-4.19,0.13-7.1-2.86-7.11-7.83\n\tc-0.07-22.32-0.03-44.64-0.03-68.09c4.54,2.64,8.35,4.61,11.86,7.04c1.06,0.73,1.77,2.7,1.78,4.11\n\tC155.35,120.14,155.35,139.14,155.29,158.13z M168.01,84.1c-0.93,2.23-3.54,3.76-5.41,5.62c-2.88-1.37-4.87-2.16-6.72-3.22\n\tc-13.26-7.61-26.6-15.1-39.67-23.02c-3.7-2.24-6.27-1.99-9.82,0.13c-13.26,7.95-26.71,15.57-40.11,23.27\n\tc-5.08,2.92-9.17,2.3-11.21-1.55c-1.97-3.72-0.48-7.38,4.3-10.16c16.25-9.42,32.48-18.87,48.84-28.07c1.61-0.9,4.56-1,6.13-0.12\n\tc16.66,9.36,33.15,19.03,49.73,28.54C167.55,77.5,169.56,80.38,168.01,84.1z M168.31,61.78c-6.03-3.17-11.85-6.75-17.75-10.16\n\tc-11.95-6.9-23.95-13.73-35.82-20.79c-2.51-1.49-4.32-1.4-6.76,0.03C91.62,40.46,75.19,49.9,58.77,59.38\n\tc-1.87,1.08-3.7,2.34-5.71,3.05c-4.11,1.45-7.6,0.24-9.97-3.43c-2.26-3.51-1.37-8.1,2-10.75c1.43-1.12,3.08-1.97,4.66-2.88\n\tc19.29-11.15,38.61-22.26,57.86-33.48c2.53-1.48,4.48-1.85,7.24-0.23c20.08,11.78,40.33,23.28,60.36,35.14\n\tc2.7,1.6,4.49,4.72,5.73,6.07C180.91,61.19,174.34,64.95,168.31,61.78z"},"child":[]}]};
const pilar = GenIcon(pilarJson)
export const PilarIcon = props => pilar(props);

