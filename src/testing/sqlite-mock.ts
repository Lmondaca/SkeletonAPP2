import { Provider } from '@angular/core';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';

// SQLite is a native Cordova/Capacitor plugin only available on-device;
// tests provide this stub so DI can resolve BdService outside a device.
export const sqliteMockProvider: Provider = { provide: SQLite, useValue: {} };
