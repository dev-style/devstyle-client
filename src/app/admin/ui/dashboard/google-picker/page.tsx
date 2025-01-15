// Indique que ce fichier doit être rendu côté client
"use client";

import { useEffect } from 'react';

const GooglePickerComponent = () => {
  // Remplacez ces valeurs par vos propres informations
  const SCOPE = ['https://www.googleapis.com/auth/drive.file']; // Scopes nécessaires

  useEffect(() => {
    // Fonction pour charger l'API Google Picker
    const loadPickerApi = () => {
      const script = document.createElement('script');
      script.src = "https://apis.google.com/js/api.js";
      script.onload = () => {
        window.gapi.load('auth', { 'callback': onAuthApiLoad });
        window.gapi.load('picker'); // Charge également l'API Picker
      };
      document.body.appendChild(script);
    };

    loadPickerApi();
  }, []);

  const onAuthApiLoad = () => {
    window.gapi.auth.authorize(
      {
        'client_id': process.env.AUTH_CLIENT_ID,
        'scope': SCOPE,
        'immediate': false,
      },
      handleAuthResult);
  };

  const handleAuthResult = (authResult: any) => {
    if (authResult && !authResult.error) {
      createPicker(authResult.access_token);
    } else {
      console.error("Erreur d'authentification", authResult.error);
    }
  };

  const createPicker = (accessToken) => {
    if (window.gapi && window.gapi.picker) {
      const picker = new window.gapi.picker.PickerBuilder()
        .addView(window.gapi.picker.ViewId.DOCS)
        .setOAuthToken(accessToken)
        .setDeveloperKey(process.env.DEVELOPER_KEY)
        .setCallback(pickerCallback)
        .build();
      picker.setVisible(true);
    }
  };

  const pickerCallback = (data) => {
    if (data[window.gapi.picker.Response.ACTION] === window.gapi.picker.Action.PICKED) {
      const doc = data[window.gapi.picker.Response.DOCUMENTS][0];
      const url = doc[window.gapi.picker.Document.URL];
      console.log('Vous avez sélectionné : ' + url);
    }
  };

  return (
    <div>
      <button onClick={() => onAuthApiLoad()}>Ouvrir Google Picker</button>
    </div>
  );
};

export default GooglePickerComponent;
