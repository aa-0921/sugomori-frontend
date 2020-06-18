require('dotenv').config();
import * as React from 'react';
import { useState } from 'react';
import Dropzone, {
  IDropzoneProps,
  ILayoutProps,
  defaultClassNames,
  IPreviewProps,
} from 'react-dropzone-uploader';
import 'react-dropzone-uploader/dist/styles.css';
import { Grid, Row, Input, Button } from '@zeit-ui/react';

const postUrl: string = process.env.REACT_APP_API_URL_ALL_POST_DATAS!;

export const DropZone = () => {
  const [postData, setpostData] = useState('');

  const handleSubmit: IDropzoneProps['onSubmit'] = (Files, allFiles) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log('handleSubmit直後:', Files);
    }
    console.log(Files.map((f) => f.meta));
    allFiles.forEach((f) => f.remove());
    Files.map((f) => setpostData(f.meta.name));
    // setpostData(Files);
    if (process.env.NODE_ENV !== 'production') {
      console.log('postDataの内容:', postData);
    }
  };

  const postSubmit = async () => {
    // event.preventDefault();
    const submitData = new FormData();

    // submitData.append('formData', JSON.stringify(content));
    // submitData.append('formData', JSON.user_id(c1);
    // submitData.append('image', fileInput!.current.files[0]);
    submitData.append('picture', postData);
    submitData.append('content', content);
    submitData.append('user_id', '1');

    if (process.env.NODE_ENV !== 'production') {
      console.log('submitData:', submitData);
    }
    const method = 'POST';
    const body = submitData;

    const headers = {
      'Content-Type': 'multipart/form-data',
    };
    const postUrl: string = process.env.REACT_APP_API_URL_ALL_POST_DATAS!;
    if (process.env.NODE_ENV !== 'production') {
      console.log('postUrl: ', postUrl);
    }
    await fetch(postUrl, { method, headers, body })
      .then((response) => {
        if (response.status == 200) {
          if (process.env.NODE_ENV !== 'production') {
            console.log('投稿成功');
          }
        } else {
          if (process.env.NODE_ENV !== 'production') {
            console.log('投稿失敗');
          }
          throw new Error();
        }
      })
      .catch((error) => {
        if (process.env.NODE_ENV !== 'production') {
          console.log('投稿失敗');
        }
      });
  };
  const [content, setContent] = useState('');
  // const fileInput: RefObject<HTMLInputElement> = React.createRef();
  const fileInput = React.createRef<HTMLInputElement>();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContent(e.target.value);
  };
  // const handleChangeStatus = ({ meta }, status: any) => {
  const handleChangeStatus: IDropzoneProps['onChangeStatus'] = ({ meta }, status) => {
    console.log('status: ', status);
    console.log('meta: ', meta);
  };

  const Layout = ({
    input,
    previews,
    submitButton,
    dropzoneProps,
    files,
    extra: { maxFiles },
  }: ILayoutProps) => {
    return (
      <div>
        {previews}

        <div {...dropzoneProps}>{files.length < maxFiles && input}</div>

        {files.length > 0 && submitButton}
      </div>
    );
  };
  const Preview = ({ meta }: IPreviewProps) => {
    // const Preview = ({ meta }) => {
    const { name, percent, status } = meta;
    return (
      <span
        style={{
          alignSelf: 'flex-start',
          margin: '10px 3%',
          fontFamily: 'Helvetica',
        }}
      >
        {name}, {Math.round(percent)}%, {status}
      </span>
    );
  };
  return (
    <Grid.Container gap={-10} justify="center">
      <Row className="justify-content-md-center">
        <form>
          <Dropzone
            // autoUpload={false}
            // getUploadParams={getUploadParams}
            onChangeStatus={handleChangeStatus}
            LayoutComponent={Layout}
            onSubmit={handleSubmit}
            classNames={{
              inputLabelWithFiles: defaultClassNames.inputLabel,
            }}
            maxFiles={1}
            // PreviewComponent={Preview}
            inputContent="Drop Files"
          />
          <div className="form-group">
            <label className="form-label">コメント</label>
            <Input
              clearable
              placeholder="コメントを入力"
              type="text"
              name="content"
              value={content}
              onChange={handleChange}
            />

            <Input type="file" name="image" ref={fileInput} accept="image/*" />
            <Button type="success" ghost onClick={postSubmit}>
              Post
            </Button>
          </div>
        </form>
      </Row>
    </Grid.Container>
  );
};
