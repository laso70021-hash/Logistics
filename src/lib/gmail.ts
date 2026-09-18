import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, User } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const provider = new GoogleAuthProvider();
provider.addScope('https://mail.google.com/');

let cachedAccessToken: string | null = null;

export const connectGmail = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Failed to get access token');
    }
    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error) {
    console.error('Gmail connection error:', error);
    throw error;
  }
};

export const getGmailToken = () => cachedAccessToken;

export const sendEmail = async (to: string, subject: string, bodyText: string) => {
  const token = cachedAccessToken;
  if (!token) {
    throw new Error('Gmail not connected. Please connect Gmail first.');
  }

  const emailLines = [
    `To: ${to}`,
    'Content-type: text/html;charset=iso-8859-1',
    'MIME-Version: 1.0',
    `Subject: ${subject}`,
    '',
    bodyText,
  ];

  const email = emailLines.join('\r\n').trim();
  const base64EncodedEmail = btoa(email).replace(/\+/g, '-').replace(/\//g, '_');

  const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      raw: base64EncodedEmail,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || 'Failed to send email');
  }

  return response.json();
};
