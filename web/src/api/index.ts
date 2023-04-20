import { DEMO } from "../configuration";
import {
    getPatients as apiGetPatients,
    getTherapists as apiGetTherapists,
    getObjectives as apiGetObjectives,
    getSessionsForPatient as apiGetSessionsForPatient,
    getSession as apiGetSession,
    getPatientBehaviorTrend as apiGetPatientBehaviorTrend
} from "./api";
import {
    getPatients as mockGetPatients,
    getTherapists as mockGetTherapists,
    getObjectives as mockGetObjectives,
    getSessionsForPatient as mockGetSessionsForPatient,
    getSession as mockGetSession,
    getPatientBehaviorTrend as mockGetPatientBehaviorTrend,
} from "./mockApi";

let getPatients = apiGetPatients;
let getTherapists = apiGetTherapists;
let getObjectives = apiGetObjectives;
let getSessionsForPatient = apiGetSessionsForPatient;
let getSession = apiGetSession;
let getPatientBehaviorTrend = apiGetPatientBehaviorTrend;


if (DEMO) {
    getPatients = mockGetPatients;
    getTherapists = mockGetTherapists;
    getObjectives = mockGetObjectives;
    getSessionsForPatient = mockGetSessionsForPatient;
    getSession = mockGetSession;
    getPatientBehaviorTrend = mockGetPatientBehaviorTrend;
}

export {
    getPatients,
    getTherapists,
    getObjectives,
    getSessionsForPatient,
    getSession,
    getPatientBehaviorTrend,
};
