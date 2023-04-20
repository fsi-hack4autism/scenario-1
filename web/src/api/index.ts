import { DEMO } from "../configuration";

import {
  getPatient as apiGetPatient,
  getPatients as apiGetPatients,
  createPatient as apiCreatePatient,
  getObjectives as apiGetObjectives,
  getObjective as apiGetObjective,
} from "./api";

import {
  getPatient as mockGetPatient,
  getPatients as mockGetPatients,
  createPatient as mockCreatePatient,
  getObjectives as mockGetObjectives,
  getObjective as mockGetObjective,
} from "./mockApi";

let getPatient = apiGetPatient;
let getPatients = apiGetPatients;
let createPatient = apiCreatePatient;
let getObjectives = apiGetObjectives;
let getObjective = apiGetObjective;

if (DEMO) {
  getPatient = mockGetPatient;
  getPatients = mockGetPatients;
  createPatient = mockCreatePatient;
  getObjectives = mockGetObjectives;
  getObjective = mockGetObjective;
}

export { getPatient, getPatients, createPatient, getObjectives, getObjective };
