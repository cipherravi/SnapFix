export interface State {
  id: number;
  name: string;
}

export interface District {
  id: number;
  name: string;
  stateId: number;
}

interface DistrictWithState extends District {
  state: State;
}

export interface City {
  id: number;
  name: string;
  districtId: number;
  pincode: string;
}
interface CityWithDistrict extends City {
  district: DistrictWithState;
}

export interface Area {
  id: number;
  name: string;
  cityId: number;
  latitude: string;
  longitude: string;
}
interface AreaWithCity extends Area {
  city: CityWithDistrict;
}

export interface Address {
  id: number;
  building: string;
  street: string;
  areaId: number;
  cityId: number;
  isPrimary: boolean;
  latitude: string;
  longitude: string;
  area: AreaWithCity;
  createdAt: string;
  updatedAt: string;
}

interface Kyc {
  id: number;
  userId: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  gender: string;
  dateOfBirth: string;
  profilePicUrl: string;
  role: string;
  cityId: number;
  createdAt: string;
  updatedAt: string;
  kyc: Kyc;
  city: City;
}

export interface Asset {
  id: number;
  jobId: number;
  fileName: string;
  fileType: string;
  filePosition: string;
}

export interface Job {
  id: number;
  title: string;
  description: string;
  budget: number;
  status: string;
  userId: number;
  workerId: number;
  categoryId: number;
  cityId: number;
  address: string;
  addressId?: number;
  initialAddress: string;
  latitude: string;
  longitude: string;
  createdAt: string;
  updatedAt: string;
  assets: Asset[];
}

export interface Account {
  id: number;
  userId: number;
  accountHolder: string;
  accountNumber: number;
  bankName: string;
  ifsc: string;
  isPrimary: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
