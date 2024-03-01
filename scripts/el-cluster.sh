#!/usr/bin/env bash

hostFile=/etc/hosts

elNetworkAddr='172.30.1.'
elPort=9200

usage() {
    echo "usage: $0 < test | prod > < up | down >"
    exit
}

addHosts() {

    rmHosts $@

    i=1
    for host in $@; do

#        echo ${elNetworkAddr}${i}   ${host}
        sudo sh -c "echo ${elNetworkAddr}${i}   ${host} >> ${hostFile}"
        i=$[i+1]

    done
}

rmHosts() {

  for host in $@; do

#      echo sed -i '' "/${host}/d" ${hostFile}
      sudo sed -i '' "/${host}/d" ${hostFile}
    done
}

addNetworkInterfaces() {

    i=1
    for host in $@; do

#        echo ifconfig lo0 alias ${elNetworkAddr}${i} up
        sudo ifconfig lo0 alias ${elNetworkAddr}${i} up
        i=$[i+1]

    done
}

removeNetworkInterfaces() {

    i=1
    for host in $@; do

#        echo fconfig lo0 remove ${elNetworkAddr}${i} up
        sudo ifconfig lo0 remove ${elNetworkAddr}${i} up
        i=$[i+1]

    done
}

setupSshTunnels() {

    i=1
    for host in $@; do

        echo ssh -f -N ${host} -L ${elNetworkAddr}${i}:${elPort}:localhost:${elPort}
        ssh -f -N ${host} -L ${elNetworkAddr}${i}:${elPort}:localhost:${elPort}
        i=$[i+1]

    done
}

[ $# -ne 2 ] && usage

case $1 in
    'test')
        elNodes=('aws-events-es-2022-1.ala' 'aws-events-es-2022-2.ala')
    ;;
    'prod')
        elNodes=()
    ;;
    *)
    usage
esac

case $2 in
    'up')
        echo 'up' ${elNodes[*]}
        addNetworkInterfaces ${elNodes[*]}
        setupSshTunnels ${elNodes[*]}
        addHosts ${elNodes[*]}
    ;;
    'down')
        echo 'down' ${elNodes[*]}

        removeNetworkInterfaces ${elNodes[*]}
        rmHosts ${elNodes[*]}
        pkill ssh
    ;;
    *) usage
esac
