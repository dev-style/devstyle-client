import React, { useState } from 'react';
import useDrivePicker from 'react-google-drive-picker';
import { gapi } from "gapi-script"
const GooglePicker = () => {

  const AUTH_CLIENT_ID="1024237376609-4upjfcofd7me4f88fj6b4liic1p1luct.apps.googleusercontent.com";
  const DEVELOPER_KEY="AIzaSyBnz_wG0mnhTPEJYv37qBHAepAY8uBhdyI";


  const [openPicker] = useDrivePicker();

  const handleOpenPicker = () => {
    gapi.load('client:auth2', () => {
      gapi.client
        .init({
          apiKey: DEVELOPER_KEY,
        })
        .then(() => {
          let tokenInfo = gapi.auth.getToken();
          const pickerConfig: any = {
            clientId: AUTH_CLIENT_ID,
            developerKey: DEVELOPER_KEY,
            viewId: 'DOCS',
            viewMimeTypes: 'image/jpeg,image/png,image/gif',
            token: tokenInfo ? tokenInfo.access_token : null,
            showUploadView: true,
            showUploadFolders: true,
            supportDrives: true,
            multiselect: true,
            callbackFunction: (data: any) => {
              const elements = Array.from(
                document.getElementsByClassName(
                  'picker-dialog'
                ) as HTMLCollectionOf<HTMLElement>
              );
              for (let i = 0; i < elements.length; i++) {
                elements[i].style.zIndex = '2000';
              }
              if (data.action === 'picked') {
                //Add your desired workflow when choosing a file from the Google Picker popup
                //In this below code, I'm attempting to get the file's information. 
                if (!tokenInfo) {
                  tokenInfo = gapi.auth.getToken();
                }
                const fetchOptions = {
                  headers: {
                    Authorization: `Bearer ${tokenInfo.access_token}`,
                  },
                };
                const driveFileUrl = 'https://www.googleapis.com/drive';
                data.docs.map(async (item: any) => {
                  const response = await fetch(
                    `${driveFileUrl}/${item.id}?alt=media`,
                    fetchOptions
                  );
                });
              }
            },
          };
          openPicker(pickerConfig);
        });
    });
  };

  return (
    <div>
      <button
        onClick={() => handleOpenPicker()}
        color="primary"
      >
        Open Google Picker
      </button>
    </div>
  );
};

export default GooglePicker;