import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import config from '../config';
import '../fonts/css/simtefac-embedded.css'
import { UserContext } from '../App';

export function QRCode() {
  const [qrCodeImage, setQrCodeImage] = useState<string>('');
  const user = useContext(UserContext);

  useEffect(() => {
    if (user) {
      axios
        .get(`${config.API_ROUTE}/users/me/qrcode`, { responseType: 'json' })
        .then((res) => {
          const imageSrc: string = res.data.content;
          setQrCodeImage(imageSrc);
        });
    } else {
      window.location.href = '/';
    }
  }, [user]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {qrCodeImage ? (
        <img
          src={qrCodeImage}
          alt="QR Code"
          style={{
            padding: '10px',
            width: '100%',
            maxWidth: '480px',
          }}
        />
      ) : (
        <div className="w-14 h-14 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mt-10"></div>
      )}

      {user && <span className="text-white mt-4">{user.email}</span>}
    </div>
  );
}