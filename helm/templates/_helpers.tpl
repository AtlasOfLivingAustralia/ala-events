{{/*
Expand the name of the chart.
*/}}
{{- define "ala-events.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "ala-events.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "ala-events.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "ala-events.labels" -}}
helm.sh/chart: {{ include "ala-events.chart" . }}
{{ include "ala-events.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "ala-events.selectorLabels" -}}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
Create the name of the service account to use
*/}}
{{- define "ala-events.serviceAccountName" -}}
{{- if .Values.serviceAccount.create }}
{{- default (include "ala-events.fullname" .) .Values.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.serviceAccount.name }}
{{- end }}
{{- end }}

{{/*
Create a comma seperated list of ES node names
*/}}
{{- define "es-nodes" -}}
{{- $protocol := .protocol }}
{{- $clusterName := .clusterName }}
{{- $nodeGroup := .nodeGroup }}
{{- $httpPort := .httpPort }}
{{- $nodeCount := .replicas | int }}
  {{- range $index0, $e := until $nodeCount -}}
    {{- $index1 := $index0 | add1 -}}
{{ $protocol }}://{{ $clusterName }}-{{ $nodeGroup }}-{{ $index0 }}:{{ $httpPort }}{{ if ne $index1 $nodeCount }},{{ end }}
  {{- end -}}
{{- end -}}