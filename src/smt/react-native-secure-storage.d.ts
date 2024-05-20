declare module 'react-native-secure-storage' {
    export interface SecureStorageOptions {
        accessible?: string;
    }

    export default class SecureStorage {
        static ACCESSIBLE: any;
        static setItem(key: string, value: string, options?: SecureStorageOptions): Promise<void>;
        static getItem(key: string, options?: SecureStorageOptions): Promise<string | null>;
        static removeItem(key: string, options?: SecureStorageOptions): Promise<void>;
    }
}
