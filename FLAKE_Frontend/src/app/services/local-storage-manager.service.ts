import { Injectable } from '@angular/core';
export enum StorageKey{
  TOKEN="token",
  REFRESH = "refresh"
}
@Injectable({
  providedIn: 'root'
})
export class LocalStorageManagerService {

  constructor() { }
  setLocalStorage(storageKey: StorageKey,value: string){
    localStorage.setItem(storageKey, value);
  }
  getLocalStorage(storageKey: StorageKey){
    return localStorage.getItem(storageKey);
  }
  removeLocalStorage(storageKey: StorageKey){
    localStorage.removeItem(storageKey);
  }
  clearLocalStorage(){
    localStorage.clear();
  }

}
