import React, { useState, useEffect, useCallback } from 'react';
import axios from '../../dataManagement/api/axios';
import { css } from '@emotion/react';
import Card from './Card';

export const AnnotationList = ({ token, contextType, contextKey, activeAnnotation, ...props }) => {
  const [annotations, setAnnotations] = useState([]);

  useEffect(() => {
    const fetchAnnotations = async () => {
      let params = {};
      if (contextType) params = Object.assign(params, { contextType });
      if (contextKey) params = Object.assign(params, { contextKey });
      const response = await (axios.get('http://labs.gbif.org:7013/v1/occurrence/annotation/rule', {params})).promise;
      setAnnotations(response.data);
    };

    fetchAnnotations();
  }, [contextType, contextKey]);

  const handleSupport = async (id) => {
    const response = await (axios.post(`http://labs.gbif.org:7013/v1/occurrence/annotation/rule/${id}/support`,
      null,
      {
        headers: { Authorization: `Bearer ${token}` },
      })).promise;
    if (response.status === 200) {
      setAnnotations((prevAnnotations) =>
        prevAnnotations.map((annotation) =>
          annotation.id === id ? response.data : annotation
        )
      );
    }
  };

  const handleContest = async (id) => {
    const response = await (axios.post(`http://labs.gbif.org:7013/v1/occurrence/annotation/rule/${id}/contest`,
      null,
      {
        headers: { Authorization: `Bearer ${token}` },
      })).promise;
    if (response.status === 200) {
      setAnnotations((prevAnnotations) =>
        prevAnnotations.map((annotation) =>
          annotation.id === id ? response.data : annotation
        )
      );
    }
  };

  const handleRemoveSupport = async (id) => {
    const response = await (axios.post(`http://labs.gbif.org:7013/v1/occurrence/annotation/rule/${id}/removeSupport`,
      null,
      {
        headers: { Authorization: `Bearer ${token}` },
      })).promise;
    if (response.status === 200) {
      setAnnotations((prevAnnotations) =>
        prevAnnotations.map((annotation) =>
          annotation.id === id ? response.data : annotation
        )
      );
    }
  };

  const handleRemoveContest = async (id) => {
    const response = await (axios.post(`http://labs.gbif.org:7013/v1/occurrence/annotation/rule/${id}/removeContest`,
      null,
      {
        headers: { Authorization: `Bearer ${token}` },
      })).promise;
    if (response.status === 200) {
      setAnnotations((prevAnnotations) =>
        prevAnnotations.map((annotation) =>
          annotation.id === id ? response.data : annotation
        )
      );
    }
  };

  const handleDelete = async (id) => {
    const response = await axios.delete(`http://labs.gbif.org:7013/v1/occurrence/annotation/rule/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      });
    if (response.status === 200) {
      setAnnotations((prevAnnotations) => prevAnnotations.filter((annotation) => annotation.id !== id));
    }
  };

  return (
    <div css={listStyle}>
      {annotations
      .filter(annotation => {
        if (activeAnnotation) {
          return annotation.id === activeAnnotation.id;
        } else {
          return true;
        }
      })
      .map((annotation) => (
        <Card 
          key={annotation.id}
          annotation={annotation}
          onSupport={handleSupport}
          onContest={handleContest}
          onRemoveSupport={handleRemoveSupport}
          onRemoveContest={handleRemoveContest}
          onDelete={handleDelete}
          token={token}
          />
      ))}
    </div>
  );
};

const listStyle = css`
  margin: 0 auto;
  max-width: 600px;
`;
