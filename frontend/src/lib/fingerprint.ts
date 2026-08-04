import FingerprintJS from '@fingerprintjs/fingerprintjs';

export const getDeviceFingerprint = async (): Promise<string> => {
    try {
        const fp = await FingerprintJS.load();
        const result = await fp.get();
        return result.visitorId;
    } catch (error) {
        console.error('Failed to get device fingerprint:', error);
        // Fallback or handle error
        return 'unknown-device';
    }
};
