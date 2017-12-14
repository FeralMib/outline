// @flow
import { client } from './ApiClient';
import invariant from 'invariant';

type File = {
  blob: boolean,
  type: string,
  size: number,
  name?: string,
  file: string,
};

type Options = {
  name?: string,
};

export const uploadFile = async (file: File | Blob, option?: Options) => {
  // $FlowFixMe Blob makes life hard
  const filename = (option && option.name) || file.name;

  const response = await client.post('/user.s3Upload', {
    kind: file.type,
    size: file.size,
    filename,
  });

  invariant(response, 'Response should be available');

  const data = response.data;
  const asset = data.asset;
  const formData = new FormData();

  for (const key in data.form) {
    formData.append(key, data.form[key]);
  }

  if (file.blob) {
    // $FlowFixMe
    formData.append('file', file.file);
  } else {
    // $FlowFixMe
    formData.append('file', file);
  }

  const options: Object = {
    method: 'post',
    body: formData,
  };
  await fetch(data.uploadUrl, options);

  return asset;
};

export const dataUrlToBlob = (dataURL: string) => {
  var blobBin = atob(dataURL.split(',')[1]);
  var array = [];
  for (var i = 0; i < blobBin.length; i++) {
    array.push(blobBin.charCodeAt(i));
  }
  const file = new Blob([new Uint8Array(array)], { type: 'image/png' });
  return file;
};
