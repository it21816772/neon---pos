import qz from 'qz-tray';
import api from '../../api/client';

let isInitialized = false;

const fetchCertificate = async () => {
  const inlineCert = import.meta.env.VITE_QZ_CERTIFICATE?.toString();
  if (inlineCert) {
    return inlineCert;
  }
  try {
    const { data } = await api.get<string>('/print/certificate', {
      transformResponse: (res) => res,
    });
    return data;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('Falling back to insecure certificate flow', error);
    }
    return '';
  }
};

const signMessage = async (toSign: string) => {
  const inlineKey = import.meta.env.VITE_QZ_PRIVATE_KEY?.toString();
  if (inlineKey) {
    return inlineKey; // placeholder; real implementation should sign
  }
  try {
    const { data } = await api.post<string>('/print/sign', { payload: toSign }, { transformResponse: (res) => res });
    return data;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('Signature endpoint unavailable', error);
    }
    return '';
  }
};

const setupSecurityPromises = () => {
  // Provide explicit any-typed signatures to satisfy TypeScript where the
  // QZ typings are not available in this project.
  qz.security.setCertificatePromise(async (resolve: (cert: any) => void, reject: (err: any) => void) => {
    try {
      resolve(await fetchCertificate());
    } catch (error) {
      reject(error);
    }
  });

  qz.security.setSignaturePromise(async (toSign: any) => signMessage(toSign));
};

export const ensureQzConnection = async () => {
  if (!isInitialized) {
    setupSecurityPromises();
    isInitialized = true;
  }

  if (!qz.websocket.isActive()) {
    await qz.websocket.connect();
  }
};

export const disconnectQz = async () => {
  if (qz.websocket.isActive()) {
    await qz.websocket.disconnect();
  }
};

export const printEscPos = async (hexPayload: string, printerName?: string) => {
  await ensureQzConnection();
  const config = qz.configs.create(printerName ?? null, {
    altPrinting: true,
    type: 'raw',
    encoding: 'hex',
  });

  await qz.print(config, [{ type: 'raw', format: 'hex', data: hexPayload }]);
};

